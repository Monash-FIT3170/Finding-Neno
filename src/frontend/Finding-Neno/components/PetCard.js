import React, { useState, useEffect } from 'react'; // Import useState
import { View, Modal } from 'react-native'
import { Image, Text, Box, Button } from 'native-base';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";

const PetCard = ({color, height, pet}) => {
  const {IP, PORT} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
  const Color = {
    NENO_BLUE: 'blue' 
  };

  const petImage = pet.image_url;
  const petName = pet.name[0].toUpperCase() + pet.name.substring(1);
  const petType = pet.animal[0].toUpperCase() + pet.animal.substring(1);
  const petBreed = pet.breed[0].toUpperCase() + pet.breed.substring(1);
  const petDescription = pet.description[0].toUpperCase() + pet.description.substring(1);
  const [missing, setMissing] = useState(pet.is_missing);
  //const [refresh, setRefresh] = useState(false);
  
  const handleMissingButtonPress = () => {
    toggleModal(); // Toggle the modal when "Missing" button is pressed
  };
  
  const [isModalVisible, setIsModalVisible] = useState(false); // Initialize modal state

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
  };

  const toggleMissingStatus = async () => {
    try {
        petId = pet.id;
        const response = await fetch(`${IP}:${PORT}/update_missing_status`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'User-ID': USER_ID,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pet_id: petId, isMissing: false }),
        });

        if (response.ok) {
            await fetchMissingReport();
            // Perform any necessary updates on the frontend
            toggleModal();
            setMissing(!missing);
          } else {
            console.log('Error while toggling status:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

const fetchMissingReport = async () => {
  try {
    petId = pet.id;
    const response = await fetch(`${IP}:${PORT}/get_reports_by_pet?pet_id=${pet.id}`, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID,
          'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      report = data[0][0];

      console.log('Response data:', report);

      await updateMissingReport(report);
    } else {
      console.log('Error while toggling status:', response.statusText);
  }

  } catch (error) {
      console.error('An error occurred:', error);
  }
};

const updateMissingReport = async (report) => {
  report_id = report[0];
  try {
    const response = await fetch(`${IP}:${PORT}/update_report_active_status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'User-ID': USER_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report_id: report_id,
        isActive: false,
      }),
    });

    console.log(response.status)

    if (response.ok) {
      console.log('Report updated successfully');
    } else {
      console.log('Error while updating report:', response.statusText);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
// Define the modal content
const modalContent = (
  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
    <Text>Have you reunited with your pet?</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
      <Button onPress={toggleMissingStatus}>Yes</Button>
      <Button onPress={toggleModal}>No</Button>
    </View>
  </View>
);

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
