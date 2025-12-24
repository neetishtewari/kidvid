import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { usePlaylist } from '../context/PlaylistContext';

export default function ParentDashboard() {
    const [url, setUrl] = useState('');
    const { playlist, addToPlaylist, removeFromPlaylist } = usePlaylist();

    const handleAddVideo = () => {
        // Basic YouTube URL Regex
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            const videoId = match[2];
            if (playlist.includes(videoId)) {
                Alert.alert("Info", "Video already in playlist");
                return;
            }
            addToPlaylist(videoId);
            setUrl('');
            Alert.alert('Success', 'Video added to playlist!');
        } else {
            Alert.alert('Error', 'Invalid YouTube URL');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Parent Dashboard</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Add YouTube Video URL:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://youtube.com/watch?v=..."
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddVideo}>
                    <Text style={styles.buttonText}>Add to Playlist</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subHeader}>Current Playlist ({playlist.length})</Text>
            <FlatList
                data={playlist}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.videoItem}>
                        <Text style={{ flex: 1 }}>ID: {item}</Text>
                        <TouchableOpacity onPress={() => removeFromPlaylist(item)}>
                            <Text style={{ color: 'red' }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    videoItem: {
        padding: 10,
        backgroundColor: '#eee',
        marginBottom: 5,
        borderRadius: 5,
    },
});
