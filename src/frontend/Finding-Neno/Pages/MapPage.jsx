import { NavigationContainer, useNavigation, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Switch, Image, StyleSheet, View, SafeAreaView, useColorScheme } from 'react-native';
import { Text } from 'react-native';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from 'react-native';

import { StatusBar, VStack } from 'native-base';
import { Appbar, FAB, Provider, Portal, ToggleButton, Button, SegmentedButtons} from 'react-native-paper';
import { Color } from '../components/atomic/Theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

"Make a button to toggle between reports and sightings. Then make a function "

export default function MapPage({ navigation: { navigate } }) {

	const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
	const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);
	
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	    
	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const scheme = useColorScheme();
	const { colors } = useTheme();
	const mapStyle = [
		{
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": "#242f3e"
			}
		  ]
		},
		{
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#746855"
			}
		  ]
		},
		{
		  "elementType": "labels.text.stroke",
		  "stylers": [
			{
			  "color": "#242f3e"
			}
		  ]
		},
		{
		  "featureType": "administrative.locality",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#d59563"
			}
		  ]
		},
		{
		  "featureType": "poi",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#d59563"
			}
		  ]
		},
		{
		  "featureType": "poi.park",
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": "#263c3f"
			}
		  ]
		},
		{
		  "featureType": "poi.park",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#6b9a76"
			}
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": "#38414e"
			}
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "geometry.stroke",
		  "stylers": [
			{
			  "color": "#212a37"
			}
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#9ca5b3"
			}
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": colors.primary
			}
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "geometry.stroke",
		  "stylers": [
			{
			  "color": "#1f2835"
			}
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#f3d19c"
			}
		  ]
		},
		{
		  "featureType": "transit",
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": "#2f3948"
			}
		  ]
		},
		{
		  "featureType": "transit.station",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#d59563"
			}
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "geometry",
		  "stylers": [
			{
			  "color": "#17263c"
			}
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "labels.text.fill",
		  "stylers": [
			{
			  "color": "#515c6d"
			}
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "labels.text.stroke",
		  "stylers": [
			{
			  "color": "#17263c"
			}
		  ]
		}
	  ]

	const [reports, setReports] = useState([]);
	const [sightings, setSightings] = useState([]);

	const [tabValue, setTabValue] = useState("reports");

	// Reloads data when map page is opened
	useEffect(() => {
		if (isFocused) {
			fetchData(mapRegion);
		}
	}, [isFocused, tabValue]);

	// Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
	const [mapRegion, setMapRegion] = useState({
		latitude: -37.8136,
		longitude: 144.9631,
		latitudeDelta: 0.045,
		longitudeDelta: 0.03,
	})

	// Retrieves coordinates of current centre of map when map is moved around
	const handleRegionChange = (newRegion) => {
		setMapRegion(newRegion);
		console.log(`${newRegion["longitude"]} ${newRegion["latitude"]} New region`)
		console.log(`${mapRegion["longitude"]} ${mapRegion["latitude"]}`)
		fetchData(newRegion);
	}

	const onPressSearch = () => {
		fetchData(mapRegion);
	}

	const fetchData = (region) => {
		const longitude = region["longitude"];
		const longitude_delta = region["longitudeDelta"];
		const latitude = region["latitude"];
		const latitude_delta = region["latitudeDelta"];


		if (tabValue == "reports") {
			console.log("fetching reports")
			fetchReports(longitude, longitude_delta, latitude, latitude_delta);
		}
		else {
			console.log("fetching sightings")
			fetchSightings(longitude, longitude_delta, latitude, latitude_delta);
		}
	}

	// Fetches all reports in map view from DB.
	const fetchReports = async (longitude, longitude_delta, latitude, latitude_delta) => {
		try {
			const response = await fetch(`${API_URL}/get_missing_reports_in_area?long=${longitude}&long_delta=${longitude_delta}&lat=${latitude}&lat_delta=${latitude_delta}`);
			const data = await response.json();
			// setReports(data[0]);
			console.log("Fetched Reports:", data); // Log fetched data
			setReports(Array.isArray(data[0]) ? data[0] : []);//new
		} catch (error) {
			console.error(error);
		}
	}

	const fetchSightings = async (longitude, longitude_delta, latitude, latitude_delta) => {
		try {
			const response = await fetch(`${API_URL}/get_sightings_in_area?long=${longitude}&long_delta=${longitude_delta}&lat=${latitude}&lat_delta=${latitude_delta}`);
			const data = await response.json();
			// setSightings(data[0]);
			console.log("Fetched Sightings:", data); // Log fetched data
			setSightings(Array.isArray(data[0]) ? data[0] : []);
		} catch (error) {
			console.error(error);
		}
	}

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'flex-end',
			alignItems: 'center'
		},
		map: {
			...StyleSheet.absoluteFillObject,
		},
		text: {
			fontSize: 20
		},
	
		boldText: {
			fontWeight: 'bold',
			fontSize: 20,
			color: colors.text
		},
		switchContainer: {
			flexDirection: 'column',
			alignItems: 'center',
			position: 'absolute',
			top: 600,  // you can adjust this value
			left: 145  // and this one too, to place it properly
		},
		switchLabel: {
			fontSize: 24,
			fontWeight: 'bold',
			marginRight: 10
		}
	
	
	});


	return (
		<Provider>
		<StatusBar style='auto' />
			<View style={{alignItems: 'center', height: '100%'}}>
				<MapView
					ref={(ref) => this.mapView = ref}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					initialRegion={mapRegion}
					showCompass={true}
					showsIndoors={false}
					rotateEnabled={false}
					loadingEnabled={true}
					customMapStyle={ scheme == 'dark' ? mapStyle : []}
					onRegionChangeComplete={(newRegion) => handleRegionChange(newRegion)}
				>
					{/* Render reports markers */}
					{
						tabValue == "reports" ?
						
					(Array.isArray(reports)
						? reports.map((report, index) => (
							<Marker
								key={`${report[0]}_${report[3]}_${report[4]}`}
								title={report[6]}
								coordinate={{ longitude: report[3], latitude: report[4] }}
								onPress={() =>
									this.mapView.animateToRegion({
										longitude: report[3],
										latitude: report[4],
										longitudeDelta: 0.0015,
									})
								}
							></Marker>
						))
						: null) :

					//Render sightings markers
					(Array.isArray(sightings)
						? sightings.map((sighting, index) => (
							<Marker
								key={`${sighting[0]}_${sighting[2]}_${sighting[3]}`}
								title={sighting[10]}
								coordinate={{ longitude: sighting[2], latitude: sighting[3] }}
								onPress={() =>
									this.mapView.animateToRegion({
										longitude: sighting[2],
										latitude: sighting[3],
										longitudeDelta: 0.0015,
									})
								}
							></Marker>
						))
						: null)

					}
				</MapView>
				<SafeAreaView style={{backgroundColor: 'transparent'}}>
					<View style={{ width: '100%', alignItems: 'center' }}>
						{/* Switch and label */}
						<SegmentedButtons value={tabValue} onValueChange={setTabValue}
							style={{ borderColor: colors.border, shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }, 
								marginTop: 0, width: '98%', backgroundColor: colors.background, borderRadius: 20, }}
							theme={{ colors: { onSurface: colors.text, secondaryContainer: colors.tertiary, onSecondaryContainer: colors.primary, outline: 'gray' }}} 
							
							buttons={[
								{ label: 'Reports', icon: 'file-document', value: 'reports', style: backgroundColor = colors.background},
								{ label: 'Sightings', icon: 'magnify', value: 'sightings' },
							]}
						/>

					</View>
				</SafeAreaView>


				<Button mode='elevated' style={{ backgroundColor: colors.background, opacity: 0.9, marginTop: 8 }} onPress={onPressSearch}>
					<Text style={{ color: colors.primary, fontWeight: 'bold' }}>Search this area</Text>
				</Button>
				<View style={{ marginTop: 5 }}>
					{
						tabValue == "reports" ? <Text style={styles.boldText}> {reports.length} report{reports.length == 1 ? '' : 's'} in area</Text> : <Text style={styles.boldText}> {sightings.length} sighting{sightings.length == 1 ? '' : 's'} in area</Text>
					}
				</View>		
			</View>		
			<Portal>
				<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
					actions={[
						{ icon: 'file-document', label: 'New Missing Report', onPress: () => navigate('New Missing Report'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
						{ icon: 'magnify', label: 'New Sighting', onPress: () => navigate('New Sighting'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
					]} />
			</Portal>
		</Provider>
	);


								
}

