import React from 'react';
import { View } from 'react-native'
import { Image, Text, Box } from 'native-base';

const PetCard = ({color, height, pet}) => {
  const Color = {
    NENO_BLUE: 'blue' 
  };

  console.log("pet")
  console.log(pet.image_url)

  const petImage = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";
  const petName = pet.name;
  const petType = pet.animal;
  const petBreed = pet.breed;
  const petDescription = pet.description;

  
  return (
    <View>
    <View style={{
        backgroundColor: color,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
      height={height}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: '35%', height: '100%'}}>
          {petImage && <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20 }} alt='pet' />}
        </View>

        <View style={{flex: 1, marginLeft: '5%', padding: '2%'}}>
          <Text style={{ fontSize: 30, paddingBottom: 10, paddingTop: 10 }}>{petName}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
            <View style={{flexDirection: 'column', alignItems: 'left'}}>
              <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Species:</Text>
              <Text style={{ fontSize: 20, textTransform: 'capitalize' }}>{petType}</Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'left', marginLeft: '15%'}}>
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
    </View>
  );
};

export default PetCard;
