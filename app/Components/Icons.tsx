import React from 'react';
import { View, Image } from 'react-native';

const Icons = ({ randomImage }) => {
  return (
    <View>
      <Image source={randomImage} style={{ position: 'absolute', width: 50, height: 50, right:0, alignItems:"center", top:-25}} />
    </View>
  );
};

export default Icons;
