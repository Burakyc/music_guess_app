import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import YouTube from 'react-youtube';

interface GameScreenProps {
    lobby: {
        lobbyId: string;
        players: { id: string; name: string }[];
    };
}

export default function GameScreen({ lobby }: GameScreenProps) {
    const [videoId, setVideoId] = useState('');
    const [isPlayersVisible, setIsPlayersVisible] = useState(false); // For Accordion

    useEffect(() => {
        setVideoId('xEjOU731SFc'); // Example YouTube video ID
    }, []);

    const togglePlayersVisibility = () => {
        setIsPlayersVisible(!isPlayersVisible);
    };

    const formatPlayers = (players: { id: string; name: string }[]) => {
        return players.map(player => (
            <Text key={player.id} style={styles.playerName}>{player.name}</Text>
        ));
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
                        {Platform.OS === 'web' ? (
                            <YouTube
                                videoId={videoId}
                                opts={{
                                    height: '200',
                                    width: videoWidth.toString(),
                                    playerVars: {
                                        autoplay: 1,
                                    },
                                }}
                            />
                        ) : (
                            <WebView
                                style={{ width: videoWidth, height: videoHeight }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1` }}
                            />
                        )}
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>Loading video...</Text>
                )}
            </View>

            <View style={styles.playersContainer}>
                <TouchableOpacity onPress={togglePlayersVisibility}>
                    <Text style={styles.playersHeaderText}>
                        {isPlayersVisible ? 'Hide Players' : 'Show Players'}
                    </Text>
                </TouchableOpacity>

                {isPlayersVisible && (
                    <View style={styles.playersList}>
                        {formatPlayers(lobby.players)}
                    </View>
                )}
            </View>

            <View style={styles.optionsContainer}>
                <Text style={styles.questionText}>Which one is correct?</Text>

                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Option 1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Option 2</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Option 3</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
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
    playersContainer: {
        padding: 10,
        marginVertical: 10,
    },
    playersHeaderText: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        paddingVertical: 5,
        backgroundColor: '#2e4a7b',
        borderRadius: 5,
    },
    playersList: {
        backgroundColor: '#5C6BC0',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    playerName: {
        fontSize: 16,
        color: '#ffffff',
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
});
