// src/screens/PokemonList.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PokemonGrid from '@/components/pokemonGrid';
import Header from '@/components/header';
import { usePokemonData } from '@/lib/usePokemonData';

const PokemonList: React.FC = () => {
  const { 
    state, 
    handleSearch, 
    loadMorePokemons, 
    isSearching 
  } = usePokemonData();

  if (state.initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Chargement des Pokémon...</Text>
      </View>
    );
  }

  if (state.error && state.pokemons.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{state.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onSearchChange={handleSearch} />
      
      {isSearching && (
        <View style={styles.searchingIndicator}>
          <ActivityIndicator size="small" color="#EF6351" />
          <Text style={styles.searchingText}>Recherche en cours...</Text>
        </View>
      )}
      
      <PokemonGrid 
        pokemons={state.filteredPokemons}
        isLoading={state.loading}
        onLoadMore={loadMorePokemons}
        hasSearch={!!state.searchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  }
});

export default PokemonList;