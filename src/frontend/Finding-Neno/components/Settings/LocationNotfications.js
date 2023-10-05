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
  const [boxHeight, setBoxHeight] = useState(200);
  const toast = useToast();

  
  // Data that will be saved to the database
  const [locationData, setLocationData] = useState();

  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("Settings Page Opened")
    if (isFocused) {
      fetchUserSettings();
    }
  }, [isFocused]);

  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(false);
  const [possibleSightingsEnabled, setPossibleSightingsEnabled] = useState(false);
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
    if(localNotificationsEnabled) {
      return (
        <View>
          <HStack justifyContent="space-between"  marginBottom='1%'>
            <Text fontSize="md">Location</Text>
            <Input
              onChangeText={(text) => updateLocation(text)} 
              onEndEditing={() => handleSearch()}
              placeholder="Enter Location" width={textInputWidth} textAlign="right" 
              variant={"unstyled"} />
          </HStack>
    
          <HStack justifyContent="space-between"  marginBottom='1%'>
            <Text fontSize="md">Radius</Text>
            <Slider 
              width={200} 
              defaultValue={locationData['radius']*10} 
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
    
          <Box height={150} marginBottom='1%' >
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

  const toggleLocationNotifications = () => {
    setLocalNotificationsEnabled(previousState => !previousState)
    if(localNotificationsEnabled){
      setBoxHeight(200);
      setLocationData({...locationData, enabled: false})
    } else {
      setBoxHeight(410);
      setLocationData({...locationData, enabled: true})
    }
  };

  const togglePossibleNotifications = () => {
    setPossibleSightingsEnabled(previousState => !previousState)
    if(possibleSightingsEnabled){
      setLocationData({...locationData, possible_sightings: false})
    } else {
      setLocationData({...locationData, possible_sightings: true})    
    }
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
  }

  const handleSearch = async () => {
		try {
			const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

			const response = await axios.get(apiUrl);
			if (response.data.length > 0) {
				const firstResult = response.data[0];
				setLocationData({ ...locationData,
					lat: parseFloat(firstResult.lat),
					long: parseFloat(firstResult.lon),
				});
				mapViewRef.current.animateToRegion({
					latitude: parseFloat(firstResult.lat),
					longitude: parseFloat(firstResult.lon),
					longitudeDelta: 0.03,
				});
			} else {
        // do nothing
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

  const updateLocation= (newAddress) => {
    setAddress(newAddress)
  }
  
  const saveDetails = () => {
    // Show success
    console.log(locationData)
    updateUserSettings()
    if(false){
      console.log("error")
    } else {
        toast.show({
            description: "Location Notification updated!",
            placement: "top"
        })
    }
  }
  
  const updateUserSettings = async () => {
    try {
      const response = await fetch(`${IP}:${PORT}/update_location_notification_settings`, {
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

  const fetchUserSettings = async () => {
    try {
      const url = `${IP}:${PORT}/get_location_notification_settings?user_id=${USER_ID}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'User-ID': USER_ID
        }
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
    }
    const user_settings = result[0];
    const enabled = user_settings[0];
    const long = user_settings[1] ? user_settings[1] : mapRegion.longitude;
    const lat = user_settings[2] ? user_settings[2] : mapRegion.latitude;
    const radius = user_settings[3] ? user_settings[3] : 5;
    const possible_sightings = user_settings[4] ? user_settings[4] : false;
    setLocationData({enabled: enabled, long: long, lat: lat, radius: radius, possible_sightings: possible_sightings})

    setPossibleSightingsEnabled(possible_sightings)
    if(enabled){
      setLocalNotificationsEnabled(true);
      setBoxHeight(410);
    }
    setRadiusText(radius)
    setMapRegion({ latitude: lat, longitude: long, latitudeDelta: 0.03, longitudeDelta: 0.03 })

    console.log(locationData)
    }  catch (error) {
      console.error('An error occurred:', error);
    }

  };

   
  return (
    <View>
      <Box h={boxHeight} backgroundColor={"#FFFFFF"} borderRadius={10} marginBottom='5%'>
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

        <HStack justifyContent="space-between" marginBottom='-5%'>
        <Text fontSize="md" marginTop={1}>Possible Sightings Alert</Text>
        <Switch
        onToggle={togglePossibleNotifications}
        value={possibleSightingsEnabled}
        size={"sm"}
        />
        </HStack>

        <Input variant="underlined" isDisabled borderBottomWidth="3%" marginBottom='3%'/>

        <HStack justifyContent="space-between" marginBottom={1}>
        <Text fontSize="md" marginTop={1}>Location Notifications</Text>
        <Switch
        onToggle={toggleLocationNotifications}
        value={localNotificationsEnabled}
        size={"sm"}
        />
        </HStack>
        <Text fontSize="xs" color={"#BCBCBC"} marginBottom='1%'>
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