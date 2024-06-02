import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { width } = Dimensions.get('window');

interface Episode {
  id: number;
  name: string;
  air_date: string;
}

interface Props {
  item: Episode;
  iconPaths: any[];
}
const iconPaths = [
    require('../../assets/icons/icon1.png'),
    require('../../assets/icons/icon2.png'),
    require('../../assets/icons/icon3.png'),
    require('../../assets/icons/icon4.png'),
    require('../../assets/icons/icon5.png'),
    require('../../assets/icons/icon6.png'),
    require('../../assets/icons/icon7.png'),
    require('../../assets/icons/icon8.png'),
    require('../../assets/icons/icon9.png'),
    require('../../assets/icons/icon10.png'),
    require('../../assets/icons/icon11.png'),
    require('../../assets/icons/icon12.png'),
    require('../../assets/icons/icon13.png'),
    require('../../assets/icons/icon14.png'),
  ];

const EpisodesListComp: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation();
  const randomImage = iconPaths[Math.floor(Math.random() * iconPaths.length)];

  return (
    <TouchableOpacity onPress={() => navigation.navigate('EpisodeDetails', { id: item.id })}>
      <View style={styles.episodeItem}>
        <Text style={styles.episodeName}>{item.name}</Text>
        <Icons randomImage={randomImage}/>
        <Text style={styles.airDate}>{item.air_date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default EpisodesListComp;
