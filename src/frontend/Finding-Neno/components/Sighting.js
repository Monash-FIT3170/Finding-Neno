import React, {useEffect, useState} from 'react';
import { View } from 'react-native'
import {Dimensions} from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Report = ({userId, sighting}) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width; 

    console.log(sighting)

    const id = sighting[0];
    const missingReportId = sighting[1];
    const authorId = sighting[2];
    const dateTime = sighting[3];
    const locationLongitude = sighting[4];
    const locationLatitude = sighting[5];
    const sightingImage = sighting[6];
    const sightingDesc = sighting[7];
    const sightingAnimal = sighting[8][0].toUpperCase() +sighting[8].substring(1);;
    const sightingBreed = sighting[9];
    const ownerName = sighting[10];
    const ownerEmail = sighting[11];
    const sightingPhoneNumber = sighting[12];

    const [suburb, setSuburb] = useState("");


    useEffect(() => {
      getSuburb();
    }, [])

    const getSuburb = async () => {
      try {
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${locationLatitude}&lon=${locationLongitude}&format=json`;

          const response = await fetch(apiUrl);

          const result = await response.json();
          setSuburb(`${result.address.suburb}, ${result.address.state}`)
          
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };
    
  return (
    <View justifyContent = "center" alignItems = "center" padding={4}>
        {/* TODO: unhard code the heights, widths etc later */}
    <Box width={windowWidth - 20} height={sightingImage ? 400 : 250} bg="#F9FDFF" borderRadius={15} paddingLeft={5} paddingTop={2}>
      <Heading size = "lg"  paddingTop={3}>
        {suburb}
      </Heading>

      <Heading size = "sm"  paddingTop={2}>
        {dateTime}
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

export default Report;

