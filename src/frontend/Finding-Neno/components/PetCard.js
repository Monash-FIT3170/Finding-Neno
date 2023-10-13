import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity } from 'react-native'
import { Button, Heading, Modal } from 'native-base';
import { Image, Text, Box } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import ImageView from 'react-native-image-viewing';
import { useTheme } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import IconText from './Shared/IconText';
import { Color } from './atomic/Theme';
import { Button as PaperButton } from 'react-native-paper';

const PetCard = ({color, pet, onClick, editMode, onUpdate}) => {
  const {API_URL} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  const { colors } = useTheme();
  
  const [enlargeImage, setEnlargeImage] = useState(false);
  const closeImageModal = () => {
      setEnlargeImage(false);
  }

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
          Mark as Found
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
                  
                  
      <ImageView images={[{uri: petImage}]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor={colors.background}/>

      <View
          style={{
            backgroundColor: 'transparent',
            shadowOffset: { width: 4, height: -6 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
      <Box
        backgroundColor={colors.border}
        borderTopLeftRadius={20}
        borderBottomRightRadius={borderRadius()}
        borderBottomLeftRadius={borderRadius()}
        height={150 + descriptionHeight}
        style={{ 
          opacity: editMode ? 0.8 : 1,
          borderRadius: 20, 
          overflow: "hidden",

      }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: "35%", height: "100%" }}>
              {petImage && (
                
                <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD">
                  <Image
                    source={{ uri: petImage }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderTopLeftRadius: 20,
                    }}
                    alt="pet"
                  />
                </TouchableHighlight>
              )}
            </View>

            <View style={{ flex: 1, marginLeft: "5%", padding: "2%" }}>
              <Text color={colors.text} style={{ fontSize: 25, paddingBottom: 10, paddingTop: 10 }}>
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
                  <Heading fontSize="sm" color={colors.text} size="sm">Species</Heading>
                  
                  {
                    petType == 'other' ?
                      <Text color={colors.text}>{petType}</Text> :
                      <View style={{ width: '100%' }}>
                        <IconText iconName={petType.toLowerCase()} text={petType}
                          iconColor={Color.NENO_BLUE} textColor={colors.text} iconSize={19} fontWeight='normal' />
                      </View>
                  }
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    marginLeft: "20%",
                  }}
                >
                  <Heading fontSize="sm" color={colors.text} size="sm">Breed</Heading>
                  <Text color={colors.text} style={{ fontSize: 16 }}>{petBreed}</Text>
                </View>
              </View>
              {!editMode && (
                <>
                  <Heading fontSize="sm" color={colors.text} size="sm">Details</Heading>
                  <Text color={colors.text} style={{ fontSize: 14 }}>{petDescription}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Box>
      </View>
    </TouchableOpacity>
    {displayMissingButton()}
      {showConfirmFoundModal && <ConfirmFoundModal isVisible={showConfirmFoundModal} colors={colors} setIsVisible={setShowConfirmFoundModal} onRemove={() => toggleMissingStatus()}/>}
    <Box h="4"></Box>
    </View>
  );
};

function ConfirmFoundModal({ isVisible, setIsVisible, onRemove, colors }) {
  return <Modal isOpen={isVisible} onClose={() => setIsVisible(false)} size={"md"}>
    <Modal.Content >
    <Modal.CloseButton _icon={{color: colors.text}} />
      <Modal.Header _text={{color: colors.text}} backgroundColor={colors.background} borderColor={colors.border}>Mark pet as found?</Modal.Header>
      <Modal.Body backgroundColor={colors.background}>
        <Text color={colors.text}>Please confirm that this pet has been found. This will remove its missing pet reports.</Text>
      </Modal.Body>
      <Modal.Footer backgroundColor={colors.background} borderColor={colors.border}>
          <PaperButton mode='outlined' textColor={Color.NENO_BLUE} style={{borderColor: Color.NENO_BLUE, marginRight: 6}} onPress={() => { setIsVisible(false) }} >Cancel</PaperButton>
          <PaperButton mode='contained' textColor='white' buttonColor={Color.NENO_BLUE} style={{ marginLeft: 4, width: 100 }} onPress={() => {onRemove(); setIsVisible(false)}}>Confirm</PaperButton>
       </Modal.Footer>
    </Modal.Content>
  </Modal>
}


export default PetCard;