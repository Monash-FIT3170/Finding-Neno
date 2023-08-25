import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, useToast, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { validDateTime, validateCoordinates } from "./validation"

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

import { formatDatetime } from "./shared"

const NewReportPage = ({ navigation: { navigate } }) => {
	const navigation = useNavigation();

	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [errors, setErrors] = useState({});
	const [buttonText, setButtonText] = useState("Create report")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDatetime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const toast = useToast();

	useEffect(() => {
		// Simulating asynchronous data fetching
		// ownerId = 2
		const fetchOwnerPets = async () => {
			try {
				const url = `${IP}:${PORT}/get_owner_pets?owner_id=${USER_ID}`;
				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						'Authorization': `Bearer ${ACCESS_TOKEN}`,
						'User-ID': USER_ID
					}
				});

				if (!response.ok) {
					throw new Error('Request failed with status ' + response.status);
				}
				const data = await response.json();

				const petTuples = data.map((pet) => [pet["name"], pet["id"]]);

				setDropdownOptions(petTuples)
			} catch (error) {
				console.error(error);
			}
		}

		fetchOwnerPets();
	}, []);

	const onCreateReportPress = async () => {
		setIsButtonDisabled(true);
		setButtonText("Creating report...");

		let isValid = validateDetails(formData);

		if (isValid) {
			const url = `${IP}:${PORT}/insert_missing_report`;

			await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID
				},
				body: JSON.stringify(formData),
			})
				.then((res) => {
					if (res.status == 201) {
						// Show success
						toast.show({
							description: "Your report has been added!",
							placement: "top"
						})
						navigate('Report Page');
					}
					else {
						setButtonText("Create report")
						setIsButtonDisabled(false);
					}
				})
				.catch((error) => {
					setButtonText("Create report")
					setIsButtonDisabled(false);
					alert(error)
				});
		};
	}

	const missingReportExists = async (pet_id) => {
		try {
			const petId = pet_id; // Replace with the actual pet ID you want to retrieve reports for
			const response = await fetch(`${IP}:${PORT}/get_reports_by_pet?pet_id=${petId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
					'Content-Type': 'application/json',
				},
			});
	
			if (response.ok) {
				const data = await response.json();
				console.log('Reports for pet:', data);

				outcome = data[0]
	
				if (outcome === null) {
					console.log('Pet Report doesnt exist');
					return false;
				} else {
					console.log('Pet Report does exist');
					return true;
				}
			} else {
				console.log('Error while fetching reports:', response.statusText);
			}
		} catch (error) {
			console.error('An error occurred:', error);
			return false; // Handle error case
		}
	};
	

	const validateDetails = async (formData) => {
		// Validates details. If details are valid, send formData object to onCreateReportPress.
		foundErrors = {};

		if (!formData.missingPetId || formData.missingPetId == "") {
			foundErrors = { ...foundErrors, missingPetId: 'Please select a pet' }
		}

		if (!formData.lastLocation || formData.lastLocation == "") {
			foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
		} else if (!validateCoordinates(formData.lastLocation)) {
			foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
		}

		if (formData.description.length > 500) {
			foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
		}

		const exists = await missingReportExists(formData.missingPetId);
		console.log("does the pet report exists " + exists)

		if(exists){
			console.log("pet report exists")
			foundErrors = { ...foundErrors, missingPetId: 'Pet Report already exists' }
			console.log(Object.keys(foundErrors).length)
		}

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

	var maximumDate;
	const openPicker = () => {
		maximumDate = new Date();
		setShowPicker(true);
	}

	const handleDatetimeConfirm = (datetime) => {
		setSelectedDatetime(datetime);
		setFormData({ ...formData, lastSeenDateTime: formatDatetime(datetime) });
		closePicker();
	}

	const closePicker = () => {
		setShowPicker(false);
	}

	// default form values
	const [formData, setFormData] = useState({
		authorId: USER_ID,
		description: '',
		lastSeenDateTime: formatDatetime(selectedDatetime),
		dateTimeOfCreation: formatDatetime(new Date())
	});

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<Box flex={1} alignItems="center" justifyContent="center">
				<Center w="100%">
					<Box safeArea p="2" py="8" w="90%" maxW="290">
						<VStack>
							<Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Create a Report</Heading>

							<VStack space={3} mt="5">

								<FormControl isInvalid={'missingPetId' in errors}>
									<FormControl.Label>Choose Pet</FormControl.Label>
									<Select placeholder="Select a pet"
										selectedValue={formData.missingPetId}
										onValueChange={(value) => setFormData({ ...formData, missingPetId: value })}>
										<Select.Item label="Select a pet" value="" disabled hidden />
										{dropdownOptions.map((option, index) => (
											<Select.Item key={index} label={option[0]} value={option[1]} />
										))}
									</Select>
									{'missingPetId' in errors && <FormControl.ErrorMessage>{errors.missingPetId}</FormControl.ErrorMessage>}
								</FormControl>

								<FormControl>
									<FormControl.Label>Last Seen</FormControl.Label>
									<Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
									<DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
										onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
								</FormControl>

								<FormControl isInvalid={'lastLocation' in errors}>
									<FormControl.Label>Last Known Location</FormControl.Label>
									<Input onChangeText={value => setFormData({ ...formData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
									{'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
								</FormControl>

								<FormControl isInvalid={'description' in errors}>
									<FormControl.Label>Additional Info</FormControl.Label>
									<Input onChangeText={value => setFormData({ ...formData, description: value })} />
									{'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>}
								</FormControl>

								<Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onCreateReportPress}>
									{buttonText}
								</Button>

							</VStack>
						</VStack>
					</Box>
				</Center>
			</Box>
		</KeyboardAvoidingView>
	);
};

export default NewReportPage;