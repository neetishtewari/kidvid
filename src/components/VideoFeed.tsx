import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { supabase } from '../lib/supabase';
import { Video } from '../types/supabase';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

export default function VideoFeed() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
    const [containerHeight, setContainerHeight] = useState(windowHeight);

    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        fetchVideos();
        fetchLikes();
    }, []);

    const fetchVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVideos(data || []);
        } catch (error: any) {
            Alert.alert("Error fetching videos", error.message);
        }
    };

    const fetchLikes = async () => {
        try {
            const { data, error } = await supabase
                .from('likes')
                .select('video_id');

            if (error) throw error;

            const ids = new Set(data?.map(l => l.video_id));
            setLikedVideoIds(ids);
        } catch (error) {
            console.log('Error fetching likes', error);
        }
    };

    const toggleLike = async (videoId: string) => {
        const isLiked = likedVideoIds.has(videoId);

        // Optimistic update
        const newSet = new Set(likedVideoIds);
        if (isLiked) {
            newSet.delete(videoId);
        } else {
            newSet.add(videoId);
        }
        setLikedVideoIds(newSet);

        try {
            if (isLiked) {
                // Unlike
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('video_id', videoId);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from('likes')
                    .insert([{ video_id: videoId }]);
                if (error) throw error;
            }
        } catch (error: any) {
            Alert.alert("Error updating like", error.message);
            // Revert on error
            setLikedVideoIds(likedVideoIds);
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            if (visibleItem.item) {
                const video = visibleItem.item as Video;
                setPlayingId(video.id);
            }
        }
    }, []);

    const renderItem = ({ item }: { item: Video }) => {
        const isPlaying = item.id === playingId;
        const isLiked = likedVideoIds.has(item.id);

        return (
            <View style={[styles.videoContainer, { height: containerHeight }]}>
                {/* Center the player in the container */}
                <View style={[styles.playerWrapper, { height: containerHeight, justifyContent: 'center' }]}>
                    <YoutubePlayer
                        height={300}
                        width={windowWidth}
                        play={isPlaying}
                        videoId={item.youtube_id}
                        initialPlayerParams={{
                            controls: false,
                            modestbranding: true,
                            rel: false,
                        }}
                    />

                    {/* Overlay Controls */}
                    <View style={styles.rightControls}>
                        <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.actionButton}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={40}
                                color={isLiked ? "#ff3b30" : "white"}
                            />
                            <Text style={styles.actionText}>{isLiked ? "Liked" : "Like"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.metaContainer}>
                        <Text style={styles.videoTitle}>{item.title || "Untitled Video"}</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (videos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={{ color: 'white', marginBottom: 20 }}>No videos found. Ask your parent to add some!</Text>
                <TouchableOpacity onPress={() => fetchVideos()} style={styles.retryButton}>
                    <Text style={{ color: 'black' }}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#007AFF' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View
            style={styles.container}
            onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
            <FlatList
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 80
                }}
                contentContainerStyle={{ backgroundColor: 'black' }}
                removeClippedSubviews={true}
                windowSize={3}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
            />

            {/* Hidden Exit Button (Top Right) */}
            <TouchableOpacity
                style={[styles.exitButton, { top: insets.top + 10 }]}
                onPress={() => router.back()}
            >
                <Text style={{ color: 'white', opacity: 0.5 }}>Exit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerWrapper: {
        width: '100%',
    },
    rightControls: {
        position: 'absolute',
        right: 15,
        bottom: 100,
        alignItems: 'center',
        zIndex: 10,
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    metaContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 80, // Leave room for right controls
    },
    videoTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    exitButton: {
        position: 'absolute',
        right: 20,
        padding: 10,
        zIndex: 100,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    }
});
