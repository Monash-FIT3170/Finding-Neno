import React, {useEffect, useState} from 'react';
import { View } from 'react-native'
import {Dimensions} from 'react-native';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons'; 
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';


const Sighting = ({userId, sighting, setReloadParent}) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width; 

    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const { IP, PORT } = useSelector((state) => state.api)
    const isFocused = useIsFocused();

    const id = sighting[0];
    const missingReportId = sighting[1];
    const authorId = sighting[2];
    const dateTime = sighting[3];
    const locationLongitude = sighting[4];
    const locationLatitude = sighting[5];
    const sightingImage = sighting[6];
    const sightingDesc = sighting[7];
    const sightingAnimal = sighting[8][0].toUpperCase() +sighting[8].substring(1);
    const sightingBreed = sighting[9];
    const ownerName = sighting[10];
    const ownerEmail = sighting[11];
    const sightingPhoneNumber = sighting[12];
    const savedByUser = sighting[13];

    const [sightingSaved, setSightingSaved] = useState(savedByUser==USER_ID); // true if the sighting is saved by this user
    const [saveSightingEndpoint, setSaveSightingEndpoint] = useState('save_sighting');

    useEffect(() => {
        if (savedByUser==USER_ID) {
          setSaveSightingEndpoint('unsave_sighting');
        } else {
          setSaveSightingEndpoint('save_sighting');
        }
    
    }, [savedByUser]);
    
    const handlePressSaveBtn = async () => {

      if (savedByUser==USER_ID) {
        setSaveSightingEndpoint('unsave_sighting');
      } else {
        setSaveSightingEndpoint('save_sighting');
      }

      const url = `${IP}:${PORT}/${saveSightingEndpoint}`;
    
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID
        },
        body: JSON.stringify({sightingId: id}),
      })
        .then((res) => {
          if (res.status == 201) {
            setSightingSaved(!sightingSaved);
            setReloadParent(true);
          }
        })
        .catch((error) => alert(error));
    }

    const [suburb, setSuburb] = useState("");


    useEffect(() => {
      getSuburb();
    }, [])

    const getSuburb = async () => {
      try {
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${locationLatitude}&lon=${locationLongitude}&format=json`;

          const response = await fetch(apiUrl);

          const result = await response.json();
          setSuburb(`${result.address.suburb}, ${result.address.state}`);
          
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };
    
  return (
    <View justifyContent = "center" alignItems = "center" padding={4}>
        {/* TODO: unhard code the heights, widths etc later */}
    <Box width={windowWidth - 20} height={sightingImage ? 400 : 250} bg="#F9FDFF" borderRadius={15} paddingLeft={5} paddingTop={2} paddingRight={5}>
      
      <HStack paddingTop={3} alignItems={"center"} justifyContent={"space-between"}>
      <Heading size = "lg" >
        {suburb}
      </Heading>
      <Ionicons name={savedByUser==USER_ID ? "bookmark": "bookmark-outline"} size={20} onPress={handlePressSaveBtn}/>
      </HStack>

      <Heading size = "sm"  paddingTop={2}>
        Last seen { dateTime} 
      </Heading>

      <Text paddingTop={2}>
        {sightingDesc}
      </Text>

      <HStack space={8}>
        <VStack>
          <Heading size = "sm"  paddingTop={2}>
            {sightingAnimal}
          </Heading>
          <Text >
            Species
          </Text>
        </VStack>

        <VStack>
          <Heading size = "sm" paddingTop={2}>
              {sightingBreed}
          </Heading>
          <Text >
              Breed
          </Text>
        </VStack>
      </HStack>

      <Box width={windowWidth - 40} height={180}  paddingTop={5} paddingBottom={1} paddingRight={5}>
        {sightingImage && <Image source={{ uri: sightingImage }} style={{ width: '100%', height: '100%', borderRadius: 10, marginBottom: 8 }} alt="pet"/>}
      
        <Button width={'100%'} borderRadius={10} paddingTop={3}>
          Share
        </Button>
    
      </Box>

    </Box>
    </View>
  );
};

export default Sighting;