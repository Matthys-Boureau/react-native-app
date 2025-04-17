import axiosClient from "./axios";

export async function getPokedex(): Promise<Pokedex> {
    const { data } = await axiosClient.get<Pokedex>(`/pokemon?limit=1050`);
    return data;
}