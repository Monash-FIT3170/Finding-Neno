import { useNavigation } from '@react-navigation/native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView, FlatList } from "native-base";
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { validDateTime, validateCoordinates } from "./validation"

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

import { formatDatetime, petTypeOptions } from "./shared";

const NewSightingPage = ({ navigation: { navigate } }) => {
    const { IP, PORT } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const navigation = useNavigation();

    const [errors, setErrors] = useState({});
    const [buttonText, setButtonText] = useState("Add sighting")
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [selectedDatetime, setSelectedDatetime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [image, setImage] = useState(null);
    const toast = useToast();

    // default form values
    const [formData, setFormData] = useState({
        authorId: USER_ID,
        missingReportId: null,
        breed: '',
        imageUrl: '',
        dateTime: formatDatetime(selectedDatetime),
        dateTimeOfCreation: formatDatetime(new Date()),
        description: ''
    });
    const [sightingImage, setSightingImage] = useState(null);



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
                base64: true,
            });
            if (!result.canceled) {
                // Upload to Imgur
                let base64Img = result.assets[0].base64;
                uploadImage(base64Img, setSightingImage);
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
				base64: true,
            });
			if (!result.canceled) {
				if (result.assets[0].uri.startsWith("http")) {
					// Image is a URL, so leave it as is
					setSightingImage(result.assets[0].uri);
				} else {
					// Image is a local file path, so upload to Imgur
					let base64Img = result.assets[0].base64;
					uploadImage(base64Img, setSightingImage);
				}
			}
        }
    };

    const validateDetails = (formData) => {
        // Validates details. If details are valid, send formData object to onCreateReportPress.
        foundErrors = {};

        if (!formData.lastLocation || formData.lastLocation == "") {
            foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
        } else if (!validateCoordinates(formData.lastLocation)) {
            foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
        }

        if (!formData.animal || formData.animal == "") {
            foundErrors = { ...foundErrors, animal: 'Please select a pet type' }
        }

        if (formData.description.length > 500) {
            foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
        }

        setErrors(foundErrors);

        // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
        return Object.keys(foundErrors).length === 0;
    }

	const uploadImage = async (base64Img, setSightingImage) => {
        setIsButtonDisabled(true);
        console.log("button disabled")
		// Uploads an image to Imgur and sets the petImage state to the uploaded image URL
		const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";
		const LOADING_IMAGE = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRwMHI0cmlnOGU3Mm4xbzZwcTJwY2Nrb2hlZ3YwNmtleHo4Zm15MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L05HgB2h6qICDs5Sms/giphy.gif";

		// Set loading image while the chosen image is being uploaded
		setSightingImage(LOADING_IMAGE);

		const formData = new FormData();
		formData.append("image", base64Img);

		await fetch("https://api.imgur.com/3/image", {
			method: "POST",
			headers: {
				"Authorization": "Client-ID 736cd8c6daf1a6e",
			},
			body: formData,
		})
			.then(res => res.json())
			.then(res => {
				if (res.success === true) {
					console.log(`Image successfully uploaded: ${res.data.link}}`);
					setSightingImage(res.data.link);
                    console.log("image set")
                    setIsButtonDisabled(false);
				} else {
					console.log("Image failed to upload - setting default image");
					setSightingImage(DEFAULT_IMAGE);
				}
			})
			.catch(err => {
				console.log("Image failed to upload:", err);
				setSightingImage(DEFAULT_IMAGE);
			});

        setIsButtonDisabled(false);
	}

    const onPress = async () => {
        setIsButtonDisabled(true);
        setButtonText("Adding sighting...");

        let isValid = validateDetails(formData);

        if (isValid) {
            setFormData({ ...formData, imageUrl: sightingImage.toString(), animal: selectedAnimal });

            const url = `${IP}:${PORT}/insert_sighting`;

            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID
                },
                body: JSON.stringify(formData),
            })
                .then((res) => {
                    if (res.status == 201) {
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

    // Date picker
    var maximumDate;
    const openPicker = () => {
        maximumDate = new Date();
        setShowPicker(true);
    }

    const handleDatetimeConfirm = (datetime) => {
        setSelectedDatetime(datetime);
        setFormData({ ...formData, dateTime: formatDatetime(datetime) });
        closePicker();
    }

    const closePicker = () => {
        setShowPicker(false);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            <FlatList
                data={[{ key: 'form' }]} // Use a single item array as data source
                renderItem={() => (
                    <Box flex={1} alignItems="center" justifyContent="center">
                        <Center w="100%">
                            <Box safeArea p="2" py="8" w="90%" maxW="290">
                                <VStack>
                                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a New Sighting</Heading>

                                    <VStack space={3} mt="5">
                                        <FormControl.Label>Photo</FormControl.Label>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            {sightingImage && <Image source={{ uri: sightingImage }} style={{ width: 200, height: 200 }} alt='pet sighting image' />}
                                        </View>
                                        <Button variant="ghost" onPress={handleChoosePhoto}>
                                            Choose From Library
                                        </Button>
                                        <Button variant="ghost" onPress={handleTakePhoto}>
                                            Take Photo
                                        </Button>

                                        <FormControl isInvalid={'petType' in errors}>
                                            <FormControl.Label>Choose Pet Type</FormControl.Label>
                                            <Select placeholder="Select a pet type"
                                                selectedValue={formData.petType}
                                                onValueChange={(value) => setFormData({ ...formData, animal: value })}>
                                                <Select.Item label="Select a pet" value="" disabled hidden />
                                                {petTypeOptions.map((option, index) => (
                                                    <Select.Item key={index} label={option.label} value={option.value} />
                                                ))}
                                            </Select>
                                            {'petType' in errors && <FormControl.ErrorMessage>{errors.petType}</FormControl.ErrorMessage>}
                                        </FormControl>

                                        <FormControl>
                                            <FormControl.Label>Breed</FormControl.Label>
                                            <Input
                                                placeholder="Pet breed"
                                                onChangeText={value => setFormData({ ...formData, breed: value })}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormControl.Label>Date and Time of Sighting</FormControl.Label>
                                            <Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
                                            <DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
                                                onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
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
                )}
            />
        </KeyboardAvoidingView>
    );

}

export default NewSightingPage;