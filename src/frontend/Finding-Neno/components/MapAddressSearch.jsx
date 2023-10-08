import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import marker from '../assets/marker_icon.png';
import { Image, StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { Button, Input } from "native-base";

const MapAddressSearch = ({ setFormData, formData }) => {

	//map box for last known location
	// Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
	const [mapRegion, setMapRegion] = useState({
		latitude: -37.8136,
		longitude: 144.9631,
		latitudeDelta: 0.03,
		longitudeDelta: 0.03,
	})

    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({longitude: mapRegion.longitude, latitude: mapRegion.latitude});

	// Retrieves coordinates of current centre of map when map is moved around
	const handleRegionChange = (region) => {
		setMapRegion(region);
        console.log(region.longitude);
        console.log(region.latitude);
        setFormData({
            ...formData,
            lastLocation: `${region.longitude}, ${region.latitude}`,
        });
        console.log(formData.lastLocation)
        setCoordinates({ longitude: region.longitude, latitude: region.latitude });
    }

    const handleSearch = async () => {
        try {
            const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

			const response = await fetch(apiUrl);
			const result = await response.json();
			if (result.length > 0) {
				const firstResult = result[0];
                setCoordinates({
                    latitude: parseFloat(firstResult.lat),
                    longitude: parseFloat(firstResult.lon),
                });
                setFormData({
                    ...formData,
                    lastLocation: `${parseFloat(firstResult.lon)}, ${parseFloat(firstResult.lat)}`,
                });
                // You can animate to the new coordinates here if you want
                mapViewRef.current.animateToRegion({
                    latitude: parseFloat(firstResult.lat),
                    longitude: parseFloat(firstResult.lon),
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.05,
                });
            } else {
                setCoordinates(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setCoordinates(null);
        }
    };

    const mapViewRef = useRef(null);

    return (
        <View>
            <View height={150} marginBottom={2}>
                <MapView
                    ref={mapViewRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={mapRegion}
                    onRegionChangeComplete={handleRegionChange}
                >
                </MapView>

                <View style={styles.markerView}>
                    <Image source={marker} style={styles.marker}></Image>
                </View>

            </View>
            <Input onChangeText={text => setAddress(text)} placeholder="Enter an address" />

            <Button title="Search" onPress={handleSearch}>Search Adress</Button>
        </View>
    )
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
	markerView: {
		top: '50%',
		left: '50%',
		marginLeft: -24,
		marginTop: -44,
		position: 'absolute',
	},
	marker: {
		height: 48,
		width: 48
	}
});

export default MapAddressSearch;