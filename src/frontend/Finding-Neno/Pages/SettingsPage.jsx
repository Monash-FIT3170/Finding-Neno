import React from 'react';
import { ScrollView, VStack} from 'native-base';
import {Dimensions} from 'react-native';

import UserDetails  from '../components/Settings/UserDetails';
import LocationNotifications from '../components/Settings/LocationNotfications';
import DeleteProfile from '../components/Settings/DeleteProfile';

export default function SettingsPage() {
  const windowHeight = Dimensions.get('window').height;

  return (
  <ScrollView flex={1}>
    <VStack h={windowHeight} padding={4}>
        <UserDetails/>
        <LocationNotifications/>
    </VStack >
  </ScrollView>  
  )
}