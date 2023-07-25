import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-datepicker'


import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

import store from '../store/store';

const AlertComponent = ({ onClose }) => (
	<Alert w="100%" status="success">
		<VStack space={1} flexShrink={1} w="100%" alignItems="center">
			<Alert.Icon size="md" />
			<Text fontSize="md" fontWeight="medium" _dark={{ color: "coolGray.800" }}>
				Your report has been created!
			</Text>
			<Button mt="2" bgColor={Color.NENO_BLUE} onPress={onClose}>
				Close
			</Button>
		</VStack>
	</Alert>
);

const NewReportPage = ({ navigation: { navigate } }) => {
	const navigation = useNavigation();

    const ownerId = store.getState().userId;
    const accessToken = store.getState().accessToken;

	const [formData, setFormData] = useState({ description: '' });
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Create report")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	useEffect(() => {
		// Simulating asynchronous data fetching
		// ownerId = 2
		const fetchOwnerPets = async () => {
			try {
				const url = `${IP}:${PORT}/get_owner_pets/${ownerId}`;
				const response = await fetch(url, {
					headers: {
						method: "GET",
						'Authorization': `Bearer ${accessToken}`
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

	const onCreateReportPress = () => {
		setIsButtonDisabled(true);
		setButtonText("Creating report...");

		let isValid = validateDetails(formData);

		if (isValid) {
			setFormData({ ...formData, authorId: ownerId })
			const url = `${IP}:${PORT}/insert_missing_report`;

			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
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

		setButtonText("Create report")
		setIsButtonDisabled(false);
	}

	const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onCreateReportPress.
		foundErrors = {};

		if (!formData.missingPetId || formData.missingPetId == "") {
			foundErrors = { ...foundErrors, missingPetId: 'Please select a pet' }
		}

		console.log(selectedDatetime >= new Date())
		if (!formData.lastSeenDateTime) {
			foundErrors = { ...foundErrors, lastSeenDateTime: 'Last seen date is required' }
			// } else if (!validDateTime(formData.lastSeenDateTime)) {
		} else if (selectedDatetime >= new Date()) {
			foundErrors = { ...foundErrors, lastSeenDateTime: 'Last seen date cannot be in the future' }
		}
		// formData.lastSeenDateTime = formatDatetimeString(formData.lastSeenDateTime)

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

	const closeAlert = () => {
		setIsCreated(false);
	};

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<Box flex={1} alignItems="center" justifyContent="center">
				<Center w="100%">
					<Box safeArea p="2" py="8" w="90%" maxW="290">

						{isCreated ? (<AlertComponent onClose={closeAlert} />) :
							(
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

										<FormControl isInvalid={'lastSeenDateTime' in errors}>
											<FormControl.Label>Last Seen</FormControl.Label>
											<Input onChangeText={value => setFormData({ ...formData, lastSeenDateTime: value })} placeholder="HH:MM dd/mm/yy" />
											{'lastSeenDateTime' in errors && <FormControl.ErrorMessage>{errors.lastSeenDateTime}</FormControl.ErrorMessage>}
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
							)}
					</Box>
				</Center>
			</Box>
		</KeyboardAvoidingView>
	);
};

export default NewReportPage;