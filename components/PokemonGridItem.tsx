import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import SvgImage from '@/components/svg';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface PokemonGridItemProps {
  name: string;
  id: number;
}

const PokemonGridItem: React.FC<PokemonGridItemProps> = ({ name, id }) => {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/${id}`)}
    >
      <SvgImage
        uri={imageUrl}
        width={80}
        height={80}
      />
      <Text style={styles.pokemonId}>#{id}</Text>
      <Text style={styles.pokemonName}>{name}</Text>
      <View style={styles.blockItem}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    aspectRatio: 0.9,
  },
  blockItem: {
    position: 'absolute',
    width: '100%',
    height: '40%',
    backgroundColor: '#EFEFEF',
    bottom: 0,
    zIndex: -1,
    borderRadius: 10,
  },
  pokemonId: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    position: 'absolute',
    top: 4,
    right: 8,
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default memo(PokemonGridItem);