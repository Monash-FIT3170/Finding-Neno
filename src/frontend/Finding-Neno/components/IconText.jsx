import { HStack } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconText = ({ iconName, text, textColor, iconColor, iconSize, fontWeight }) => {
    if (iconName == 'mouse') {
        iconName = 'rodent';
    }

  return (
    <>
    <HStack alignItems='center'>
        <Icon name={iconName} size={iconSize} color={iconColor} />
        <Text style={{ color: textColor, fontWeight: fontWeight, marginLeft: 5 }}>{text}</Text>
      </HStack>
    </>
  );
};

export default IconText;