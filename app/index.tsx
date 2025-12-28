import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
    const [isPinModalVisible, setIsPinModalVisible] = useState(false);
    const [pin, setPin] = useState('');

    const handleParentPress = () => {
        setIsPinModalVisible(true);
    };

    const handlePinSubmit = () => {
        if (pin === '1234') { // Hardcoded for MVP
            setIsPinModalVisible(false);
            setPin('');
            router.push('/parent');
        } else {
            Alert.alert('Incorrect PIN', 'Please try again.');
            setPin('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome to KidVid</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.kidButton]}
                    onPress={() => router.push('/kid')}
                >
                    <Text style={styles.buttonText}>🧒 Kid Mode</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.parentButton]}
                    onPress={handleParentPress}
                >
                    <Text style={styles.buttonText}>👨‍👩‍👧 Parent Mode</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isPinModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Parent PIN</Text>
                        <TextInput
                            style={styles.pinInput}
                            value={pin}
                            onChangeText={setPin}
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            placeholder="****"
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsPinModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePinSubmit} style={styles.submitButton}>
                                <Text style={[styles.modalButtonText, { color: 'white' }]}>Enter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#333',
    },
    buttonContainer: {
        width: '80%',
        gap: 20,
    },
    button: {
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    kidButton: {
        backgroundColor: '#4ECDC4',
    },
    parentButton: {
        backgroundColor: '#FF6B6B',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pinInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 15,
        flex: 1,
        alignItems: 'center',
    },
    submitButton: {
        padding: 15,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginLeft: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});
