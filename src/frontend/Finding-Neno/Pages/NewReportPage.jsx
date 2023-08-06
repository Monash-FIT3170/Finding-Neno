import { useNavigation } from '@react-navigation/native';
import { Box, Button, Center, Heading, VStack, FormControl, Input, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';


import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

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

const NewReportPage = ({ navigation: { navigate }, route }) => {
	const navigation = useNavigation();
	const { headers } = route.params;

	const ownerId = headers["userid"];
	const accessToken = headers["accesstoken"];

	const [formData, setFormData] = useState({ description: '' });
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Create report")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDatetime] = useState(new Date());
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

		console.log(selectedDatetime)
		if (!formData.lastSeenDateTime) {
			foundErrors = { ...foundErrors, lastSeenDateTime: 'Last seen date is required' }
			console.log("error 1")
			// } else if (!validDateTime(formData.lastSeenDateTime)) {
		} else if (selectedDatetime >= new Date()) {
			console.log("error 2")
			foundErrors = { ...foundErrors, lastSeenDateTime: 'Last seen date and time cannot be in the future' }
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

	const formatDatetime = (datetime) => {
		const hours = datetime.getHours().toString().padStart(2, '0');
		const minutes = datetime.getHours().toString().padStart(2, '0');
		const day = datetime.getDate().toString().padStart(2, '0');
		const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
		const year = datetime.getFullYear().toString();

		return `${hours}:${minutes} ${day}/${month}/${year}`
	}
	

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
											<Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
											<DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
												onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
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