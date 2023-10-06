import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity } from 'react-native'
import { Modal } from 'native-base';
import { Image, Text, Box, Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';

const PetCard = ({color, pet, onClick, editMode, onUpdate}) => {
  const {API_URL} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  const Color = {
    NENO_BLUE: 'blue' 
  };

  const petName = pet.name[0].toUpperCase() + pet.name.substring(1);
  const petType = pet.animal[0].toUpperCase() + pet.animal.substring(1);
  const petBreed = pet.breed[0].toUpperCase() + pet.breed.substring(1);
  const petImage = pet.image_url;
  const petDescription =
  pet.description.length > 50
    ? pet.description.substring(0, 50) + "..."
    : pet.description;
  const [showConfirmFoundModal, setShowConfirmFoundModal] = useState(false);
  const descriptionHeight =
  pet.description.length > 50 && !editMode ? petDescription.length * 0.5 : 0;

  // Button to confirm if user has found pet
  const borderRadius = () => {
    if (pet.is_missing) {
      return 0;
    } else {
      return 20;
    }
  };

  const displayMissingButton = () => {
    if (pet.is_missing) {
      return (
        <Button
          title="Missing"
          bg="#454545"
          style={{ borderRadius: 0, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }}
          onPress={() => setShowConfirmFoundModal(true)} // Attach the onPress handler
        >
          Found Me!
        </Button>
      );
    } else {
      return <View></View>;
    }
  };

  const toggleMissingStatus = async () => {
    console.log("Updating the pet status")
    try {
        petId = pet.id;
        const response = await fetch(`${API_URL}/update_missing_status`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'User-ID': USER_ID,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pet_id: petId, isMissing: false }),
        });

        console.log("Response status:", response.status)

        if (response.ok) {
            await fetchMissingReport();
            // Perform any necessary updates on the frontend
            onUpdate();
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
    const response = await fetch(`${API_URL}/get_reports_by_pet?pet_id=${pet.id}`, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID,
          'Content-Type': 'application/json',
      },
    });

    console.log("Response status:", response.status)

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
  console.log(report_id)
  try {
    const response = await fetch(`${API_URL}/update_report_active_status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'User-ID': USER_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report_id: report_id,
        is_active: false,
      }),
    });

    if (response.ok) {
      console.log('Report updated successfully');
    } else {
      console.log('Error while updating report:', response.statusText);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};


  
  return (
    <View>
    <TouchableOpacity
    activeOpacity={editMode ? 0.6 : 1}
    onPress={editMode ? onClick : null}>
      <Box
        backgroundColor={color}
        borderTopLeftRadius={20}
        borderBottomRightRadius={borderRadius()}
        borderBottomLeftRadius={borderRadius()}
        height={150 + descriptionHeight}
        style={{ opacity: editMode ? 0.8 : 1, borderRadius: 20, overflow: "hidden" }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: "35%", height: "100%" }}>
              {petImage && (
                <Image
                  source={{ uri: petImage }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderTopLeftRadius: 20,
                  }}
                  alt="pet"
                />
              )}
            </View>

            <View style={{ flex: 1, marginLeft: "5%", padding: "2%" }}>
              <Text style={{ fontSize: 25, paddingBottom: 10, paddingTop: 10 }}>
                {petName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 8,
                }}
              >
                <View style={{ flexDirection: "column"}}>
                  <Text style={{ fontSize: 12, color: "#F2F2F7" }}>
                    Species:
                  </Text>
                  <Text style={{ fontSize: 16, textTransform: "capitalize" }}>
                    {petType}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    marginLeft: "20%",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Breed:</Text>
                  <Text style={{ fontSize: 16 }}>{petBreed}</Text>
                </View>
              </View>
              {!editMode && (
                <>
                  <Text style={{ fontSize: 12, color: "#F2F2F7", marginBottom: "1%" }}>
                    Details:
                  </Text>
                  <Text style={{ fontSize: 14 }}>{petDescription}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Box>
    </TouchableOpacity>
    {displayMissingButton()}
      {showConfirmFoundModal && <ConfirmFoundModal isVisible={showConfirmFoundModal} setIsVisible={setShowConfirmFoundModal} onRemove={() => toggleMissingStatus()}/>}
    <Box h="4"></Box>
    </View>
  );
};

function ConfirmFoundModal({ isVisible, setIsVisible, onRemove }) {
  return <Modal isOpen={isVisible} onClose={() => setIsVisible(false)} size={"md"}>
    <Modal.Content >
      <Modal.CloseButton />
      <Modal.Header>Remove missing pet report?</Modal.Header>
      <Modal.Body>
        <Text>Are you sure you want remove this missing pet report?</Text>
      </Modal.Body>
      <Modal.Footer>
        <Button.Group space={2}>
          <Button variant="ghost" colorScheme="blueGray" onPress={() => setIsVisible(false)} >
            Cancel
          </Button>
          <Button onPress={() => {
            onRemove()
            setIsVisible(false)
          }} backgroundColor={"#FA8072"}>
            Remove
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
}


export default PetCard;