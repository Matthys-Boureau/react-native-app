import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColorFromType } from '@/lib/colorHelper';

export default function FichePokemonTypes({ pokemon }: { pokemon: any }) {
    return (
        <View style={styles.typesContainer}>
            {pokemon.types.map((t: any, i: number) => (
                <Text key={i} style={{
                    backgroundColor: getColorFromType(t.type.name),
                    ...styles.typeBadge,
                }}>
                    {t.type.name}
                </Text>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    typesContainer: {
        alignItems: 'center',
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        top: 24,
        left: 8,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 4,
        fontSize: 14,
    },
})