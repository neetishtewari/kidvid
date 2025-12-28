import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Video } from '../types/supabase';

type Props = {
    playlistId: string;
    onBack: () => void;
};

export default function PlaylistManager({ playlistId, onBack }: Props) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, [playlistId]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .eq('playlist_id', playlistId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setVideos(data || []);
        } catch (error: any) {
            Alert.alert('Error fetching videos', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideo = async () => {
        // Basic YouTube URL Regex
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            const youtubeId = match[2];
            setAdding(true);

            try {
                // Ideally we'd fetch video metadata (title) from YouTube API here.
                // For MVP, we'll just save the ID and maybe a generic title.
                const { error } = await supabase
                    .from('videos')
                    .insert([
                        {
                            playlist_id: playlistId,
                            youtube_id: youtubeId,
                            title: `Video ${youtubeId}` // Placeholder
                        }
                    ]);

                if (error) throw error;

                setUrl('');
                fetchVideos();
                Alert.alert('Success', 'Video added to playlist!');
            } catch (error: any) {
                Alert.alert('Error adding video', error.message);
            } finally {
                setAdding(false);
            }
        } else {
            Alert.alert('Error', 'Invalid YouTube URL');
        }
    };

    const handleDeleteVideo = async (id: string) => {
        try {
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchVideos();
        } catch (error: any) {
            Alert.alert('Error removing video', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Edit Playlist</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Paste YouTube Link"
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={[styles.addButton, adding && styles.disabledButton]}
                    onPress={handleAddVideo}
                    disabled={adding}
                >
                    <Text style={styles.buttonText}>{adding ? '...' : 'Add'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={videos}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.videoItem}>
                        <Image
                            source={{ uri: `https://img.youtube.com/vi/${item.youtube_id}/default.jpg` }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.videoInfo}>
                            <Text style={styles.videoTitle} numberOfLines={2}>
                                {item.title || `Video ${index + 1}`}
                            </Text>
                            <Text style={styles.videoMeta}>ID: {item.youtube_id}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteVideo(item.id)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No videos yet. Add some!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    videoItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    thumbnail: {
        width: 80,
        height: 60,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    videoInfo: {
        flex: 1,
        marginLeft: 10,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    videoMeta: {
        fontSize: 12,
        color: '#888',
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
    },
});
