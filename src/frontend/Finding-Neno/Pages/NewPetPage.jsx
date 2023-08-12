import React, { useState } from 'react';
import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import { View, Image, ScrollView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { IP, PORT } from "@env";


const AlertComponent = ({ onClose }) => (
	<Alert w="100%" status="success">
		<VStack space={1} flexShrink={1} w="100%" alignItems="center">
			<Alert.Icon size="md" />
			<Text fontSize="md" fontWeight="medium" _dark={{ color: "coolGray.800" }}>
				Your pet has been added!
			</Text>
			<Button mt="2" bgColor={Color.NENO_BLUE} onPress={onClose}>
				Close
			</Button>
		</VStack>
	</Alert>
);

const NewPetPage = ({ navigation: { navigate }, route }) => {
  const navigation = useNavigation();
	
  const access_token = route.params["accessToken"];
  const owner_id = route.params["ownerId"]
  const pet = route.params["pet"]

  const [formData, setFormData] = useState({ description: '' });
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Add Pet")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [petImage, setPetImage] = useState(pet ? pet.image_url : null);
  const [petType, setPetType] = useState(pet ? pet.animal : '');

  const petTypeOptions = [
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
    { label: "Rabbit", value: "rabbit" },
    { label: "Mouse", value: "mouse" },
    { label: "Snake", value: "snake" },
    { label: "Bird", value: "bird" },
    { label: "Other", value: "other" },
  ];

  const isExistingPet = pet.name != '';

  const onAddPetPress = () => {
    /**
     * This function is used to submit the pet information to the backend.
     * It will call the POST method '/insert_pet' to create a new pet.
     * Or, it will call the PUT method '/update_pet' to update an existing pet.
     */
    let url;
    let method;
    // check if this is a new pet or an existing pet
    if (isExistingPet) {
      url = `${IP}:${PORT}/update_pet`;
      method = 'PUT';
    } else {
      url = `${IP}:${PORT}/insert_pet?owner_id=${owner_id}`;
      method = 'POST';
    }

		setIsButtonDisabled(true);
		setButtonText("Adding Pet...");

		let isValid = validateDetails(formData);

		if (isValid) {
			setFormData({ ...formData, authorId: ownerId })

			fetch(url, {
				method: method,
				headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
				body: JSON.stringify(formData),
			})
				.then((res) => {
					if (res.status == 201) {
						// Show success
						// Clear fields?
						setIsCreated(true);
					}
				})
				.catch((error) => alert(error));
		};

		setButtonText("Add Pet")
		setIsButtonDisabled(false);
  }

    const validateDetails = (formData) => {
      // Validates details. If details are valid, send formData object to onAddPetPress.
      foundErrors = {};
  
      if (!formData.petName || formData.petName == "") {
        foundErrors = { ...foundErrors, petName: 'Pet name is required' }
      }  
  
      if (!formData.petBreed || formData.petBreed == "") {
        foundErrors = { ...foundErrors, petBreed: 'Pet breed is required' }
      }
  
      if (formData.petDescription.length > 500) {
        foundErrors = { ...foundErrors, petDescription: 'Must not exceed 500 characters' }
      }
  
      setErrors(foundErrors);
  
      // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
      return Object.keys(foundErrors).length === 0;
    }

    const [selectedImageOption, setSelectedImageOption] = useState('');

    const handleImageOptionChange = (value) => {
      setSelectedImageOption(value);
      if (value === 'choose') {
        handleChoosePhoto();
      } else if (value === 'take') {
        handleTakePhoto();
      }
    };

    const handleChoosePhoto = async () => {
      /**
       * This function is used to choose a photo from the user's photo library.
       * It will call the ImagePicker API to open the photo library and allow the user to choose a photo.
       * It will then set the petImage state to the chosen photo.
       */
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setPetImage(result.assets[0].uri);
        }
      }
    };  

    const handleTakePhoto = async () => {
      /**
       * This function is used to take a photo from the user's camera.
       * It will call the ImagePicker API to open the camera and allow the user to take a photo.
       * It will then set the petImage state to the taken photo.
       */
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setPetImage(result.assets[0].uri);
        }
      }
    };

    const handlePreview = () => {
      setIsPreviewExpanded(!isPreviewExpanded);
    };    
  
    const closeAlert = () => {
      setIsCreated(false);
    };
  
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
          <Box flex={1} alignItems="center" justifyContent="center">
            <Center w="100%">
              <Box safeArea p="2" py="8" w="90%" maxW="290">
    
                {isCreated ? (<AlertComponent onClose={closeAlert} />) :
                  (
                    <VStack>
                      <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a Pet</Heading>
    
                      <VStack space={3} mt="5">
    
                        <FormControl isInvalid={'petName' in errors}>
                          <FormControl.Label>Pet Name</FormControl.Label>
                          <Input onChangeText={value => setFormData({ ...formData, petName: value })} />
                          {'petName' in errors && <FormControl.ErrorMessage>{errors.petName}</FormControl.ErrorMessage>}
                        </FormControl>
    
                        <FormControl isInvalid={'petImage' in errors}>
                          <FormControl.Label>Pet Image</FormControl.Label>
                          <Select
                            placeholder="Select an option"
                            selectedValue={selectedImageOption}
                            onValueChange={handleImageOptionChange} >
                            <Select.Item label="Choose Existing Photo" value="choose" />
                            <Select.Item label="Take Photo" value="take" />
                          </Select>

                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} />}
                          </View>
                          
                          {'petImage' in errors && <FormControl.ErrorMessage>{errors.petImage}</FormControl.ErrorMessage>}
                        </FormControl>
    
                        <FormControl isInvalid={'petType' in errors}>
                          <FormControl.Label>Choose Pet Type</FormControl.Label>
                          <Select placeholder="Select a pet type"
                            selectedValue={formData.petType}
                            onValueChange={(value) => setFormData({ ...formData, petType: value })}>
                            <Select.Item label="Select a pet" value="" disabled hidden />
                            {petTypeOptions.map((option, index) => (
                              <Select.Item key={index} label={option.label} value={option.value} />
                            ))}
                          </Select>
                          {'petType' in errors && <FormControl.ErrorMessage>{errors.petType}</FormControl.ErrorMessage>}
                        </FormControl>
    
                        <FormControl isInvalid={'petBreed' in errors}>
                          <FormControl.Label>Pet breed</FormControl.Label>
                          <Input onChangeText={value => setFormData({ ...formData, petBreed: value })} placeholder="Enter pet breed" />
                          {'petBreed' in errors && <FormControl.ErrorMessage>{errors.petBreed}</FormControl.ErrorMessage>}
                        </FormControl>
    
                        <FormControl isInvalid={'petDescription' in errors}>
                          <FormControl.Label>Pet Description</FormControl.Label>
                          <Input onChangeText={value => setFormData({ ...formData, petDescription: value })} />
                          {'petDescription' in errors && <FormControl.ErrorMessage>{errors.petDescription}</FormControl.ErrorMessage>}
                        </FormControl>
    
                        <Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onAddPetPress}>
                          {buttonText}
                        </Button>
    
                      </VStack>
    
                    </VStack>
                  )}
              </Box>
            </Center>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  
  };


export default NewPetPage;
