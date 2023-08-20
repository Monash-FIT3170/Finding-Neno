import React, {useState} from 'react';
import { View } from 'react-native'
import {Dimensions} from 'react-native';

import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Report = ({report}) => {
    // Pet Data
    //const petName = pet.name;
    //const petSpecies = pet.species;
    //const petBreed = pet.breed;
    //const petDesc = pet.desc;
    //const petLastSeen = pet.lastSeen;
    //const petLastKnownLocaton = pet.lastKnownLocation;
    const windowWidth = Dimensions.get('window').width; 
    console.log(report)

    const lastSeen = report[1];
    const reportDesc = report[2];
    const location = report[3];
    
    const petName = report[6];
    const petSpecies = report[7];
    const petBreed = report[8];
    const petImage = report[9];
    
  return (
    <View justifyContent = "center" alignItems = "center" padding={4}>
    <Box width={windowWidth - 20} height={400} bg="#F9FDFF" borderRadius={15}>
      <Heading size = "xl" paddingLeft={5} paddingTop={2}>
      {petName}
      </Heading>
      <Text paddingLeft={5}>
        last seen {lastSeen}
      </Text>

      <Heading size = "sm" paddingLeft={5} paddingTop={2}>
        need to add location here
      </Heading>

      <HStack>
        <VStack>
          <Heading size = "sm" paddingLeft={5} paddingTop={2}>
            {petSpecies}
          </Heading>
          <Text paddingLeft={5}>
            Species
          </Text>
        </VStack>

        <VStack>
          <Heading size = "sm" paddingLeft={5} paddingTop={2}>
              {petBreed}
          </Heading>
          <Text paddingLeft={5}>
              Breed
          </Text>
        </VStack>
      </HStack>

      <Box width={windowWidth - 40} height={180} paddingLeft={5} paddingTop={5} paddingBottom={1}>
      <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20  }} alt='pet' />
      </Box>

      {/* <Box width={windowWidth - 40} height={40} paddingLeft={5} paddingTop={1}  alignItems = "end"> */}
      <HStack width={windowWidth}  justifyContent = "space-between">
      <Box width={windowWidth} height={40} paddingLeft={5} paddingTop={1}>
        <Button width={250} borderBottomLeftRadius={20} borderTopRightRadius={0}  borderBottomRightRadius={0}>
          Report a Sighting
        </Button>
        </Box>
        
        <Box width={windowWidth} height={40} paddingLeft={5} paddingTop={1}>
        <Button borderTopLeftRadius={0}  borderBottomLeftRadius={0} borderBottomRightRadius={20}>
          Share
        </Button>
      
      </Box>
      </HStack>
      

    </Box>
    </View>
  );
};

export default Report;


/*
      <HStack alignItems="center">
          <Image 
              alignSelf="center" size={36} borderRadius={18} 
              source={{
                uri: userImage
              }} 
              alt="User Image" 
          /> 
          <Box width={2}></Box>
          <VStack>
          <Heading size = "sm">
            {userName}
          </Heading>
          <Text style={{ color: 'black' }} fontSize="xs">{isHidden ? userPhoneHidden : userPhone}</Text>
          </VStack>
          <Box width={70}></Box>
          <Button onPress={toggleVisibility}>
          <Text>Show/Hide</Text>
          </Button>
      </HStack>

      <Box height={5}></Box>

            <Image 
              alignSelf="center" width={windowWidth - 80} height={125}
              source={{
                uri: userImage
              }} 
              alt="Pet Image" 
          /> 
      <Box height={2}></Box>

            <HStack>
        <Heading size = "md">
            {petName}
        </Heading>
      </HStack>
      <HStack justifyContent="flex-start" space={10}>
        <VStack>
          <Heading size = "sm" color="#B8B8B8">
            Pet Type
          </Heading>
          <Text fontSize="sm">
              {petSpecies}
          </Text>
        </VStack>

        <VStack>
          <Heading size = "sm" color="#B8B8B8">
            Breed
          </Heading>
          <Text fontSize="sm">
              {petBreed}
          </Text>
        </VStack>
      </HStack>
      
      <VStack>
          <Heading size = "sm" color="#B8B8B8">
            Description
          </Heading>
          <Text fontSize="sm">
              {petDesc}
          </Text>
      </VStack>

      <HStack justifyContent="space-between">
      <Heading size = "sm">
            Last Seen
          </Heading>
          <Text fontSize="sm">
              {petLastSeen}
          </Text>
      </HStack>
      
      <HStack justifyContent="space-between">
      <Heading size = "sm">
            Last Known Location
          </Heading>
          <Text fontSize="sm">
              {petLastKnownLocaton}
          </Text>
      </HStack>
      

*/