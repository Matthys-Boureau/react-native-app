import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosClient from '@/lib/axios';
import PokeballAsset from '@/components/fichePokemonAsset';
import PokemonNavigationArrows from '@/components/pokemonNavigationArrows';
import { getColorFromType } from '@/lib/colorHelper';

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

    const primaryType = pokemon.types[0]?.type.name;
    const bgColor = getColorFromType(primaryType);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
            <ScrollView style={[styles.scrollView, { backgroundColor: bgColor }]}>
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
                        <Text style={[styles.aboutTitle, {color: bgColor}]}>About</Text>
                        <View style={styles.aboutSection}>
                            <View style={styles.aboutItem}>
                                <View style={styles.aboutValue}>
                                    <Text style={{ fontSize: 20 }}>⚖️</Text>
                                    <Text style={{ fontSize: 16 }}>{pokemon.weight / 10} kg</Text>
                                </View>
                                <Text style={styles.aboutLabel}>Weight</Text>
                            </View>
                            <View style={styles.aboutItem}>
                                <View style={styles.aboutValue}>
                                    <Text style={{ fontSize: 20 }}>📏</Text>
                                    <Text style={{ fontSize: 16 }}>{pokemon.height / 10} m</Text>
                                </View>
                                <Text style={styles.aboutLabel}>Height</Text>
                            </View>
                            <View style={styles.aboutItem}>
                                <View style={styles.aboutValue}>
                                    <Text style={{ fontSize: 20 }}>💥</Text>
                                    <Text style={{ fontSize: 16 }}>{pokemon.moves.slice(0, 2).map((m: any) => m.move.name).join('\n')}</Text>
                                </View>
                                <Text style={styles.aboutLabel}>Moves</Text>
                            </View>
                        </View>

                        <Text style={styles.aboutDescription}>
                            This Pokémon prefers hot places. When it rains, steam is said to spout from the tip of its tail.
                        </Text>

                        {/* Base Stats */}
                        <Text style={{color: bgColor, ...styles.statsTitle}}>Base Stats</Text>
                        {pokemon.stats.map((s: any, i: number) => (
                            <View key={i} style={styles.statRow}>
                                <Text style={[styles.statName, {color: bgColor }]}>{s.stat.name.toUpperCase()}</Text>
                                <Text style={styles.statValue}>{s.base_stat}</Text>
                                <View style={styles.statBarBackground}>
                                    <View style={{
                                        width: `${Math.min(s.base_stat, 100)}%`,
                                        backgroundColor: bgColor,
                                        ...styles.statBarFill,
                                    }} />
                                </View>
                            </View>
                        ))}
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
        paddingTop: 52,
    },
    typesContainer: {
        alignItems: 'center',
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
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
    aboutTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 12,
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
    statsTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    statName: {
        width: 60,
        fontWeight: 'bold',
    },
    statValue: {
        width: 40,
    },
    statBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#eee',
        borderRadius: 4,
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
    },
});