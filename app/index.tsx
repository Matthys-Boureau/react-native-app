import { SafeAreaView, View } from "react-native";
import PokemonList from "@/components/pokemonList";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F26157'
      }}
    >
      <View style={{ flex: 1, padding: 4}}>
        <PokemonList />
      </View>
    </SafeAreaView>
  );
}
