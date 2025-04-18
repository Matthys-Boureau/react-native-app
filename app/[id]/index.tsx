import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosClient from '@/lib/axios';
import PokeballAsset from '@/components/fichePokemonAsset';
import PokemonNavigationArrows from '@/components/pokemonNavigationArrows';
import StatHexagon from '@/components/pokeCharts';
import { getColorFromType } from '@/lib/colorHelper';
import { LinearGradient } from 'expo-linear-gradient';
import PokemonDescription from '@/components/pokemonDescription';

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
    const primaryType = pokemon.types[0]?.type.name;
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

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backArrow}>←</Text>
                            <Text style={styles.name}>
                                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.idText}>#{String(pokemon.id).padStart(3, '0')}</Text>
                    </View>

                    {/* Image */}
                    <View style={styles.imageContainer}>
                        <PokemonNavigationArrows id={pokemon.id} imgUrl={imageUrl} />
                    </View>

                    {/* About Section */}
                    <View style={styles.card}>
                        {/* Type */}
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


                        <PokemonDescription id={pokemon.id} />

                        {/* Base Stats - Utilisation du composant StatHexagon */}
                        <StatHexagon stats={pokemon.stats} color={primaryColor} />
                    </View>
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
    imageContainer: {
        alignItems: 'center',
        marginVertical: 0,
        zIndex: 2,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginHorizontal: 4,
        marginVertical: -48,
        paddingTop: 64,
        position: 'relative',
    },
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
});