import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Playlist } from '../types/supabase';
import PlaylistManager from './PlaylistManager';

export default function ParentDashboard() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [likedVideos, setLikedVideos] = useState<any[]>([]); // Using any for join result, or define type
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlaylists();
        fetchLikedVideos();
    }, []);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('playlists')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPlaylists(data || []);
        } catch (error: any) {
            Alert.alert('Error fetching playlists', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedVideos = async () => {
        try {
            // Join likes with videos to get title/details
            // We select videos(*), and we will get an array of like objects { videos: { ... } }
            const { data, error } = await supabase
                .from('likes')
                .select('*, videos(*)')
                .order('created_at', { ascending: false })
                .limit(10); // Show top 10 recent likes

            if (error) throw error;

            // Transform data to extract video details
            // Supabase returns { ..., videos: { id: ..., title: ... } }
            // Note: videos is singular object because video_id is FK
            const videos = data?.map((like: any) => like.videos).filter(Boolean) || [];

            // Remove duplicates if multiple likes on same video (though DB constraint might effectively prevent this if we clean up, but for now we just show recent)
            // Ideally we'd group by video_id, but for MVP this is fine.
            setLikedVideos(videos);
        } catch (error) {
            console.log('Error fetching liked videos', error);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistTitle.trim()) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                Alert.alert("Authentication Required", "Please sign in to create playlists.");
                return;
            }

            const { error } = await supabase
                .from('playlists')
                .insert([
                    {
                        title: newPlaylistTitle,
                        parent_id: session.user.id
                    }
                ]);

            if (error) throw error;

            setNewPlaylistTitle('');
            setIsCreating(false);
            fetchPlaylists();
            Alert.alert('Success', 'Playlist created!');
        } catch (error: any) {
            Alert.alert('Error creating playlist', error.message);
        }
    };

    const handlePlaylistPress = (playlistId: string) => {
        setSelectedPlaylistId(playlistId);
    };

    if (selectedPlaylistId) {
        return (
            <PlaylistManager
                playlistId={selectedPlaylistId}
                onBack={() => {
                    setSelectedPlaylistId(null);
                    fetchPlaylists();
                    fetchLikedVideos();
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Dashboard</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                    <Text style={styles.createButtonText}>+ New Playlist</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Liked Videos Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>❤️ Kids' Favorites</Text>
                    {likedVideos.length === 0 ? (
                        <Text style={styles.emptySubText}>No liked videos yet.</Text>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {likedVideos.map((video, index) => (
                                <View key={`${video.id}-${index}`} style={styles.likedCard}>
                                    <View style={styles.videoPreview}>
                                        <Ionicons name="play-circle-outline" size={32} color="#666" />
                                    </View>
                                    <Text style={styles.likedTitle} numberOfLines={2}>{video.title || "Untitled"}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Playlists Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📂 Your Playlists</Text>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <View>
                            {playlists.length === 0 ? (
                                <Text style={styles.emptyText}>No playlists yet. Create one!</Text>
                            ) : (
                                playlists.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.playlistItem}
                                        onPress={() => handlePlaylistPress(item.id)}
                                    >
                                        <View style={styles.playlistIcon}>
                                            <Ionicons name="list" size={24} color="#007AFF" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.playlistTitle}>{item.title}</Text>
                                            <Text style={styles.playlistDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal visible={isCreating} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Playlist</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Playlist Name (e.g. Science Fun)"
                            value={newPlaylistTitle}
                            onChangeText={setNewPlaylistTitle}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsCreating(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreatePlaylist} style={styles.saveButton}>
                                <Text style={[styles.buttonText, { color: 'white' }]}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        color: '#444',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    horizontalScroll: {
        flexDirection: 'row',
    },
    likedCard: {
        backgroundColor: 'white',
        width: 140,
        padding: 10,
        borderRadius: 12,
        marginRight: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    videoPreview: {
        width: '100%',
        height: 80,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    likedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    playlistItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    playlistIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    playlistTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    playlistDate: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 12,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '600',
        color: '#333',
    }
});
