import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import axios from 'axios';

interface WaitingScreenProps {
    playerId: string;
    onProceed: () => void;
    onBack: () => void;
}

export default function WaitingScreen({ playerId, onProceed, onBack }: WaitingScreenProps) {
    const [lobbies, setLobbies] = useState<any[]>([]);

    const fetchLobbies = async () => {
        try {
            if (!playerId) {
                console.error('Oyuncu ID mevcut değil.');
                return;
            }

            const response = await axios.get('http://127.0.0.1:5000/get-lobbies', {
                params: { playerId }
            });

            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setLobbies(response.data);
            } else {
                console.error('API yanıtında beklenen formatta lobi bilgisi bulunamadı.');
            }
        } catch (error) {
            console.error('Lobby bilgileri alınırken bir hata oluştu:', error);
        }
    };

    useEffect(() => {
        fetchLobbies();
    }, [playerId]);

    // Bu fonksiyon artık diziyi '\n' ile ayırarak bir string oluşturur
    const formatPlayers = (players: string[]) => {
        return players.join('\n');
    };

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
                    {lobbies.length > 0 ? (
                        <View>
                            <Text style={styles.lobbyItemHeader}>
                                Lobby ID: {lobbies[0]}
                            </Text>

                            <Text style={styles.lobbyItemHeader}>
                                Oyuncular: {"\n" + formatPlayers(lobbies[1])}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.lobbyPlaceholder}>Lobi boş veya veriler yüklenemedi.</Text>
                    )}
                </View>
                <View style={styles.waitingContent}>
                    <Text style={styles.text}>Oyun Bekleme Ekranı</Text>
                    <Text style={styles.description}>Oyun başlamak üzere, lütfen bekleyin...</Text>
                    <TouchableOpacity style={styles.button} onPress={onProceed}>
                        <Text style={styles.buttonText}>Hazır</Text>
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
