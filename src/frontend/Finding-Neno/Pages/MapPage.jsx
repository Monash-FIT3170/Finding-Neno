import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
import { Text } from 'react-native';
import store from "../store/store";

export default function MapPage() {
	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const navigation = useNavigation();
    // const windowWidth = Dimensions.get('window').width; 
    // const windowHeight = Dimensions.get('window').height;

    return (
		<View style={StyleSheet.container}>
			<MapView style={StyleSheet.map} initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}/>
			
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: '100%',
		height: '50%',
	}
});