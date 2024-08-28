import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

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

    const videoHeight = 200; // Fixed height for the video
    const videoWidth = videoHeight * (16 / 9); // Maintain the 16:9 aspect ratio

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome to Music Guess App!</Text>
            </View>

            <View style={styles.videoContainer}>
                {videoId ? (
                    <View style={styles.videoWrapper}>
                        <YoutubeIframe
                            height={videoHeight}
                            width={videoWidth}
                            videoId={videoId}
                            play={true}
                            initialPlayerParams={{
                                start: 10, // Start video at the 10th second
                            }}
                            onChangeState={event => console.log(event)}
                        />
                    </View>
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
        backgroundColor: '#000', // Black background to simulate letterboxing
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    videoWrapper: {
        position: 'relative',
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
