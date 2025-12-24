import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { usePlaylist } from '../context/PlaylistContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function VideoFeed() {
    const { playlist } = usePlaylist();
    const [playingId, setPlayingId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            if (visibleItem.item) {
                setPlayingId(visibleItem.item as string);
            }
        }
    }, []);

    const renderItem = ({ item }: { item: string }) => {
        const isPlaying = item === playingId;

        // Calculate custom height to account for navbar/safe area if needed, 
        // but for full screen feed we usually want full height.
        const itemHeight = height - insets.top - insets.bottom;

        return (
            <View style={[styles.videoContainer, { height: height }]}>
                <View style={styles.playerWrapper}>
                    <YoutubePlayer
                        height={300} // Vertical videos need adjustment, standard player is 16:9. 
                        // For "Shorts" feel, we might want to scale it or use specific props if available.
                        // Standard YouTube iframe doesn't truly support "Shorts" player mode via API identically to TikTok.
                        // We will just center the video for now.
                        play={isPlaying}
                        videoId={item}
                        onChangeState={(state: string) => {
                            if (state === 'ended') {
                                // Logic to scroll to next?
                            }
                        }}
                    />
                </View>
            </View>
        );
    };

    if (playlist.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No videos in playlist!</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: 'blue' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={playlist}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 80
                }}
                contentContainerStyle={{ backgroundColor: 'black' }}
            />

            {/* Hidden Exit Button (Top Right) */}
            <TouchableOpacity
                style={[styles.exitButton, { top: insets.top + 10 }]}
                onPress={() => router.replace('/')}
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
    exitButton: {
        position: 'absolute',
        right: 20,
        padding: 10,
        zIndex: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
