import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import ReactPlayer from 'react-player/lazy'; // Use the lazy version

export default function GameScreen() {
    const [score, setScore] = useState(0);
    const [videoId, setVideoId] = useState('');

    useEffect(() => {
        setVideoId('dQw4w9WgXcQ'); // Example YouTube video ID
    }, []);

    const handleOptionPress = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(score + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome to Music Guess App!</Text>
            </View>

            <View style={styles.videoContainer}>
                {videoId ? (
                    <ReactPlayer
                        controls={true}
                        url={`https://www.youtube.com/watch?v=${videoId}`}
                        width='100%'
                        height='100%'
                    />
                ) : (
                    <Text style={styles.placeholderText}>Loading video...</Text>
                )}
            </View>

            <View style={styles.optionsContainer}>
                <Text style={styles.questionText}>Which one is correct?</Text>

                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress(true)}>
                        <Text style={styles.optionText}>Option 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress(false)}>
                        <Text style={styles.optionText}>Option 2</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress(false)}>
                        <Text style={styles.optionText}>Option 3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionPress(false)}>
                        <Text style={styles.optionText}>Option 4</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3213F5',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    videoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 65,
        height: 200,
        marginHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888888',
    },
    optionsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    questionText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 15,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 65,
        marginVertical: 5,
    },
    optionButton: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
});
