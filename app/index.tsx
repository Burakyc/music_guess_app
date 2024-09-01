import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import MainScreen from './mainscreen';
//import MainScreen from './gamescreen';

export default function App() {
    const [showMainScreen, setShowMainScreen] = useState(false);

    const handleLogin = () => {
        setShowMainScreen(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#3213F5"
                hidden={false}
                translucent={true}
            />
            {showMainScreen ? (
                <MainScreen />
            ) : (
                <View style={styles.content}>
                    <Text style={styles.text}>Welcome to the App</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    },
    text: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
