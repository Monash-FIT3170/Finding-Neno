import React, { useState } from 'react';
import { Box, Center, Heading, VStack, useToast, FormControl, Input, Select, Alert, Text, KeyboardAvoidingView, WarningOutlineIcon } from "native-base";
import { Color } from "../components/atomic/Theme";
import { useNavigation, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';

import { useSelector, useDispatch } from "react-redux";

import { formatDatetime, petTypeOptions } from "./shared";
import ImageHandler from '../components/Shared/ImageHandler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView, useColorScheme } from 'react-native';

const NewPetPage = ({ navigation: { navigate }, route }) => {
	/**
	   * This page is used to create a new pet or edit an existing pet.
	   * It takes in the pet object as a parameter, if the pet object is empty, it will create a new pet.
	   * Otherwise, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
	   * 
	   */

	const navigation = useNavigation();
	const scheme = useColorScheme();
	const { colors } = useTheme();
	const { API_URL } = useSelector((state) => state.api)
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

	const LOADING_IMAGE = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRwMHI0cmlnOGU3Mm4xbzZwcTJwY2Nrb2hlZ3YwNmtleHo4Zm15MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L05HgB2h6qICDs5Sms/giphy.gif";

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
			url = `${API_URL}/update_pet/pet_id=`;
			method = 'PUT';
		} else {
			url = `${API_URL}/insert_pet?owner_id=${USER_ID}`;
			method = 'POST';
		}


		let isValid = validateDetails(formData);

		if (isValid) {
			setIsButtonDisabled(true);
			setButtonText("Adding Pet...");
			
			// create the pet object
			const pet = {
				name: formData.petName,
				animal: formData.petType,
				breed: formData.petBreed,
				description: formData.petDescription,
				image_url: petImage.toString(),
				owner_id: USER_ID
			};
			
			console.log(pet)

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
							title: "Pet Added",
							description: "Your pet has been added!",
							placement: "top",
							alignItems: "center"
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
					setButtonText("Add Pet")
					setIsButtonDisabled(false);
					alert("Error");
					alert(error);
				});
		}
		else {
			setButtonText("Add Pet")
			setIsButtonDisabled(false);
		}
	}

	const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onAddPetPress.
		const foundErrors = {};
	  
		if (!formData.petName || formData.petName === "") {
		  foundErrors.petName = "Pet name is required";
		} else if (formData.petName.length > 25) {
			foundErrors.petName = "Must not exceed 25 characters";
		}
	  
		if (!formData.petType || formData.petType === "") {
		  foundErrors.petType = "Please select a pet type";
		}
	  
		if (!formData.petBreed || formData.petBreed === "") {
		  foundErrors.petBreed = "Pet breed is required";
		} else if (formData.petBreed.length > 25) {
			foundErrors.petBreed = "Must not exceed 25 characters";
		}

		if (formData.petDescription === "") {
			foundErrors.petDescription = "Pet description is required";	
		}

		if (formData.petDescription.length > 500) {
		  foundErrors.petDescription = "Must not exceed 500 characters";
		}
	  
		// Check that image is not the LOADING_IMAGE and not empty
		if (petImage === LOADING_IMAGE || !petImage) {
		  foundErrors.petImage = "Please make sure a photo has been loaded";
		}
	  
		setErrors(foundErrors);
	  
		// Return true if no errors (foundErrors is empty), false if errors found
		return Object.keys(foundErrors).length === 0;
	};

	  
	return (
		<KeyboardAwareScrollView contentContainerStyle={{paddingVertical: 50}}>
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%'}}>
				<VStack width={300} justifyContent='center'>
					<Heading size="lg" fontWeight="600" color={colors.primary}>Add a Pet</Heading>

					<VStack space={3} mt="5">

						<FormControl isInvalid={'petName' in errors} isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Name</Text></FormControl.Label>
							<Input _input={{selectionColor: colors.primary}} color={colors.text} size="lg" placeholder='Enter the name of your pet' onChangeText={value => setFormData({ ...formData, petName: value.trim() })} />
							{'petName' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.petName}</FormControl.ErrorMessage>}
						</FormControl>
						
						<ImageHandler image={petImage} setImage={setPetImage} setIsButtonDisabled={setIsButtonDisabled} isRequired={true} error={'petImage' in errors} />

						<FormControl isInvalid={'petType' in errors} isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Type</Text></FormControl.Label>
							<Dropdown data={petTypeOptions} placeholder='Select a pet type' 
								style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 4}}
								placeholderStyle={{color: 'darkgray', marginHorizontal: 13}}
								itemTextStyle={{color: colors.text}}
								itemContainerStyle={{backgroundColor: colors.background}}
								containerStyle={{backgroundColor: colors.background}}
								selectedTextStyle={{color: colors.text, marginHorizontal: 13}}
								iconStyle={{marginRight: 10}}
								activeColor={ scheme === 'dark' ? '#313338' : '#dbdbdb' }
								onChange={(item) => setFormData({ ...formData, petType: item.value })}
								labelField='label' valueField='value'
							/>
							{'petType' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.petType}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isInvalid={'petBreed' in errors} isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Breed</Text></FormControl.Label>
							<Input _input={{selectionColor: colors.primary}} color={colors.text} size="lg" onChangeText={value => setFormData({ ...formData, petBreed: value.trim() })} placeholder="Enter pet breed" />
							{'petBreed' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.petBreed}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isInvalid={'petDescription' in errors} isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Description</Text></FormControl.Label>
							<Input _input={{selectionColor: colors.primary}} multiline={true} color={colors.text} size="lg"
								onChangeText={(value) => setFormData({ ...formData, petDescription: value.trim() })}
								placeholder="Please describe more about your pet"
							/>
							{'petDescription' in errors && (
								<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.petDescription}</FormControl.ErrorMessage>
							)}
						</FormControl>

                        <Button buttonColor={Color.NENO_BLUE} style={{opacity: !isButtonDisabled ? 1 : 0.4}} mode="contained" onPress={!isButtonDisabled ? onAddPetPress : () => {}}>
                            {buttonText}
                        </Button>

					</VStack>
                </VStack>
            </SafeAreaView>
        </KeyboardAwareScrollView>
	);

};

export default NewPetPage;
