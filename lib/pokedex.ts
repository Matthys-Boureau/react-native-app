import axiosClient from "./axios";

export async function getPokedexPage(limit: number = 21, offset: number = 0): Promise<Pokedex> {
    const { data } = await axiosClient.get<Pokedex>(`/pokemon?limit=${limit}&offset=${offset}`);
    return data;
}

export async function searchPokemon(query: string): Promise<PokemonData[]> {
  const { data } = await axiosClient.get<Pokedex>(`/pokemon?limit=151`);
  return data.results.filter(pokemon => 
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getPokedex(): Promise<Pokedex> {
  return getPokedexPage(151, 0);
}