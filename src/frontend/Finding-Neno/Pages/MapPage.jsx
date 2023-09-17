import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Switch, Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from 'react-native';

import { VStack } from 'native-base';

"Make a button to toggle between reports and sightings. Then make a function "

export default function MapPage() {
	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
	const navigation = useNavigation();
	const isFocused = useIsFocused();

	// const windowWidth = Dimensions.get('window').width; 
	// const windowHeight = Dimensions.get('window').height;

	// Image URL for custom marker iconrts
	const imageURL = '';

	const [reports, setReports] = useState([]);
	const [sightings, setSightings] = useState([]);

	// Radio button to toggle between reports (true) and sightings (false)
	const [isViewReports, setIsViewReports] = useState(true);

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
		console.log("move ended")
		setMapRegion(newRegion);
		console.log(`${newRegion["longitude"]} ${newRegion["latitude"]} New region`)
		console.log(`${mapRegion["longitude"]} ${mapRegion["latitude"]}`)
		fetchData(newRegion);
	}

	const handleViewToggle = (value) => {
		setIsViewReports(value);

		fetchData(mapRegion);
	}


	const onPressSearch = () => {
		fetchData(mapRegion);
	}

	const fetchData = (region) => {
		const longitude = region["longitude"];
		const longitude_delta = region["longitudeDelta"];
		const latitude = region["latitude"];
		const latitude_delta = region["latitudeDelta"];


		if (isViewReports) {
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
			const response = await fetch(`${IP.toString()}:${PORT.toString()}/get_missing_reports_in_area?long=${longitude}&long_delta=${longitude_delta}&lat=${latitude}&lat_delta=${latitude_delta}`);
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
			const response = await fetch(`${IP.toString()}:${PORT.toString()}/get_sightings_in_area?long=${longitude}&long_delta=${longitude_delta}&lat=${latitude}&lat_delta=${latitude_delta}`);
			const data = await response.json();
			// setSightings(data[0]);
			console.log("Fetched Sightings:", data); // Log fetched data
			setSightings(Array.isArray(data[0]) ? data[0] : []);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<View style={styles.container}>
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
				{isViewReports && Array.isArray(reports)
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
					: null}

				{/* Render sightings markers */}
				{!isViewReports && Array.isArray(sightings)
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
					: null}
			</MapView>


			{/* Switch and label */}
			<View style={styles.switchContainer}>
				<Text style={styles.switchLabel}>{isViewReports ? 'Reports' : 'Sightings'}</Text>
				<Switch
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					thumbColor={isViewReports ? "#f5dd4b" : "#f4f3f4"}
					value={isViewReports}
					onValueChange={value => handleViewToggle(value)}
				/>
			</View>

			{/* <VStack style={{position:'absolute', bottom:0, right:0, alignItems:'center', margin: 10, padding: 10, borderRadius: }} backgroundColor="grey"> */}
			<View style={{ position: 'absolute', top: 30 }} alignItems='center'>

				{
					isViewReports ? <Text style={styles.boldText}> {reports.length} reports in area</Text> : <Text style={styles.boldText}> {sightings.length} sightings in area</Text>
				}

				<TouchableOpacity style={styles.button} onPress={onPressSearch}>
					<Text style={styles.buttonText}>Search this area</Text>
				</TouchableOpacity>
			</View>


		</View>
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

	button: {
		borderRadius: 20,
		backgroundColor: 'blue',
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white'
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
/*<MapView
            style={{ flex: 1 }}
            // ... other MapView props
        >
            {reports.map((report, index) => (
                <Marker
                    key={report.id} // Assuming report has an id property, replace with appropriate key
                    coordinate={{ latitude: report.latitude, longitude: report.longitude }} // replace with actual report latitude and longitude properties
                    title={report.title}
                    description={report.description}
                    onPress={() => navigation.navigate('ReportPage', { report })}
                />
            ))}
        </MapView>
    );
}*/