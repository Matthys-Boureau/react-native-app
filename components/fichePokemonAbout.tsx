import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FichePokemonAbout({ pokemon }: { pokemon: any }) {
    return (
        <View style={styles.aboutSection}>
            <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Weight</Text>
                <View style={styles.aboutValue}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{pokemon.weight / 10} kg</Text>
                </View>
            </View>
            <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Height</Text>
                <View style={styles.aboutValue}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{pokemon.height / 10} m</Text>
                </View>
            </View>
            <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Moves</Text>
                <View style={styles.aboutValue}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{pokemon.moves.slice(0, 2).map((m: any) => m.move.name).join('\n')}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    aboutSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    aboutItem: {
        alignItems: 'center',
    },
    aboutValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: 48,
    },
    aboutLabel: {
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
    aboutDescription: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
})