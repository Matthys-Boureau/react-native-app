import { SafeAreaView, View } from "react-native";
import PokemonList from "@/components/pokemonList";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FF495C'
      }}
    >
      <View style={{ flex: 1, padding: 4}}>
        <PokemonList />
      </View>
    </SafeAreaView>
  );
}
