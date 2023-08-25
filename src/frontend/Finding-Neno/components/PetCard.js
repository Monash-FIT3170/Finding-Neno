import React, { useState } from 'react'; // Import useState
import { View, Modal } from 'react-native'
import { Image, Text, Box, Button } from 'native-base';

const PetCard = ({color, height, pet}) => {
  const Color = {
    NENO_BLUE: 'blue' 
  };

  

  const [isModalVisible, setIsModalVisible] = useState(false); // Initialize modal state

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
  };

  // Define the modal content
// Define the modal content
const modalContent = (
  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
    <Text>Have you reunited with your pet?</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
      <Button onPress={toggleModal}>Yes</Button>
      <Button onPress={toggleModal}>No</Button>
    </View>
  </View>
);



  // need to fix image appearing on the application correctly
  console.log(pet)

  const petImage = pet.image_url;
  const petName = pet.name[0].toUpperCase() + pet.name.substring(1);
  const petType = pet.animal[0].toUpperCase() + pet.animal.substring(1);
  const petBreed = pet.breed[0].toUpperCase() + pet.breed.substring(1);
  const petDescription = pet.description[0].toUpperCase() + pet.description.substring(1);
  const missing = pet.is_missing;

  const handleMissingButtonPress = () => {
    toggleModal(); // Toggle the modal when "Missing" button is pressed
  };
  

  const borderRadius = () => {
    if (missing) {
      return 0;
    } else {
      return 20;
    }
  };

  const displayMissingButton = () => {
    if (missing) {
      return (
        <Button
          title="Missing"
          bg="#454545"
          style={{ borderRadius: 0, borderBottomRightRadius: 20 }}
          onPress={handleMissingButtonPress} // Attach the onPress handler
        >
          Found Me!
        </Button>
      );
    } else {
      return <View></View>;
    }
  };

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

      {/* Custom modal overlay */}
      {isModalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          {modalContent}
        </View>
      )}
    </View>
  );
};

export default PetCard;
