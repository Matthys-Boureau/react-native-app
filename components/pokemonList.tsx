import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import SvgImage from '@/components/svg';
import { getPokedex } from '@/lib/pokedex';
import Header from '@/components/header';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface PokemonGridItemProps {
    name: string;
    id: number;
}

const PokemonGridItem: React.FC<PokemonGridItemProps> = ({ name, id }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
    const router = useRouter();

    return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() => router.push(`/${id}`)}
            >
                <SvgImage
                    uri={imageUrl}
                    width={80}
                    height={80}
                />
                <Text style={styles.pokemonId}>#{id}</Text>
                <Text style={styles.pokemonName}>{name}</Text>
                <View style={styles.blockItem}></View>
            </TouchableOpacity>
    );
};

const PokemonList: React.FC = () => {
    const [pokemons, setPokemons] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const data = await getPokedex();
                // La PokeAPI retourne un objet avec une propriété "pokemon_entries"
                const formattedPokemons = data.results.map((entry: any) => ({
                    name: entry.name,
                    url: entry.url,
                    id: parseInt(entry.url.split('/').slice(-2)[0], 10),
                }));

                setPokemons(formattedPokemons);
            } catch (err) {
                console.error("Erreur lors de la récupération des Pokémon :", err);
                setError("Impossible de charger le Pokédex.");
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    const handlePokemonPress = (id: number, name: string) => {
        console.log(`Pokémon sélectionné: ${name} (ID: ${id})`);
    };

    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF0000" />
                <Text style={styles.loadingText}>Chargement des Pokémon...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header onSearchChange={setSearchQuery} />
            <View style={styles.containerGridItem}>
                <FlatList
                    data={filteredPokemons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PokemonGridItem
                            name={item.name}
                            id={item.id}
                        />
                    )}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.gridContainer}
                    columnWrapperStyle={styles.columnWrapper}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 4,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    gridContainer: {
        paddingHorizontal: 8,
        paddingBottom: 20,
        paddingTop: 20,
    },
    columnWrapper: {
        marginBottom: SPACING,
        gap: 4,
    },
    containerGridItem: {
        flex: 1,
        borderRadius:16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0px 1px 3px 1px #00000040 inset',
    },
    gridItem: {
        width: ITEM_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        aspectRatio: 0.9,
    },
    blockItem: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        backgroundColor: '#EFEFEF',
        bottom: 0,
        zIndex: -1,
        borderRadius: 10,
    },
    pokemonId: {
        fontSize: 12,
        color: '#666',
        marginTop: 6,
        position: 'absolute',
        top: 4,
        right: 8,
    },
    pokemonName: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginTop: 4,
        textAlign: 'center',
    }
});

export default PokemonList;