import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
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
                    onPress={() => router.push('/parent')}
                >
                    <Text style={styles.buttonText}>👨‍👩‍👧 Parent Mode</Text>
                </TouchableOpacity>
            </View>
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
});
