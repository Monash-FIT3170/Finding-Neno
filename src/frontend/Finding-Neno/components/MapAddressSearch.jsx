import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import marker from '../assets/marker_icon.png';
import { Image, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Input } from "native-base";
import { Button } from 'react-native-paper';
import { Color } from "../components/atomic/Theme";
import { useTheme } from '@react-navigation/native';


const MapAddressSearch = ({ setFormData, formData }) => {

    const { colors } = useTheme();
	//map box for last known location
	// Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
	const [mapRegion, setMapRegion] = useState({
		latitude: -37.8136,
		longitude: 144.9631,
		latitudeDelta: 0.03,
		longitudeDelta: 0.03,
	})

    useEffect(() => {
        setFormData({
            ...formData, lastLocation: `${mapRegion.longitude}, ${mapRegion.latitude}`
        })
    }, [])

    const [address, setAddress] = useState('');

	// Retrieves coordinates of current centre of map when map is moved around
	const handleRegionChange = (region) => {
		setMapRegion(region);
        setFormData({
            ...formData,
            lastLocation: `${region.longitude}, ${region.latitude}`,
        });
        console.log(`last location: ${formData.lastLocation}`)
    }

    const handleSearch = async () => {
        try {
            console.log("running")
            const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

			const response = await fetch(apiUrl);
			const result = await response.json();
			if (result.length > 0) {
				const firstResult = result[0];
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
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const mapViewRef = useRef(null);

    return (
        <View>
            <View style={{height: 150, marginBottom: 5}}>
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
            <Input color={colors.text} size="lg" marginTop={1} onChangeText={text => setAddress(text)} placeholder="Enter an address" />

            <Button style={{ marginTop: 8, borderColor: Color.NENO_BLUE }} textColor={Color.NENO_BLUE} mode="outlined" title="Search Address" onPress={handleSearch}>Search Address</Button>
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