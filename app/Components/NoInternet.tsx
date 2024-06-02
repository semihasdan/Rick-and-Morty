import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const NoInternet = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/noInternet.png')} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(140, 160, 40)',
    
  },
  image: {
    width: '180%',
    height: '115%',
  },
});

export default NoInternet;
