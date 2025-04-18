interface PokemonData {
  url: string;
  name: string;
}

interface Pokemon {
    id: number;
    name: string;
}

interface PokemonListState {
    pokemons: Pokemon[];
    filteredPokemons: Pokemon[];
    loading: boolean;
    initialLoading: boolean;
    error: string | null;
    offset: number;
    hasMore: boolean;
}