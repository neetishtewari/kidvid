import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Playlist } from '../types/supabase';
import PlaylistManager from './PlaylistManager';

export default function ParentDashboard() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlaylists();
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

    const handleCreatePlaylist = async () => {
        if (!newPlaylistTitle.trim()) return;

        try {
            // For MVP, we need a parent_id. 
            // If user is not logged in, this will fail if RLS enforces authentication.
            // For now, let's check if we have a session.
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                Alert.alert("Authentication Required", "Please sign in to create playlists.");
                // Ensure we have a way to sign in - for now just alert.
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

    // Placeholder for when we click a playlist to edit it
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
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Your Playlists</Text>
                <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                    <Text style={styles.createButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={playlists}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>No playlists yet. Create one!</Text>}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.playlistItem}
                            onPress={() => handlePlaylistPress(item.id)}
                        >
                            <Text style={styles.playlistTitle}>{item.title}</Text>
                            <Text style={styles.playlistDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

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
                                <Text style={styles.buttonText}>Create</Text>
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
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
    playlistItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    playlistTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    playlistDate: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
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
        color: 'black', // Default override for white bg buttons, but handled for saveButton if needed
    }
});
