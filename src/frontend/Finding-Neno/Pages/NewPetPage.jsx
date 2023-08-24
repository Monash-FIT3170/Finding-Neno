import React, { useState } from 'react';
import { Box, Center, Heading, VStack, useToast, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import { View, Image, FlatList } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
<<<<<<< HEAD
import store from '../store/store';


export default function NewPetPage() {
    /**
     * This page is used to create a new pet or edit an existing pet.
     * It takes in the pet object as a parameter, if the pet object is empty, it will create a new pet.
     * Otherwise, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
     * 
     */


    const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const pet = useSelector((state) => state.pet);
   
    
    //if the pet name is empty then it is a new pet, otherwise it is an existing pet
    const isExistingPet = pet.name != '';

    const [petName, setPetName] = useState(pet ? pet.name : '');
    const [petImage, setPetImage] = useState(pet ? pet.image_url : null);
    const [petType, setPetType] = useState(pet ? pet.animal : '');
    const [petBreed, setPetBreed] = useState(pet ? pet.breed : '');
    const [petDescription, setPetDescription] = useState(pet ? pet.description : '');
    const [modalVisible, setModalVisible] = useState(false);

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
=======
import store from "../store/store";

import { formatDatetime, petTypeOptions } from "./shared";

const NewPetPage = ({ navigation: { navigate }, route }) => {
	/**
	   * This page is used to create a new pet or edit an existing pet.
	   * It takes in the pet object as a parameter, if the pet object is empty, it will create a new pet.
	   * Otherwise, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
	   * 
	   */

	const navigation = useNavigation();
	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
	const pet = useSelector((state) => state.pet);

	const [formData, setFormData] = useState({ petDescription: '' });
	const [errors, setErrors] = useState({});
	const [buttonText, setButtonText] = useState("Add Pet")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const toast = useToast();
    const [isUploading, setIsUploading] = useState(false);

	//if the pet name is empty then it is a new pet, otherwise it is an existing pet
	const isExistingPet = pet.name != '';

	const [petName, setPetName] = useState(pet ? pet.name : null);
	const [petImage, setPetImage] = useState(pet ? pet.image_url : null);
	const [petType, setPetType] = useState(pet ? pet.animal : '');
	const [petBreed, setPetBreed] = useState(pet ? pet.breed : '');
	const [petDescription, setPetDescription] = useState(pet ? pet.description : '');

	const onAddPetPress = () => {
		setIsButtonDisabled(true);
		setButtonText("Adding Pet...");
		/**
		 * This function is used to submit the pet information to the backend.
		 * It will call the POST method '/insert_pet' to create a new pet.
		 * Or, it will call the PUT method '/update_pet' to update an existing pet.
		 */
		let url;
		let method;
		// check if this is a new pet or an existing pet
		if (isExistingPet) {
			url = `${IP}:${PORT}/update_pet/pet_id=`;
			method = 'PUT';
		} else {
			url = `${IP}:${PORT}/insert_pet?owner_id=${USER_ID}`;
			method = 'POST';
		}


		let isValid = validateDetails(formData);

		if (isValid) {
			// create the pet object
			const pet = {
				name: formData.petName,
				animal: formData.petType,
				breed: formData.petBreed,
				description: formData.petDescription,
				image_url: petImage.toString(),
				owner_id: USER_ID
			};

			// call the backend API
			fetch(url, {
				method: method,
				headers: {
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
					'User-ID': USER_ID
				},
				body: JSON.stringify(pet),
			})
				.then((res) => {
					if (res.status == 201) {
						// Show success
						// Clear fields?

						toast.show({
							description: "Your pet has been added!",
							placement: "top"
						})
						navigate('Profile Page')
					}
					else {
						setButtonText("Add Pet")
						setIsButtonDisabled(false);
						alert("Error");
					}
				})
				.catch((error) => {
					setIsButtonDisabled(false);
					alert("Error");
					alert(error);
				});
		};
	}

	const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onAddPetPress.
		foundErrors = {};

		if (!formData.petName || formData.petName == "") {
			foundErrors = { ...foundErrors, petName: 'Pet name is required' }
		}

		if (!formData.petType || formData.petType == "") {
			foundErrors = { ...foundErrors, petType: 'Please select a pet type' }
		}

		if (!formData.petBreed || formData.petBreed == "") {
			foundErrors = { ...foundErrors, petBreed: 'Pet breed is required' }
		}

		if (formData.petDescription.length > 500) {
			foundErrors = { ...foundErrors, petDescription: 'Must not exceed 500 characters' }
		}
>>>>>>> demo

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

	const uploadImage = async (base64Img, setPetImage) => {
        setIsButtonDisabled(true);
        setIsUploading(true);
		// Uploads an image to Imgur and sets the petImage state to the uploaded image URL
		const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";

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
					setPetImage(res.data.link);
				} else {
                    toast.show({
                        description: "Image failed to upload. Please try again.",
                        placement: "top"
                    })
                    console.log("Image failed to upload")
					// console.log("Image failed to upload - setting default image");
					// setPetImage(DEFAULT_IMAGE);
				}
			})
			.catch(err => {
                toast.show({
                    description: "Image failed to upload. Please try again.",
                    placement: "top"
                })
				console.log("Image failed to upload:", err);
				// setPetImage(DEFAULT_IMAGE);
			});

		setIsUploading(false);
		setIsButtonDisabled(false);
	}

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
					setPetImage(result.assets[0].uri);
				} else {
					// Image is a local file path, so upload to Imgur
					let base64Img = result.assets[0].base64;
					uploadImage(base64Img, setPetImage);
				}
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
			base64: true,
          });
          if (!result.canceled) {
            // Upload to Imgur
            let base64Img = result.assets[0].base64;
            uploadImage(base64Img, setPetImage);
          }
        }
      };

	  
	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
			<FlatList
				data={[{ key: 'form' }]} // Use a single item array as data source
				renderItem={() => (
					<Box flex={1} alignItems="center" justifyContent="center">
						<Center w="100%">
							<Box safeArea p="2" py="8" w="90%" maxW="290">

								<VStack>
									<Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a Pet</Heading>

									<VStack space={3} mt="5">

										<FormControl isInvalid={'petName' in errors}>
											<FormControl.Label>Pet Name</FormControl.Label>
											<Input onChangeText={value => setFormData({ ...formData, petName: value })} />
											{'petName' in errors && <FormControl.ErrorMessage>{errors.petName}</FormControl.ErrorMessage>}
										</FormControl>

										<FormControl isInvalid={'petImage' in errors}>
                                        	<FormControl.Label>Photo</FormControl.Label>
											<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
												{
													isUploading ? <ActivityIndicator /> :
													petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} alt='pet image' />
												}
											</View>
											<Button variant="ghost" onPress={handleChoosePhoto}>
												Choose From Library
											</Button>
											<Button variant="ghost" onPress={handleTakePhoto}>
												Take Photo
											</Button>

										
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
											<FormControl.Label>Pet Breed</FormControl.Label>
											<Input onChangeText={value => setFormData({ ...formData, petBreed: value })} placeholder="Enter pet breed" />
											{'petBreed' in errors && <FormControl.ErrorMessage>{errors.petBreed}</FormControl.ErrorMessage>}
										</FormControl>

										<FormControl isInvalid={'petDescription' in errors}>
											<FormControl.Label>Pet Description</FormControl.Label>
											<Input onChangeText={value => setFormData({ ...formData, petDescription: value })} placeholder="Please describe more about your pet"/>
											{'petDescription' in errors && <FormControl.ErrorMessage>{errors.petDescription}</FormControl.ErrorMessage>}
										</FormControl>

										<Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onAddPetPress}>
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

};

export default NewPetPage;
