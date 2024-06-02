import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={require('../../assets/Header.png')} style={styles.headerImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width:200,
    height: 70,
    resizeMode: 'contain',
  },
});

export default Header;
