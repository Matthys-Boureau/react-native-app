import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosClient from '@/lib/axios';
import PokeballAsset from '@/components/fichePokemonAsset';
import PokemonNavigationArrows from '@/components/pokemonNavigationArrows';
import { getColorFromType } from '@/lib/colorHelper';
import { LinearGradient } from 'expo-linear-gradient';
import FicheHeader from '@/components/fichePokemonHeader';
import FichePokemonCard from '@/components/fichePokemonCard';

export default function PokemonDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const { data } = await axiosClient.get(`/pokemon/${id}`);
                setPokemon(data);
            } catch (error) {
                console.error('Erreur lors du fetch du Pokémon :', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPokemon();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#DC0A2D" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    if (!pokemon) {
        return (
            <View style={styles.center}>
                <Text>Pokémon introuvable</Text>
            </View>
        );
    }

    const typeColors = pokemon.types.map((t: any) => getColorFromType(t.type.name));
    const primaryColor = typeColors[0];
    const backgroundColors = typeColors.length > 1 ? typeColors : [primaryColor, primaryColor];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={backgroundColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <ScrollView style={styles.scrollView}>
                <View style={[styles.container, { flex: 1 }]}>
                    <PokeballAsset />
                    <FicheHeader pokemon={pokemon} router={router} />
                    <View style={styles.imageContainer}>
                        <PokemonNavigationArrows id={pokemon.id} imgUrl={imageUrl} />
                    </View>
                    <FichePokemonCard pokemon={pokemon} primaryColor={primaryColor} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        position: 'relative',
        flex: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 0,
        zIndex: 2,
    },
});