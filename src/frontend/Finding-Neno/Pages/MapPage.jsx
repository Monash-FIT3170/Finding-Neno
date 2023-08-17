import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import React, { useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
import { Text } from 'react-native';
import store from "../store/store";

import au from "../assets/au.json"

export default function MapPage() {
	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const navigation = useNavigation();
    // const windowWidth = Dimensions.get('window').width; 
    // const windowHeight = Dimensions.get('window').height;

	// Image URL for custom marker icon
	const imageURL = '';

	const [reports, setReports] = useState([]);


	const fetchAllReports = async () => {
		try {
			const response = await fetch(`${IP}:${PORT}/get_missing_reports`);
			const data = await response.json();
			setReports(data[0]);
			console.log(reports)
		} catch (error) {
			console.error(error);
		}
	};


	// Default position is Melbourne
	const [mapRegion, setMapRegion] = useState({
		latitude: -37.8136,
		longitude: 144.9631,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	})

	// Retrieves coordinates of current centre of map 
	const handleRegionChange = (region) => {
		console.log(region);
	}

	return (
		<View style={styles.container}>
			<MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={mapRegion}
				mapType={Platform.OS == "android" ? "none" : "standard"} onRegionChange={(region) => handleRegionChange(region)} >

				<Marker coordinate={mapRegion} title='Marker'>
					{/* <Image source={{ uri: imageURL }} /> */}
				</Marker>

			</MapView>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: '100%',
		height: '100%',
		alignSelf: 'stretch',
	}
});