import React from 'react'
import { View, StyleSheet } from 'react-native'
import FichePokemonTypes from './fichePokemonTypes'
import FichePokemonAbout from './fichePokemonAbout'
import PokemonDescription from '../pokemonDescription'
import StatHexagon from '../pokeCharts'


export default function FichePokemonCard({ pokemon, primaryColor }: { pokemon: any, primaryColor: string }) {


    return (
        <View style={styles.card}>
            <FichePokemonTypes pokemon={pokemon} />
            <FichePokemonAbout pokemon={pokemon} />
            <PokemonDescription id={pokemon.id} />
            <StatHexagon stats={pokemon.stats} color={primaryColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginHorizontal: 4,
        marginVertical: -48,
        paddingTop: 64,
        position: 'relative',
    },
})