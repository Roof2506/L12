import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Gyroscope } from 'expo-sensors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
    },
});

export default function App() {
    const [mySound, setMySound] = useState(null);
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [message, setMessage] = useState('');
    const threshold = 4;

    async function playSound() {
        const soundfile = require('./Slash.mp3');
        const { sound } = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        Gyroscope.setUpdateInterval(100);
        let lastX = 0, lastY = 0, lastZ = 0;

        const subscription = Gyroscope.addListener(({ x, y, z }) => {
            setData({ x, y, z });

            const deltaX = Math.abs(x - lastX);
            const deltaY = Math.abs(y - lastY);
            const deltaZ = Math.abs(z - lastZ);

            if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
                playSound();
                setMessage('Kill!');
                setTimeout(() => setMessage(''), 3000);
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        return mySound
            ? () => {
                mySound.unloadAsync();
            }
            : undefined;
    }, [mySound]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}
