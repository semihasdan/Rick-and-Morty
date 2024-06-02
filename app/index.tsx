import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NetInfo from '@react-native-community/netinfo';
import EpisodesList from './screens/EpisodesStack/EpisodesList';
import EpisodeDetails from './screens/EpisodesStack/EpisodeDetails';
import CharacterDetails from './screens/EpisodesStack/CharacterDetails';
import CharactersList from './screens/CharactersStack/CharactersList';
import FavoriteCharacters from './screens/FavoriteStack/FavoriteCharacters';
import NoInternet from './Components/NoInternet';
import { Image, View, Dimensions } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeIcon = require('../assets/homeIcon.png');
const CharactersIcon = require('../assets/charactersIcon.png');
const FavoritesIcon = require('../assets/favoriteIcon.png');
const width = Dimensions.get('window').width;

const EpisodesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EpisodesList" component={EpisodesList} options={{ headerShown: false }} />
    <Stack.Screen name="EpisodeDetails" component={EpisodeDetails} options={{ headerShown: false }} />
    <Stack.Screen name="CharacterDetails" component={CharacterDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const CharactersStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CharactersList" component={CharactersList} options={{ headerShown: false }} />
    <Stack.Screen name="CharacterDetails" component={CharacterDetails} options={{ headerShown: false }} />
    <Stack.Screen name="EpisodeDetails" component={EpisodeDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="FavoriteCharacters" component={FavoriteCharacters} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.0)',
              position: 'absolute',
              borderTopWidth: width * 0.1,
              elevation: 11,
              shadowColor: '#000',
              shadowOffset: { width: 11, height: 15 },
              shadowOpacity: 2,
              shadowRadius: 6.27,
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Episodes"
        component={EpisodesStack}
        options={{
          tabBarIcon: () => <Image source={HomeIcon} style={{ width: width * 0.2, height: width * 0.2, bottom: width * 0.07 }} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Characters"
        component={CharactersStack}
        options={{
          tabBarIcon: () => <Image source={CharactersIcon} style={{ width: width * 0.2, height: width * 0.2, bottom: width * 0.07 }} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{
          tabBarIcon: () => <Image source={FavoritesIcon} style={{ width: width * 0.2, height: width * 0.2, bottom: width * 0.07 }} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        {isConnected ? (
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="NoInternet" component={NoInternet} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
