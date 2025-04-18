import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';

interface HeaderProps {
  onSearchChange: (text: string) => void;
}

export default function Header({ onSearchChange }: HeaderProps) {
    const [searchValue, setSearchValue] = useState('');
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Demander les permissions au chargement
    useEffect(() => {
        (async () => {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
        })();
    }, []);

    const toggleSound = async () => {
        try {
            if (sound && isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
                return;
            }
            
            if (sound && !isPlaying) {
                await sound.playAsync();
                setIsPlaying(true);
                return;
            }
            
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../assets/sound/pokemon.mp3'),
                { shouldPlay: true }
            );
            
            setSound(newSound);
            setIsPlaying(true);
            
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                }
                
                if (!status.isLoaded && 'error' in status) {
                    console.error("Erreur de lecture:", status.error);
                    Alert.alert("Erreur", "Impossible de lire l'audio");
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.error("Erreur lors du chargement du son:", error);
            Alert.alert("Erreur", "Problème lors du chargement de l'audio");
            setIsPlaying(false);
        }
    };

    const handleChange = (text: string) => {
        setSearchValue(text);
        onSearchChange(text);
    };

    const clearSearch = () => {
        setSearchValue('');
        onSearchChange('');
    };

    // Nettoyer le son lors du démontage du composant
    React.useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <View
            style={{
                backgroundColor: '#FF495C',
                paddingVertical: 16,
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
            }}>
                <TouchableOpacity onPress={toggleSound}>
                    <Image 
                        source={require('../assets/images/pokeball.png')} 
                        style={{ 
                            width: 24, 
                            height: 24,
                            opacity: isPlaying ? 0.7 : 1,
                            transform: [{ scale: isPlaying ? 1.1 : 1 }]
                        }} 
                    />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }}>Pokédex</Text>
            </View>

            <View style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                position: 'relative',
            }}>
                <TextInput
                    placeholder="Rechercher un Pokémon..."
                    placeholderTextColor="#666666"
                    value={searchValue}
                    onChangeText={handleChange}
                    style={{
                        paddingVertical: 16,
                        paddingLeft: 32,
                        paddingRight: 32,
                        borderRadius: 16,
                        fontSize: 16,
                        backgroundColor: '#fff',
                    }}
                />

                <Image source={require('../assets/images/loupe.png')} style={{
                    position: 'absolute',
                    left: 20,
                    top: '50%',
                    width: 16,
                    height: 16,
                    tintColor: '#888',
                }} />

                {searchValue.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={{ position: 'absolute', right: 20, top: '50%', zIndex: 1 }}>
                        <Text style={{ fontSize: 20, color: '#888' }}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}