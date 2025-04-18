import { SafeAreaView, View } from "react-native";
import PokemonList from "@/components/pokemonList";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#EF6351'
      }}
    >
      <View style={{ flex: 1, padding: 4}}>
        <PokemonList />
      </View>
    </SafeAreaView>
  );
}
