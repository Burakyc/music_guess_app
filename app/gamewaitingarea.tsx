import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import axios from 'axios';
import GameScreen from './gamescreen'; // Import GameScreen component

interface WaitingScreenProps {
    playerId: string;
    onProceed: () => void;
    onBack: () => void;
}

export default function WaitingScreen({ playerId, onProceed, onBack }: WaitingScreenProps) {
    const [lobbies, setLobbies] = useState<{ lobbyId: string; players: { id: string; name: string }[] } | null>(null);
    const [showMainScreen, setShowMainScreen] = useState(false);

    const handleLogin = () => {
        setShowMainScreen(true);
    };

    const fetchLobbies = async () => {
        try {
            if (!playerId) {
                console.error('Oyuncu ID mevcut değil.');
                return;
            }

            const response = await axios.get('http://192.168.1.106:5000/get-lobbies', {
                params: { playerId }
            });

            console.log('API Response:', response.data);

            if (
                response.data &&
                typeof response.data === 'object' &&
                response.data.lobbyId &&
                Array.isArray(response.data.players)
            ) {
                setLobbies(response.data);
            } else {
                console.error('API yanıtında beklenen formatta lobi bilgisi bulunamadı.');
            }
        } catch (error) {
            console.error('Lobby bilgileri alınırken bir hata oluştu:', error);
        }
    };

    const updateReadyStatus = async () => {
        try {
            if (!lobbies || !playerId) {
                console.error('Lobi veya Oyuncu bilgisi mevcut değil.');
                return;
            }

            const response = await axios.post('http://192.168.1.106:5000/update-ready-status', {
                lobbyId: lobbies.lobbyId,
                playerId: playerId,
                ready: 'ready'
            });

            console.log('Ready durumu güncellendi:', response.data);

            if (response.data.status === 'success') {
                handleLogin(); // Show the MainScreen after successfully updating the ready status
            } else {
                console.error('Ready durumu güncellenemedi:', response.data.message);
            }
        } catch (error) {
            console.error('Ready durumu güncellenirken bir hata oluştu:', error);
        }
    };

    useEffect(() => {
        fetchLobbies();

        const intervalId = setInterval(fetchLobbies, 5000);

        return () => clearInterval(intervalId);
    }, [playerId]);

    const formatPlayers = (players: { id: string; name: string }[]) => {
        return players.map(player => player.name).join('\n');
    };

    // Conditionally render GameScreen if showMainScreen is true
    if (showMainScreen && lobbies) {
        return <GameScreen lobby={lobbies} />; // Pass lobbies to GameScreen
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#3213F5"
                hidden={false}
                translucent={true}
            />
            <View style={styles.content}>
                <View style={styles.lobbyContainer}>
                    <Text style={styles.lobbyHeader}>Lobideki Kişiler:</Text>
                    {lobbies ? (
                        <View>
                            <Text style={styles.lobbyItemHeader}>
                                Lobby ID: {lobbies.lobbyId}
                            </Text>
                            <Text style={styles.lobbyItemHeader}>
                                Oyuncular: {"\n" + formatPlayers(lobbies.players)}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.lobbyPlaceholder}>Lobi boş veya veriler yüklenemedi.</Text>
                    )}
                </View>
                <View style={styles.waitingContent}>
                    <Text style={styles.text}>Oyun Bekleme Ekranı</Text>
                    <Text style={styles.description}>Oyun başlamak üzere, lütfen bekleyin...</Text>
                    <TouchableOpacity style={styles.button} onPress={updateReadyStatus}>
                        <Text style={styles.buttonText}>Oyunu başlat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onBack}>
                        <Text style={styles.buttonText}>Ana Menü</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3213F5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    lobbyContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#4A3BEB',
        borderRadius: 10,
        marginBottom: 20,
    },
    lobbyHeader: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    lobbyItemContainer: {
        marginBottom: 15,
    },
    lobbyItemHeader: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
    lobbyItemPlayers: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    lobbyItemError: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    lobbyPlaceholder: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    waitingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF6F00',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '50%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
