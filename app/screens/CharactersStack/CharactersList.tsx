import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Image, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../Components/Header';
import CharactersListComp from '../../Components/CharactersListComp';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  location: {
    name: string;
  };
  image: string;
  episode: string[];
}

const { width } = Dimensions.get('window');

const CharactersList = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigation = useNavigation();
  const Background = require('../../../assets/background.png');

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
        setCharacters((prevCharacters) => [...prevCharacters, ...response.data.results]);
      } catch (error) {
        setError('Error fetching characters. Please try again later.');
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          setFavorites(JSON.parse(favorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    fetchCharacters();
    loadFavorites();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && page < 42) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleFavoriteToggle = async (character: Character) => {
    try {
      if (favorites.includes(character.id)) {
        Alert.alert(
          'Remove Favorite',
          `${character.name} will be removed from favorite characters, are you sure?`,
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                const updatedFavorites = favorites.filter((id) => id !== character.id);
                setFavorites(updatedFavorites);
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        if (favorites.length >= 10) {
          Alert.alert('Warning', 'You can only add up to 10 favorite characters.');
          return;
        }
        const updatedFavorites = [...favorites, character.id];
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Could not update favorites. Please try again.');
    }
  };
  

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Background} style={styles.background} />
      <Header />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff"/>
      ) : (null)}
      <FlatList
        data={filteredCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CharactersListComp
            item={item}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={favorites.includes(item.id)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  background: {
    position: 'absolute',
    width: '112%',
    height: '100%',
    zIndex: -1,
    opacity: 0.8
  },
  errorText: {
    fontSize: width * 0.045,
    color: 'red',
  },
  searchInput: {
    width: '100%',
    padding: '3%',
    marginBottom: '5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'rgb(242,242,242)'
  },
});

export default CharactersList;
