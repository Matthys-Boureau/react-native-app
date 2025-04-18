import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

export default function Header({ onSearchChange }: HeaderProps) {
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (text: string) => {
        setSearchValue(text);
        onSearchChange(text);
    };

    const clearSearch = () => {
        setSearchValue('');
        onSearchChange('');
    };

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
                <Image source={require('../assets/images/pokeball.png')} style={{ width: 24, height: 24 }} />
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
                    <TouchableOpacity onPress={clearSearch} style={{ position: 'absolute', right: 20, top: '50%' , zIndex: 1 }}>
                        <Text style={{ fontSize: 20, color: '#888' }}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}