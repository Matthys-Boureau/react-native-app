import { View } from "react-native";
import PokemonList from "@/components/pokemonList";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <PokemonList />
    </View>
  );
}
