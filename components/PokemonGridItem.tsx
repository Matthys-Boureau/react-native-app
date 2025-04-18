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
    elevation: 3,
    aspectRatio: 0.9,
    boxShadow: '0px 1px 3px 1px #00000033',
    overflow: 'hidden',
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 6,
    position: 'absolute',
    top: 4,
    right: 8,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 4,
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#EFEFEF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default memo(PokemonGridItem);