import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TextInput, Dimensions } from 'react-native';
import axios from 'axios';
import Header from '../../Components/Header';
import EpisodesListComp from '../../Components/EpisodesListComp';

const iconPaths = [
  require('../../../assets/icons/icon1.png'),
  require('../../../assets/icons/icon2.png'),
  require('../../../assets/icons/icon3.png'),
  require('../../../assets/icons/icon4.png'),
  require('../../../assets/icons/icon5.png'),
  require('../../../assets/icons/icon6.png'),
  require('../../../assets/icons/icon7.png'),
  require('../../../assets/icons/icon8.png'),
  require('../../../assets/icons/icon9.png'),
  require('../../../assets/icons/icon10.png'),
  require('../../../assets/icons/icon11.png'),
  require('../../../assets/icons/icon12.png'),
  require('../../../assets/icons/icon13.png'),
  require('../../../assets/icons/icon14.png'),
];

interface Episode {
  id: number;
  name: string;
  air_date: string;
}

const { width, height } = Dimensions.get('window');

const EpisodesList = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const Rick = require('../../../assets/gifRick.gif');
  const Background = require('../../../assets/background.png');

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
        setEpisodes((prevEpisodes) => [...prevEpisodes, ...response.data.results]);
      } catch (error) {
        setError('Error fetching episodes. Please try again later.');
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && page < 3) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.air_date.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Header/>
      <Image source={Rick} style={styles.gif} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : null}
      <FlatList
        data={filteredEpisodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EpisodesListComp item={item} iconPaths={iconPaths}/>}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
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
    paddingHorizontal: '5%',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    width: '112%',
    height: '100%',
    zIndex: -1,
    opacity: 0.8
  },
  scrollViewContainer:{
    paddingBottom: height * 0.14,
  },
  episodeItem: {
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  episodeName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  airDate: {
    marginTop: '2%',
    fontSize: width * 0.04,
    color: '#888',
  },
  errorText: {
    fontSize: width * 0.045,
    color: 'red',
  },
  searchInput: {
    width: '90%',
    padding: '3%',
    marginBottom: '5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'rgb(242,242,242)'
  },
  gif: {
    position: 'absolute',
    top: '0.7%',
    width: width * 0.2,
    height: width * 0.2,
    left: '80%',
    zIndex: -1
  },
});

export default EpisodesList;
