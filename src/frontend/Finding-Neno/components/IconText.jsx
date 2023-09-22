import { HStack } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconText = ({ iconName, text, color }) => {
  return (
    <>
    <HStack alignItems='center' justifyContent='center'>
        <Icon name={iconName} size={24} color={color} />
        <Text style={{ color, fontWeight: 'bold', marginLeft: 5 }}>{text}</Text>
      </HStack>
    </>
  );
};

export default IconText;