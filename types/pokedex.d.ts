interface Pokedex {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonData[];
}