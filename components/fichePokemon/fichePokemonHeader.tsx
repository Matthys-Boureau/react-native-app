import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface FicheHeaderProps {
    pokemon: {
        name: string
        id: number
    }
    router: {
        back: () => void
    }
}

export default function FicheHeader({ pokemon, router }: FicheHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backArrow}>←</Text>
                <Text style={styles.name}>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </Text>
            </TouchableOpacity>
            <Text style={styles.idText}>#{String(pokemon.id).padStart(3, '0')}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    backButton: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    backArrow: {
        fontSize: 32,
        color: 'white',
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    idText: {
        fontSize: 20,
        color: 'white',
    },
})