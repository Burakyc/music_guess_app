import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import GameScreen from './gamewaitingarea'; // Dosya yolunu kontrol edin
import axios from 'axios';

export default function HomeScreen() {
    const [playerName, setPlayerName] = useState('Player Name');
    const [editable, setEditable] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSearchOption, setSelectedSearchOption] = useState<string | null>(null);
    const [selectedCustomGameOption, setSelectedCustomGameOption] = useState<string | null>(null);
    const [showGameWaitingArea, setShowGameWaitingArea] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [lobbyId, setlobbyId] = useState<string | null>(null);

    const handleGame = async () => {
        if (!selectedType || !selectedCategory || !selectedSearchOption) {
            Alert.alert('Eksik Seçim', 'Lütfen tüm seçenekleri doldurduğunuzdan emin olun.');
            return;
        }

        try {
            const payload = {
                playerName: playerName.trim(),
                selectedType: selectedType,
                selectedCategory: selectedCategory,
                selectedSearchOption: selectedSearchOption,
                selectedCustomGameOption: selectedCustomGameOption || undefined,
            };

            const response = await axios.post('http://192.168.1.106:5000/create-lobby', payload);
            console.log('API Yanıtı:', response.data);

            // Yanıtın doğru formatta olup olmadığını kontrol edin ama ben etmeden yolluyorum
            setPlayerId(response.data.lobbyId);
            setShowGameWaitingArea(true);

        } catch (error) {
            console.error('API isteği sırasında bir hata oluştu:', error);
            Alert.alert('Hata', 'API isteği sırasında bir hata oluştu.');
        }
    };


    const handleNameChange = (name: string) => {
        setPlayerName(name);
    };

    const handleBack = () => {
        setShowGameWaitingArea(false);
        setPlayerId(null);
        setSelectedType(null);
        setSelectedCategory(null);
        setSelectedSearchOption(null);
        setSelectedCustomGameOption(null);
    };

    const handleSave = () => {
        if (playerName.length >= 3 && playerName.length <= 25) {
            setEditable(false);
        } else {
            Alert.alert('Geçersiz İsim', 'İsim 3 ile 25 karakter arasında olmalıdır.');
        }
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSearchOptionSelect = (option: string) => {
        setSelectedSearchOption(option);
        setSelectedCustomGameOption(null);
    };

    const handleCustomGameOptionSelect = (option: string) => {
        setSelectedCustomGameOption(option);
    };

    const handleProceed = () => {
        // Proceed işlemlerini burada tanımlayın
    };

    return (
        <SafeAreaView style={styles.container}>
            {showGameWaitingArea && playerId ? (
                <GameScreen playerId={playerId} onProceed={handleProceed} onBack={handleBack} />
            ) : (
                <>
                    <Text style={styles.welcomeText}>Welcome to Music Guess App!</Text>

                    <View style={styles.playerContainer}>
                        {editable ? (
                            <TextInput
                                style={styles.textInput}
                                value={playerName}
                                onChangeText={handleNameChange}
                                autoFocus
                                onBlur={handleSave}
                            />
                        ) : (
                            <Text style={styles.playerName}>{playerName}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => editable ? handleSave() : setEditable(true)}
                            style={styles.editButton}
                        >
                            <Text style={styles.editButtonText}>{editable ? 'Save' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.typeContainer}>
                        <Text style={styles.typeLabel}>Oyun Türü:</Text>
                        <View style={styles.buttonGroup}>
                            {['Şarkıcı İsmi', 'Müzik Sözü', 'Şarkıcı Adı'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleTypeSelect(type)}
                                    style={[
                                        styles.button,
                                        selectedType === type && styles.selectedButton,
                                    ]}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedType === type && styles.selectedButtonText,
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>Oyun Kategorisi:</Text>
                        <View style={styles.categoryButtonGroup}>
                            {['Pop', '80\'ler Müzikleri', 'Eurovision', 'Arabesk Şarkılar'].map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => handleCategorySelect(category)}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory === category && styles.selectedButton,
                                    ]}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedCategory === category && styles.selectedButtonText,
                                    ]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.searchContainer}>
                        <Text style={styles.searchLabel}>Oyun Ara:</Text>
                        <View style={styles.searchButtonGroup}>
                            {['Oyun Bul', 'Rastgele Ara', 'Özel Oyun'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => handleSearchOptionSelect(option)}
                                    style={[
                                        styles.searchButton,
                                        selectedSearchOption === option && styles.selectedButton,
                                    ]}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedSearchOption === option && styles.selectedButtonText,
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {selectedSearchOption === 'Oyun Bul' && (
                            <TouchableOpacity
                                onPress={handleGame}
                                style={styles.customGameButton}
                            >
                                <Text style={styles.buttonText}>Oyun Bul</Text>
                            </TouchableOpacity>
                        )}
                        {selectedSearchOption === 'Özel Oyun' && (
                            <View style={styles.customGameContainer}>
                                <TouchableOpacity
                                    onPress={() => Alert.alert('Özel Oyun Kur', 'Özel Oyun Kurma İşlemi')}
                                    style={styles.customGameButton}
                                >
                                    <Text style={styles.buttonText}>Özel Oyun Kur</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleCustomGameOptionSelect('Katıl')}
                                    style={[
                                        styles.customGameButton,
                                        selectedCustomGameOption === 'Katıl' && styles.selectedButton,
                                    ]}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedCustomGameOption === 'Katıl' && styles.selectedButtonText,
                                    ]}>
                                        Özel Oyun'a Katıl
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </>
            )
            }
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3213F5',
        padding: 16,
    },
    welcomeText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    playerContainer: {
        marginTop: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    playerName: {
        fontSize: 18,
        color: '#ffffff',
        marginRight: 10,
    },
    textInput: {
        fontSize: 18,
        color: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
        marginRight: 10,
        width: 150, // Düşürülmüş genişlik
    },
    editButton: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    editButtonText: {
        color: '#3213F5',
        fontWeight: 'bold',
    },
    typeContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    typeLabel: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 10,
    },
    categoryContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    categoryButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Butonları satırlara sarmak için
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 5,
        width: '30%', // Buton genişliğini daraltarak yer tasarrufu
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryButton: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 5,
        width: '45%', // Kategoriler için daha geniş butonlar
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    searchContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    searchLabel: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 10,
    },
    searchButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Butonları satırlara sarmak için
        justifyContent: 'center',
        width: '100%',
    },
    searchButton: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 5,
        width: '30%', // Arama butonları için genişlik
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    customGameContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    customGameButton: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 5,
        width: '60%', // Buton genişliği
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedButton: {
        borderColor: '#FFA500', // Turuncu sınır rengi
    },
    buttonText: {
        color: '#3213F5',
        fontWeight: 'bold',
    },
    selectedButtonText: {
        color: '#FFA500', // Turuncu yazı rengi seçilirse
    },
});