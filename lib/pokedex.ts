import axiosClient from "./axios";

export async function getPokedex(): Promise<Pokedex> {
    const { data } = await axiosClient.get<Pokedex>(`/pokemon?limit=151`);
    return data;
}