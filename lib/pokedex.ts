import axiosClient from "./axios";

export async function getPokedex(): Promise<Pokedex> {
    const { data } = await axiosClient.get<Pokedex>(`/pokemon?limit=151&offset=0`);
    return data;
}