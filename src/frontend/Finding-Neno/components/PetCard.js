import React from 'react';
import { View } from 'react-native'
import { Image, Text, Box, Button } from 'native-base';

const PetCard = ({color, height, pet}) => {
  const Color = {
    NENO_BLUE: 'blue' 
  };

  
  // need to fix image appearing on the application correctly
  console.log(pet)

  const petImage = pet.image_url;
  const petName = pet.name[0].toUpperCase() + pet.name.substring(1);
  const petType = pet.animal[0].toUpperCase() + pet.animal.substring(1);
  const petBreed = pet.breed[0].toUpperCase() + pet.breed.substring(1);
  const petDescription = pet.description[0].toUpperCase() + pet.description.substring(1);
  const missing = pet.is_missing;

  const borderRadius = () => {
    if(missing) {
      return 0;
    } else {
      return 20;
    }
  }


  const displayMissingButton = () => {
    if(missing) {
    return (
      <Button title="Missing"  bg="#FA8072" style={{borderRadius: 0, borderBottomRightRadius: 20 }}>
        Found Me!
      </Button>
    );
    } else {
      return (
        <View></View>
      );
    }
  }

  
  return (
    <View>
    <View style={{
        backgroundColor: color,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: borderRadius(),
      }}
      height={height}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: '35%', height: '100%'}}>
          {petImage && <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20 }} alt='pet' />}
        </View>

        <View style={{flex: 1, marginLeft: '5%', padding: '2%'}}>
          <Text style={{ fontSize: 30, paddingBottom: 10, paddingTop: 10 }}>{petName}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Species:</Text>
              <Text style={{ fontSize: 20, textTransform: 'capitalize' }}>{petType}</Text>
            </View>
            <View style={{flexDirection: 'column', marginLeft: '15%'}}>
              <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Breed:</Text>
              <Text style={{ fontSize: 20 }}>{petBreed}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: "#F2F2F7", marginBottom: '1%' }}>Details:</Text>
          <Text style={{ fontSize: 14 }}>{petDescription}</Text>
        </View>
      </View>
    </View>
    {displayMissingButton()}
    <Box h="8"></Box>
    </View>
  );
};

export default PetCard;
