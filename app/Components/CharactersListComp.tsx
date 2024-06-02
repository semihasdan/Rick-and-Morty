import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

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
}

const { width } = Dimensions.get('window');

interface Props {
  item: Character;
  onFavoriteToggle: (character: Character) => void;
  isFavorite: boolean;
}

const CharactersListComp: React.FC<Props> = ({ item, onFavoriteToggle, isFavorite }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { id: item.id })}>
      <View style={styles.characterItem}>
        <Image source={{ uri: item.image }} style={styles.characterImage} />
        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{item.name}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Species: {item.species}</Text>
          <Text>Gender: {item.gender}</Text>
          <Text>Location: {item.location.name}</Text>
        </View>
        <TouchableOpacity onPress={() => onFavoriteToggle(item)}>
          <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    padding: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  characterImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    marginRight: '5%', 
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: '2%',
  },
});

export default CharactersListComp;
