import React, {useEffect, useState} from 'react';
import { View } from 'react-native'
import {Dimensions} from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Sighting = ({userId, sighting}) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width; 

    console.log(sighting)

    const id = sighting[0];
    const missingReportId = sighting[1];
    const authorId = sighting[2];
    const dateTime = sighting[3];
    const locationLongitude = sighting[4];
    const locationLatitude = sighting[5];
    const location = sighting[6];
    const sightingImage = sighting[7];
    const sightingDesc = sighting[8];
    const sightingAnimal = sighting[9][0].toUpperCase() +sighting[9].substring(1);;
    const sightingBreed = sighting[10];
    const ownerName = sighting[11];
    const ownerEmail = sighting[12];
    const sightingPhoneNumber = sighting[13];
    const petName = sighting[14];
    console.log(location)

    const [suburb, setSuburb] = useState("");
    
  return (
    <View justifyContent = "center" alignItems = "center" padding={4}>
        {/* TODO: unhard code the heights, widths etc later */}
    <Box width={windowWidth - 20} height={sightingImage ? 400 : 250} bg="#F9FDFF" borderRadius={15} paddingLeft={5} paddingTop={2}>
      <Heading size = "lg"  paddingTop={3}>
        {location}
      </Heading>
      {/* <Heading size = "md"  paddingTop={2}>
        {petName ? petName : ""}
      </Heading> */}

      <Heading size = "sm"  paddingTop={2}>
        Last seen { dateTime} 
      </Heading>
      {/* TODO: put reverse geocoded location here  */}

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

