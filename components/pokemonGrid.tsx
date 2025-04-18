import React, { memo } from 'react';
import { View, Text, FlatList, StyleSheet,ActivityIndicator} from 'react-native';
import PokemonGridItem from '@/components/pokemonGridItem';

const COLUMN_COUNT = 3;
const SPACING = 8;
const PAGE_SIZE = 21;

interface PokemonGridProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasSearch: boolean;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  pokemons, 
  isLoading, 
  onLoadMore,
  hasSearch
}) => {
  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FF495C" />
        <Text style={styles.footerText}>Chargement...</Text>
      </View>
    );
  };

  return (
    <View style={styles.containerGridItem}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => `pokemon-${item.id}`}
        renderItem={({ item }) => (
          <PokemonGridItem
            name={item.name}
            id={item.id}
          />
        )}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={hasSearch ? undefined : onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        initialNumToRender={PAGE_SIZE}
        removeClippedSubviews={true}
        maxToRenderPerBatch={PAGE_SIZE}
        windowSize={21}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun Pokémon trouvé
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerGridItem: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    boxShadow: '0px 1px 3px 1px #00000040 inset',

  },
  gridContainer: {
    paddingHorizontal: 6,
    paddingBottom: 20,
    paddingTop: 20,
  },
  columnWrapper: {
    marginBottom: SPACING,
    gap: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default memo(PokemonGrid);