import React, { useState, useEffect, useCallback } from 'react';
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
import { getPokedexPage, searchPokemon } from '@/lib/pokedex';
import Header from '@/components/header';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;
const PAGE_SIZE = 21;
const MAX_POKEMON = 151;

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
    const [state, setState] = useState<PokemonListState>({
        pokemons: [],
        filteredPokemons: [],
        loading: false,
        initialLoading: true,
        error: null,
        offset: 0,
        hasMore: true
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Fonction pour charger les Pokémon initiaux
    const loadInitialPokemons = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, initialLoading: true, error: null }));
            const data = await getPokedexPage(PAGE_SIZE, 0);
            
            const formattedPokemons = data.results.map((entry: PokemonData) => {
                const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
                return {
                    name: entry.name,
                    id
                };
            });

            setState(prev => ({
                ...prev,
                pokemons: formattedPokemons,
                filteredPokemons: formattedPokemons,
                offset: PAGE_SIZE,
                hasMore: data.next !== null && PAGE_SIZE < MAX_POKEMON,
                initialLoading: false
            }));
        } catch (err) {
            console.error("Erreur lors de la récupération des Pokémon :", err);
            setState(prev => ({
                ...prev,
                error: "Impossible de charger le Pokédex.",
                initialLoading: false
            }));
        }
    }, []);

    // Fonction pour charger plus de Pokémon (pagination)
    const loadMorePokemons = useCallback(async () => {
        if (state.loading || !state.hasMore || searchQuery) return;
        
        // Arrêter le chargement si on atteint la limite de MAX_POKEMON
        if (state.offset >= MAX_POKEMON) {
            setState(prev => ({ ...prev, hasMore: false }));
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true }));
            
            // Calcul du nombre de Pokémon restants à charger
            const remainingPokemon = MAX_POKEMON - state.offset;
            const limit = Math.min(PAGE_SIZE, remainingPokemon);
            
            const data = await getPokedexPage(limit, state.offset);
            
            const newPokemons = data.results.map((entry: PokemonData) => {
                const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
                return {
                    name: entry.name,
                    id
                };
            });

            const newOffset = state.offset + limit;
            const hasMoreData = data.next !== null && newOffset < MAX_POKEMON;

            setState(prev => ({
                ...prev,
                pokemons: [...prev.pokemons, ...newPokemons],
                filteredPokemons: searchQuery ? prev.filteredPokemons : [...prev.filteredPokemons, ...newPokemons],
                offset: newOffset,
                hasMore: hasMoreData,
                loading: false
            }));
        } catch (err) {
            console.error("Erreur lors du chargement de plus de Pokémon :", err);
            setState(prev => ({
                ...prev,
                error: "Impossible de charger plus de Pokémon.",
                loading: false
            }));
        }
    }, [state.offset, state.loading, state.hasMore, searchQuery]);

    // Chargement initial
    useEffect(() => {
        loadInitialPokemons();
    }, [loadInitialPokemons]);

    // Fonction de recherche
    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        
        if (!query) {
            // Si la recherche est vide, réinitialiser à la liste complète
            setState(prev => ({
                ...prev,
                filteredPokemons: prev.pokemons
            }));
            return;
        }
        
        // Recherche locale d'abord
        const localResults = state.pokemons.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
        
        // Si nous avons des résultats locaux, les afficher immédiatement
        setState(prev => ({
            ...prev, 
            filteredPokemons: localResults
        }));
        
        // Si on a peu de résultats locaux (moins de 5), chercher aussi globalement
        // mais uniquement parmi les 151 premiers Pokémon
        if (localResults.length < 5) {
            try {
                setIsSearching(true);
                const results = await searchPokemon(query);
                
                // Filtrer pour ne garder que les 151 premiers Pokémon
                const filteredResults = results.filter(entry => {
                    const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
                    return id <= MAX_POKEMON;
                });
                
                const formattedResults = filteredResults.map(entry => {
                    const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
                    return {
                        name: entry.name,
                        id
                    };
                });
                
                // Mise à jour des résultats de recherche
                setState(prev => ({
                    ...prev,
                    filteredPokemons: formattedResults
                }));
            } catch (err) {
                console.error("Erreur lors de la recherche de Pokémon :", err);
            } finally {
                setIsSearching(false);
            }
        }
    }, [state.pokemons]);

    // Rendu du footer avec indicateur de chargement
    const renderFooter = () => {
        if (!state.loading) return null;
        
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#FF495C" />
                <Text style={styles.footerText}>Chargement...</Text>
            </View>
        );
    };

    if (state.initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF0000" />
                <Text style={styles.loadingText}>Chargement des Pokémon...</Text>
            </View>
        );
    }

    if (state.error && state.pokemons.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header onSearchChange={handleSearch} />
            
            {isSearching && (
                <View style={styles.searchingIndicator}>
                    <ActivityIndicator size="small" color="#FF495C" />
                    <Text style={styles.searchingText}>Recherche en cours...</Text>
                </View>
            )}
            
            <View style={styles.containerGridItem}>
                <FlatList
                    data={state.filteredPokemons}
                    keyExtractor={(item) => `pokemon-${item.id}`}
                    renderItem={({ item }) => (
                        <PokemonGridItem
                            name={item.name}
                            id={item.id}
                        />
                    )}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.gridContainer}
                    columnWrapperStyle={styles.columnWrapper}
                    onEndReached={searchQuery ? null : loadMorePokemons}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    initialNumToRender={PAGE_SIZE}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={PAGE_SIZE}
                    windowSize={21}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Aucun Pokémon trouvé
                            </Text>
                        </View>
                    }
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
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    searchingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    searchingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    }
});

export default PokemonList;