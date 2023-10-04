import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Switch, Image, StyleSheet, View, SafeAreaView } from 'react-native';
import { Text } from 'react-native';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { VStack } from 'native-base';
import { Appbar, FAB, Provider, Portal, ToggleButton, Button, SegmentedButtons} from 'react-native-paper';
import { Color } from '../components/atomic/Theme';

"Make a button to toggle between reports and sightings. Then make a function "

export default function MapPage() {
	const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	    
	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	// const windowWidth = Dimensions.get('window').width; 
	// const windowHeight = Dimensions.get('window').height;

	const [reports, setReports] = useState([]);
	const [sightings, setSightings] = useState([]);

	// Radio button to toggle between reports (true) and sightings (false)
	const [isViewReports, setIsViewReports] = useState(true);
	const [tabValue, setTabValue] = useState("reports");

	// Reloads data when map page is opened
	useEffect(() => {
		if (isFocused) {
			fetchData(mapRegion);
		}
	}, [isFocused]);

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

	return (
		<Provider>
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
				<View style={{ width: '100%',  height: '100%', alignItems: 'center' }}>
					<MapView
						ref={(ref) => this.mapView = ref}
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						initialRegion={mapRegion}
						showCompass={true}
						showsIndoors={false}
						rotateEnabled={false}
						loadingEnabled={true}
						mapType={"standard"}
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


					{/* Switch and label */}
					<View style={{ position: 'absolute', top: '1%', width: '100%' }} alignItems='center'>
						<SegmentedButtons value={tabValue} onValueChange={setTabValue} 
							style={{ shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }, 
								marginTop: 5, width: '98%', backgroundColor: 'transparent', }}
							theme={{ colors: { border: 'transparent', secondaryContainer: 'white', onSecondaryContainer: Color.NENO_BLUE }}} 
							buttons={[
								{ label: 'Reports', icon: 'file-document', value: 'reports' },
								{ label: 'Sightings', icon: 'magnify', value: 'sightings' },
							]}
						/>

						<View style={{ marginTop: 10 }}>
							{
								tabValue == "reports" ? <Text style={styles.boldText}> {reports.length} reports in area</Text> : <Text style={styles.boldText}> {sightings.length} sightings in area</Text>
							}
						</View>

						<Button mode='elevated' style={{ backgroundColor: 'white', opacity: 0.9, marginTop: '1%' }} onPress={onPressSearch}>
							<Text style={{ color: Color.NENO_BLUE, fontWeight: 'bold' }}>Search this area</Text>
						</Button>
						<Portal>
							<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
								actions={[
									{ icon: 'file-document', label: 'New Report', onPress: () => navigation.navigate('Dashboard', { screen: 'New Report' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
									{ icon: 'magnify', label: 'New Sighting', onPress: () => navigation.navigate('Dashboard', { screen: 'New Sighting' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
								]} />
						</Portal>
					</View>

				</View>
				
		</SafeAreaView>
		</Provider>
	);
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
		fontSize: 20
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