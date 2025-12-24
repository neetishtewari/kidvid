import { View, StyleSheet } from 'react-native';
import VideoFeed from '../../src/components/VideoFeed';
import { StatusBar } from 'expo-status-bar';

export default function KidScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <VideoFeed />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
