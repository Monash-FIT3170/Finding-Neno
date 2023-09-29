import React, { useState, useRef } from 'react';
import { Heading, Box, HStack, Text, Input, Switch, Slider} from 'native-base';
import {Dimensions, TouchableOpacity, StyleSheet, Image, View } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import marker from '../../assets/marker_icon.png';

function LocationNotifications() {
    const windowWidth = Dimensions.get('window').width; 
    const textInputWidth = windowWidth*0.7;

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    //map box for last known location
      // Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
      const [mapRegion, setMapRegion] = useState({
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
      })
  
      // Retrieves coordinates of current centre of map when map is moved around
      const handleRegionChange = (region) => {
          setMapRegion(region);
          setCoordinates({ longitude: region.longitude, latitude: region.latitude });
          console.log(coordinates)
      }
  
      const [address, setAddress] = useState('');
      const [coordinates, setCoordinates] = useState({longitude: mapRegion.longitude, latitude: mapRegion.latitude});
      const mapViewRef = useRef(null);

    return (
      <View>
        <Box h={360} backgroundColor={"#FFFFFF"} borderRadius={10} marginBottom={2}>
        <Box padding={3}>
        <HStack justifyContent="space-between" marginBottom={3}>
        <Heading
          fontSize="md"
          color="coolGray.600"
          _dark={{ color: "warmGray.200" }}
          pr={windowWidth / 3.5}
        >
        Notification
        </Heading>
        <TouchableOpacity fontSize="100%">
          <Text color={"#007AFF"} fontSize="md">Save</Text>
        </TouchableOpacity>
        </HStack>

        <HStack justifyContent="space-between" marginBottom={1}>
        <Text fontSize="md" marginTop={1}>Location Notifications</Text>
        <Switch
        onValueChange={toggleSwitch}
        value={isEnabled}
        size={"sm"}
        />
        </HStack>
        <Text fontSize="xs" color={"#BCBCBC"} marginBottom={2}>
          Recieve email notifications when a sighting is reported in your desired location
        </Text>

        <HStack justifyContent="space-between"  marginBottom={2}>
        <Text fontSize="md">Location</Text>
        <Input placeholder="Enter Location" width={textInputWidth} textAlign="right" variant={"unstyled"} />
        </HStack>

        <HStack justifyContent="space-between"  marginBottom={2}>
        <Text fontSize="md">Radius</Text>
        <Slider 
          width={200} 
          defaultValue={70} 
          minValue={0} 
          maxValue={100}>
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
        </Slider>
        <Text fontSize="xs" color={"#BCBCBC"}>10km</Text>
        </HStack>

        <Box height={150} marginBottom={2}>
										<MapView
											ref={mapViewRef}
											provider={PROVIDER_GOOGLE}
											style={styles.map}
											initialRegion={mapRegion}
											onRegionChange={handleRegionChange}
										>
										</MapView>

										<View style={styles.markerView}>
											<Image source={marker} style={styles.marker}></Image>
										</View>
									</Box>

        </Box>  
        </Box>
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
	button: {
		borderRadius: 20,
		backgroundColor: 'blue',
	},
	markerView: {
		top: '50%',
		left: '50%',
		marginLeft: -24,
		marginTop: -44,
		position: 'absolute',
	},
	marker: {
		height: 24,
		width: 24
	}
});
  
export default LocationNotifications;