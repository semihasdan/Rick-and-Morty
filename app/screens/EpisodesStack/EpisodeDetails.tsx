import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface Character {
  id: number;
  name: string;
  image: string;
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

const EpisodeDetails = () => {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const Kick = require('../../../assets/kick.png');
  const Background = require('../../../assets/background.png');

  useEffect(() => {
    const fetchEpisode = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
          setEpisode(response.data);

          const characterResponses = await Promise.all(
            response.data.characters.map((url: string) => axios.get<Character>(url))
          );
          setCharacters(characterResponses.map((res) => res.data));
        }
      } catch (error) {
        setError('Error fetching episode details. Please try again later.');
        console.error('Error fetching episode:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!episode) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={Background} style={styles.background} />
      <Image source={Kick} style={styles.kick} />
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Image source={require('../../../assets/backButton.png')} style={styles.backButtonImg}/>
      </TouchableOpacity>
      <Text style={styles.title}>{episode.name}</Text>
      <Text style={styles.subtitle}>Air Date: {episode.air_date}</Text>
      <Text style={styles.subtitle}>Episode: {episode.episode}</Text>
      <View style={styles.characterView}>
        <Text style={styles.subtitle}>Characters</Text>
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { id: item.id })}>
              <View style={styles.characterItem}>
                <Text>{item.name}</Text>
                <Image source={{ uri: item.image }} style={styles.characterImage} />
              </View>
          </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.1,
    paddingTop: height * 0.02,
  },
  background: {
    position: 'absolute',
    width: width * 1.8,
    height: height * 1.15,
    zIndex: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: width * 0.045,
    color: 'red',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: width * 0.03,
  },
  subtitle: {
    fontSize: width * 0.045,
    marginBottom: width * 0.03,
  },
  characterView: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: width * 0.05,
    paddingTop: width * 0.04,
    borderRadius: 50,
    maxHeight: height * 0.48,
  },
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: width * 0.035,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  characterImage: {
    position: 'absolute',
    width: width * 0.065,
    height: width * 0.065,
    borderRadius: 25,
    marginRight: 10, 
    right: 0
  },
  backButton: {
    marginBottom: width * 0.1,
    right: width * 0.055
  },
  kick:{
    position: 'absolute',
    width: width * 0.25,
    height: width * 0.25,
    marginLeft: width * 0.75,
    transform: [{ rotate: '12deg' }],
    top: -10,
  },
  backButtonImg: {
    width: width * 0.2,
    height: width * 0.2,
    transform: [{ rotate: '-78deg' }],
  },
});

export default EpisodeDetails;
