import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, RefreshControl, Image, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../Components/Header';

interface Character {
  id: number;
  name: string;
  image: string;
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();
  const Background = require('../../../assets/background.png');

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoriteIds = favorites ? JSON.parse(favorites) : [];
      setFavorites(favoriteIds);
    } catch (error) {
      setError('Error fetching favorites. Please try again later.');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const characterPromises = favorites.map((id) =>
        axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`)
      );
      const characterResponses = await Promise.all(characterPromises);
      const characterData = characterResponses.map((response) => response.data);
      setCharacters(characterData);
    } catch (error) {
      setError('Error fetching character details. Please try again later.');
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      fetchCharacters();
    }
  }, [favorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
    setRefreshing(false);
  }, []);

  const handleCharacterPress = (id: number) => {
    navigation.navigate('CharacterDetails', { id });
  };

  const handleRemoveFavorite = (id: number, name: string) => {
    Alert.alert(
      'Confirm Delete',
      `${name} will be removed from favorite characters, are you sure?`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(favoriteId => favoriteId !== id);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              setCharacters(characters.filter(character => character.id !== id));
              Alert.alert('Success', 'Character removed from favorites!');
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Could not remove favorite. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.image }} style={[styles.characterImage, { width: width * 0.15, height: width * 0.15 }]} />
      <TouchableOpacity onPress={() => handleCharacterPress(item.id)} style={styles.favoriteContent}>
        <Text style={[styles.favoriteName, { fontSize: width * 0.04 }]}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRemoveFavorite(item.id, item.name)} style={styles.trashIcon}>
        <Icon name="delete" size={width * 0.07} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (characters.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No favorites added yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Background} style={[styles.background, { width: width, height: height }]} />
      <Header />
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.scrollViewContainer}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.025,
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0.5,
    width: width,
    height: height
  },
  scrollViewContainer:{
    paddingBottom: height * 0.14,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  characterImage: {
    borderRadius: width * 0.1,
    marginRight: width * 0.025,
    width: width * 0.2,
    height: width * 0.2
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteName: {
    fontWeight: 'bold',
    fontSize: width * 0.05
  },
  trashIcon: {
    marginLeft: width * 0.025,
  },
  errorText: {
    fontSize: width * 0.05,
    color: 'red',
  },
});

export default FavoritesList;
