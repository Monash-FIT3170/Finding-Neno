import React, {useState} from 'react';
import { View } from 'react-native'
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';

const Report = ({ windowWidth }) => {
  const Color = {
    NENO_BLUE: 'blue' // Example color value
  };

    // DUMMY DATAr
    // User Data
    const userName = "Human Being";
    const userImage = "https://wallpaperaccess.com/full/317501.jpg";
    const userEmail = "sample@student.monash.edu";
    const userPhoneHidden = "04xx xxx xxx";
    const userPhone = "0412 345 678";
    // Pet Data
    const petName = "Peanutbutter";
    const petSpecies = "Dog";
    const petBreed = "Labrador";
    const petDesc = "Is this a crossever episode and i am testing that this is wrapping around";
    const petLastSeen = "3:00 pm, 18/05/2023";
    const petLastKnownLocaton = "Clayton";

    const [isHidden, setIsHidden] = useState(true);

    const toggleVisibility = () => {
      setIsHidden(!isHidden);
    };
    

  return (
    <View>
    <Box width={windowWidth - 60} height={375} bg="#F5F5F5" borderRadius={15} padding={2}>
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
      
    </Box>
    </View>
  );
};

export default Report;
