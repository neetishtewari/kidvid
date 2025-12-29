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
    // Initialize with window height as a fallback
    const [containerHeight, setContainerHeight] = useState(windowHeight);

    const insets = useSafeAreaInsets();
    const router = useRouter();

    useEffect(() => {
        fetchVideos();
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
    metaContainer: {
        padding: 20,
    },
    videoTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
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
