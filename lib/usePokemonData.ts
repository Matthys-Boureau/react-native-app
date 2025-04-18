import { useCallback, useEffect, useReducer, useState } from 'react';
import { getPokedexPage, searchPokemon } from '@/lib/pokedex';

const PAGE_SIZE = 21;
const MAX_POKEMON = 151;

interface PokemonState {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;
  searchQuery: string;
}

type PokemonAction =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: { pokemons: Pokemon[]; offset: number; hasMore: boolean } }
  | { type: 'FETCH_MORE_INIT' }
  | { type: 'FETCH_MORE_SUCCESS'; payload: { newPokemons: Pokemon[]; offset: number; hasMore: boolean } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTERED'; payload: Pokemon[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: PokemonState = {
  pokemons: [],
  filteredPokemons: [],
  loading: false,
  initialLoading: true,
  error: null,
  offset: 0,
  hasMore: true,
  searchQuery: '',
};

function pokemonReducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, initialLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        pokemons: action.payload.pokemons,
        filteredPokemons: action.payload.pokemons,
        offset: action.payload.offset,
        hasMore: action.payload.hasMore,
        initialLoading: false,
      };
    case 'FETCH_MORE_INIT':
      return { ...state, loading: true };
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        pokemons: [...state.pokemons, ...action.payload.newPokemons],
        filteredPokemons: state.searchQuery ? state.filteredPokemons : [...state.filteredPokemons, ...action.payload.newPokemons],
        offset: action.payload.offset,
        hasMore: action.payload.hasMore,
        loading: false,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        initialLoading: false,
      };
    case 'SET_FILTERED':
      return { ...state, filteredPokemons: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export function usePokemonData() {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);
  const [isSearching, setIsSearching] = useState(false);

  // Fonction pour transformer les données de l'API en format Pokemon
  const formatPokemonData = (entries: PokemonData[]): Pokemon[] => {
    return entries.map((entry) => {
      const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
      return {
        name: entry.name,
        id,
      };
    });
  };

  // Chargement initial des Pokémon
  const loadInitialPokemons = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_INIT' });
      const data = await getPokedexPage(PAGE_SIZE, 0);
      
      const formattedPokemons = formatPokemonData(data.results);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          pokemons: formattedPokemons,
          offset: PAGE_SIZE,
          hasMore: data.next !== null && PAGE_SIZE < MAX_POKEMON,
        },
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des Pokémon :", err);
      dispatch({
        type: 'FETCH_ERROR',
        payload: "Impossible de charger le Pokédex.",
      });
    }
  }, []);

  // Chargement de plus de Pokémon (pagination)
  const loadMorePokemons = useCallback(async () => {
    if (state.loading || !state.hasMore || state.searchQuery) return;
    
    // Arrêter le chargement si on atteint la limite de MAX_POKEMON
    if (state.offset >= MAX_POKEMON) {
      dispatch({
        type: 'FETCH_MORE_SUCCESS',
        payload: { newPokemons: [], offset: state.offset, hasMore: false },
      });
      return;
    }

    try {
      dispatch({ type: 'FETCH_MORE_INIT' });
      
      // Calcul du nombre de Pokémon restants à charger
      const remainingPokemon = MAX_POKEMON - state.offset;
      const limit = Math.min(PAGE_SIZE, remainingPokemon);
      
      const data = await getPokedexPage(limit, state.offset);
      const newPokemons = formatPokemonData(data.results);

      const newOffset = state.offset + limit;
      const hasMoreData = data.next !== null && newOffset < MAX_POKEMON;

      dispatch({
        type: 'FETCH_MORE_SUCCESS',
        payload: {
          newPokemons,
          offset: newOffset,
          hasMore: hasMoreData,
        },
      });
    } catch (err) {
      console.error("Erreur lors du chargement de plus de Pokémon :", err);
      dispatch({
        type: 'FETCH_ERROR',
        payload: "Impossible de charger plus de Pokémon.",
      });
    }
  }, [state.offset, state.loading, state.hasMore, state.searchQuery]);

  // Fonction de recherche
  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query) {
      // Si la recherche est vide, réinitialiser à la liste complète
      dispatch({ type: 'SET_FILTERED', payload: state.pokemons });
      return;
    }
    
    // Recherche locale d'abord
    const localResults = state.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Si nous avons des résultats locaux, les afficher immédiatement
    dispatch({ type: 'SET_FILTERED', payload: localResults });
    
    // Si on a peu de résultats locaux (moins de 5), chercher aussi globalement
    if (localResults.length < 5) {
      try {
        setIsSearching(true);
        const results = await searchPokemon(query);
        
        // Filtrer pour ne garder que les 151 premiers Pokémon
        const filteredResults = results.filter(entry => {
          const id = parseInt(entry.url.split('/').slice(-2)[0], 10);
          return id <= MAX_POKEMON;
        });
        
        const formattedResults = formatPokemonData(filteredResults);
        
        // Mise à jour des résultats de recherche
        dispatch({ type: 'SET_FILTERED', payload: formattedResults });
      } catch (err) {
        console.error("Erreur lors de la recherche de Pokémon :", err);
      } finally {
        setIsSearching(false);
      }
    }
  }, [state.pokemons]);

  // Chargement initial
  useEffect(() => {
    loadInitialPokemons();
  }, [loadInitialPokemons]);

  return {
    state,
    handleSearch,
    loadMorePokemons,
    isSearching,
  };
}