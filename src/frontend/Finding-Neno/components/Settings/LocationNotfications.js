import React, { useState, useRef, useEffect } from 'react';
import { Heading, Box, HStack, Text, Input, Switch, Slider, useToast} from 'native-base';
import {Dimensions, TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import marker from '../../assets/marker_icon.png';
import axios from 'axios';

import { useSelector } from "react-redux";


function LocationNotifications() {
  const {IP, PORT} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  // Component for Location Notifications
  const windowWidth = Dimensions.get('window').width; 
  const textInputWidth = windowWidth*0.7;
  const [boxHeight, setBoxHeight] = useState(150);
  const toast = useToast();

  
  // Data that will be saved to the database
  const [locationData, setLocationData] = useState(
    {
      enabled: false,
      long: 144.9631,
      lat: -37.8136,
      radius: 4,
    }
  );

    const [isEnabled, setIsEnabled] = useState(false);
  const [radiusText, setRadiusText] = useState(4);
  // Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
  const [mapRegion, setMapRegion] = useState({
    latitude: -37.8136,
    longitude: 144.9631,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  })
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({longitude: mapRegion.longitude, latitude: mapRegion.latitude});
  const mapViewRef = useRef(null);

  const renderLocationForm = () => {
    if(isEnabled) {
      return (
        <View>
          <HStack justifyContent="space-between"  marginBottom={2}>
            <Text fontSize="md">Location</Text>
            <Input
              onChangeText={(text) => updateLocation(text)} 
              onEndEditing={() => handleSearch()}
              placeholder="Enter Location" width={textInputWidth} textAlign="right" 
              variant={"unstyled"} />
          </HStack>
    
          <HStack justifyContent="space-between"  marginBottom={2}>
            <Text fontSize="md">Radius</Text>
            <Slider 
              width={200} 
              defaultValue={40} 
              minValue={0} 
              maxValue={100}
              onChange={(value) => updateRadius(value)}>
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
            </Slider>
            <Text fontSize="xs" color={"#BCBCBC"}>{radiusText}km</Text>
          </HStack>
    
          <Box height={150} marginBottom={2}>
              <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={mapRegion}
                onRegionChange={handleRegionChange}
              />

              <View style={styles.markerView}>
                <Image source={marker} style={styles.marker}/>
              </View>
          </Box>
            </View>
      )
    }
    else {
      return (<View />)
    }
  }

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    if(isEnabled){
      setBoxHeight(150);
      setLocationData({...locationData, enabled: false})
    } else {
      setBoxHeight(360);
      setLocationData({...locationData, enabled: true})
    }

    console.log(locationData)
  };

  const updateRadius = (newRadius) => {
    const radius = Math.round(newRadius*0.1)
    setLocationData({...locationData, radius: radius})
    setRadiusText(radius)
  }

  //map box for last known location
  // Retrieves coordinates of current centre of map when map is moved around
  const handleRegionChange = (region) => {
    setMapRegion(region);
    setCoordinates({ longitude: region.longitude, latitude: region.latitude });
    console.log(coordinates)
  }

  const handleSearch = async () => {
		try {
			const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

			const response = await axios.get(apiUrl);
			if (response.data.length > 0) {
				const firstResult = response.data[0];
				setCoordinates({
					latitude: parseFloat(firstResult.lat),
					longitude: parseFloat(firstResult.lon),
				});
        setLocationData({
          ...locationData, 
          longitude: parseFloat(firstResult.lon), 
          latitude: parseFloat(firstResult.lat)})
				mapViewRef.current.animateToRegion({
					latitude: parseFloat(firstResult.lat),
					longitude: parseFloat(firstResult.lon),
					longitudeDelta: 0.0015,
				});
			} else {
				setCoordinates(null);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			setCoordinates(null);
		}
	};

  const updateLocation= (newAddress) => {
    setAddress(newAddress)
  }
  
  const saveDetails = () => {
    // Show success
    console.log(locationData)
    updateMissingReport()
    if(false){
      console.log("error")
    } else {
        toast.show({
            description: "Location Notfification updated!",
            placement: "top"
        })
    }
  }
  
  const updateMissingReport = async () => {
    try {
      const response = await fetch(`${IP}:${PORT}/update_user_settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });
  
      if (response.ok) {
        console.log('User Settings updated successfully');
      } else {
        console.log('Error while updating User Settings:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

   
  return (
    <View>
      <Box h={boxHeight} backgroundColor={"#FFFFFF"} borderRadius={10} marginBottom={2}>
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
        <TouchableOpacity  onPress={saveDetails} fontSize="100%">
          <Text color={"#007AFF"} fontSize="md">Save</Text>
        </TouchableOpacity>
        </HStack>

        <HStack justifyContent="space-between" marginBottom={1}>
        <Text fontSize="md" marginTop={1}>Location Notifications</Text>
        <Switch
        onToggle={toggleSwitch}
        value={isEnabled}
        size={"sm"}
        />
        </HStack>
        <Text fontSize="xs" color={"#BCBCBC"} marginBottom={2}>
          Recieve email notifications when a sighting is reported in your desired location
        </Text>

        {renderLocationForm()}

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