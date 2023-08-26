import React from "react";
import { View } from 'react-native'
import { Image, Text, Box } from 'native-base';

const PetCard = ({color, pet}) => {
  const Color = {
    NENO_BLUE: 'blue' 
  };

  const petImage = pet.image_url;
  const petName = pet.name;
  const petType = pet.animal;
  const petBreed = pet.breed;
  const petDescription = pet.description.length > 50
    ? pet.description.substring(0, 50) + '...'
    : pet.description;
  
  const descriptionHeight = pet.description.length > 50
    ? petDescription.length * 0.5
    : 0;

  return (
    <Box
      backgroundColor= {color}
      borderTopLeftRadius= {20}
      borderBottomRightRadius= {20}
      height={150 + (descriptionHeight)}
      marginBottom={4}
    >
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: '35%', height: '100%'}}>
          {petImage && <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20 }} alt='pet' />}
        </View>

        <View style={{flex: 1, marginLeft: '5%', padding: '2%'}}>
          <Text style={{ fontSize: 30, paddingBottom: 10, paddingTop: 10 }}>{petName}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Species:</Text>
              <Text style={{ fontSize: 20, textTransform: 'capitalize' }}>{petType}</Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: '15%'}}>
              <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Breed:</Text>
              <Text style={{ fontSize: 20 }}>{petBreed}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: "#F2F2F7", marginBottom: '1%' }}>Details:</Text>
          <Text style={{ fontSize: 14 }}>{petDescription}</Text>
        </View>
        
      </View>
    </View>
    <Box h="4"></Box>
    </Box>
  );
};

export default PetCard;
