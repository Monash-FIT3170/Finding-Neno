import React from 'react';
import { ScrollView, StatusBar, VStack} from 'native-base';
import {Dimensions} from 'react-native';

import UserDetails  from '../components/Settings/UserDetails';
import LocationNotifications from '../components/Settings/LocationNotfications';
import DeleteProfile from '../components/Settings/DeleteProfile';
import { useTheme } from '@react-navigation/native';

export default function SettingsPage() {
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const { colors } = useTheme();

  return (
  <ScrollView flex={1} backgroundColor={colors.background}>
    <StatusBar style='auto' />
    <VStack h={WINDOW_HEIGHT} padding={4}>
        <UserDetails colors={colors}/>
        <LocationNotifications colors={colors}/>
    </VStack >
  </ScrollView>  
  )
}