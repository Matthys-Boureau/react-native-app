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

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface PokemonGridItemProps {
    name: string;
    id: number;
    onPress: (id: number, name: string) => void;
}

const PokemonGridItem: React.FC<PokemonGridItemProps> = ({ name, id, onPress }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    return (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => onPress(id, name)}
        >
            <SvgImage
                uri={imageUrl}
                width={80}
                height={80}
            />
            <Text style={styles.pokemonId}>#{id}</Text>
            <Text style={styles.pokemonName}>{name}</Text>
        </TouchableOpacity>
    );
};

const PokemonList: React.FC = () => {
    const [pokemons, setPokemons] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            <Text style={styles.title}>Pokédex</Text>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PokemonGridItem
                        name={item.name}
                        id={item.id}
                        onPress={handlePokemonPress}
                    />
                )}
                numColumns={COLUMN_COUNT}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#FF0000',
    },
    gridContainer: {
        paddingHorizontal: SPACING,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: SPACING,
    },
    gridItem: {
        width: ITEM_WIDTH,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        aspectRatio: 0.9,
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