import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
  image: string;
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

const CharacterDetails = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const Background = require('../../../assets/background.png');

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`);
          setCharacter(response.data);
          const episodePromises = response.data.episode.map((episodeUrl) => axios.get<Episode>(episodeUrl));
          const episodeResponses = await Promise.all(episodePromises);
          setEpisodes(episodeResponses.map((res) => res.data));
        }
      } catch (error) {
        setError('Error fetching character details. Please try again later.');
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const checkIfFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        const favoritesArray = favorites ? JSON.parse(favorites) : [];
        if (favoritesArray.includes(Number(id))) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    fetchCharacter();
    checkIfFavorite();
  }, [id]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      if (favoritesArray.length >= 10) {
        Alert.alert('Warning', 'You can only add up to 10 favorite characters.');
      } else if (!favoritesArray.includes(character?.id)) {
        favoritesArray.push(character?.id);
        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
        setIsFavorite(true);
      } else {
        Alert.alert('Info', 'Character is already in favorites.');
      }
    } catch (error) {
      console.error('Error saving to favorites:', error);
      Alert.alert('Error', 'Could not save to favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
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

  if (!character) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image source={require('../../../assets/backButton.png')} style={styles.backButtonImg}/>
      </TouchableOpacity>
      <View style={{alignSelf:'center'}}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <Text style={styles.title}>{character.name}</Text>
      </View> 
        <View style={{alignSelf:'flex-start'}}>
        <Text style={styles.infoText}>Status: {character.status}</Text>
        <Text style={styles.infoText}>Species: {character.species}</Text>
        <Text style={styles.infoText}>Gender: {character.gender}</Text>
        <Text style={styles.infoText}>Origin: {character.origin.name}</Text>
        <Text style={styles.infoText}>Location: {character.location.name}</Text>
      </View>
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonDisabled]}
        onPress={!isFavorite ? handleAddFavorite : undefined}
        disabled={isFavorite}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Already in Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Episodes</Text>
    </View>
  );

  return (
    <View>
      <Image source={Background} style={styles.background} />
      <FlatList
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EpisodeDetails', { id: item.id })}>
              <View style={styles.episodeContainer}>
                <Text style={styles.episode}>{item.name}</Text>
              </View>
            </TouchableOpacity>
        )}
        contentContainerStyle={styles.scrollViewContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    padding: width * 0.05,
    paddingBottom: height * 0.13,
  },
  background: {
    position: 'absolute',
    width: width * 1.8,
    height: height * 1.15,
    zIndex: -1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: width * 0.03,
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
    color: '#333',
  },
  subtitle: {
    fontSize: width * 0.055,
    marginBottom: width * 0.03,
    marginTop: width * 0.07,
  },
  infoText: {
    fontSize: width * 0.045,
    marginBottom: width * 0.01,
    color: '#666',
  },
  errorText: {
    fontSize: width * 0.045,
    color: 'red',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: width * 0.1,
  },
  backButtonImg: {
    width: width * 0.2,
    height: width * 0.2,
    transform: [{ rotate: '-78deg' }],
  },
  favoriteButton: {
    marginTop: width * 0.07,
    backgroundColor: '#ff6347',
    paddingVertical: width * 0.05,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.025,
    width: width * 0.55,
  },
  favoriteButtonDisabled: {
    backgroundColor: '#ccc',
  },
  favoriteButtonText: {
    fontSize: width * 0.045,
    color: 'white',
    fontWeight: 'bold',
  },
  episodeContainer: {
    paddingVertical: width * 0.025,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  episode: {
    fontSize: width * 0.055,
  },
});

export default CharacterDetails;
