import { useNavigation } from '@react-navigation/native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, ScrollView, Alert, Text, KeyboardAvoidingView } from "native-base";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

const NewSightingPage = ({navigation: {navigate}, route }) => {

    const navigation = useNavigation();
    const { headers } = route.params;
    const authorId = headers["userid"];
	const accessToken = headers["accesstoken"];

    // default form values
    const [formData, setFormData] = useState({ 
        missing_report_id: null,
        authorId: authorId, 
        animal: 'dog',
        breed: null,
        image_url: null,
        description: ''
    });
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Add sighting")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState("dog");
    const [image, setImage] = useState(null);
    const toast = useToast();

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
            setImage(result.assets[0].uri.toString());
          }
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
            setImage(result.assets[0].uri.toString());
          }
        }
    };

    const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onCreateReportPress.
		foundErrors = {};

		if (!formData.dateTime) {
			foundErrors = { ...foundErrors, dateTime: 'Last seen date and time is required' }
			
		} else if (selectedDatetime >= new Date()) {
			foundErrors = { ...foundErrors, dateTime: 'Last seen date cannot be in the future' }
		}

		if (!formData.lastLocation || formData.lastLocation == "") {
			foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
		} else if (!validateCoordinates(formData.lastLocation)) {
			foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
		}

		if (formData.description.length > 500) {
			foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
		}

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

    const onPress = () => {
        setIsButtonDisabled(true);
        setButtonText("Adding sighting...");

        let isValid = validateDetails(formData);
        
        if (isValid) {
            setFormData({ ...formData, missing_report_id: null, authorId: authorId, animal: selectedAnimal, image_url: image});

            const url = `${IP}:${PORT}/insert_new_sighting`;

            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })
            .then((res) => {
                if (res.status == 201) {
                    setIsCreated(true);
                    toast.show({
                        description: "Your sighting has been added!",
                        placement: "top"
                      })
                    navigate('Sightings Page')
                }
            })
            .catch((error) => alert(error));
        };
        setButtonText("Add sighting");
		setIsButtonDisabled(false);
    }

    return (
        <ScrollView>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<Box flex={1} alignItems="center" justifyContent="center">
				<Center w="100%">
					<Box safeArea p="2" py="8" w="90%" maxW="290">
                        <VStack>
                            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a New Sighting</Heading>

                            <VStack space={3} mt="5">
                            <FormControl.Label>Photo</FormControl.Label>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt='pet sighting image'/>}
                            </View>

                            <Button variant="ghost" onPress={handleChoosePhoto}>
                                Choose From Library
                            </Button>
                            <Button variant="ghost" onPress={handleTakePhoto}>
                                Take Photo
                            </Button>
                                    <FormControl.Label>Pet type</FormControl.Label>
                                    <View >
                                    <Picker selectedValue={selectedAnimal} onValueChange={(itemValue, itemIndex) => setSelectedAnimal(itemValue)}>
                                        <Picker.Item label="Dog" value="dog" />
                                        <Picker.Item label="Cat" value="cat" />
                                        <Picker.Item label="Rabbit" value="rabbit" />
                                        <Picker.Item label="Mouse" value="mouse" />
                                        <Picker.Item label="Snake" value="snake" />
                                        <Picker.Item label="Bird" value="bird" />
                                        <Picker.Item label="Other" value="other" />
                                    </Picker>
                                    </View>

                                <FormControl>
                                    <FormControl.Label>Breed</FormControl.Label>
                                    <Input 
                                        placeholder="Pet breed"
                                        onChangeText={value => setFormData({ ...formData, breed: value })}
                                    />
                                </FormControl>

                                <FormControl isInvalid={'dateTime' in errors}>
                                    {/* TODO: Date picker here?? */}
                                    <FormControl.Label>Time of Sighting</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, dateTime: value })} placeholder="HH:MM dd/mm/yy" />
                                    {'dateTime' in errors && <FormControl.ErrorMessage>{errors.dateTime}</FormControl.ErrorMessage>}
                                </FormControl>

                                <FormControl isInvalid={'lastLocation' in errors}>
                                    <FormControl.Label>Location of Sighting</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
                                    {'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
                                </FormControl>

                                <FormControl isInvalid={'description' in errors}>
                                    <FormControl.Label>Description (Additional Info)</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, description: value })} />
                                    {'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>}
                                </FormControl>

                                <Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onPress}>
                                    {buttonText}
                                </Button>

                            </VStack>
                        </VStack>
					</Box>
				</Center>
			</Box>
		</KeyboardAvoidingView>
        </ScrollView>
    );

}

export default NewSightingPage;