import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, useToast, FormControl, Input, Select, Alert, Text, KeyboardAvoidingView, WarningOutlineIcon } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import React, { useEffect, useState, useRef } from 'react';
import { Color } from "../components/atomic/Theme";
import { Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Subheading } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from "react-redux";

import { formatDateTimeDisplay, formatDatetime } from "./shared";

import MapAddressSearch from "../components/MapAddressSearch";
import { SafeAreaView } from 'react-native-safe-area-context';

const NewReportPage = ({ navigation: { navigate } }) => {
	const navigation = useNavigation();

	const { API_URL } = useSelector((state) => state.api)
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
				const url = `${API_URL}/get_owner_pets?owner_id=${USER_ID}`;
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

		let isValid = await validateDetails(formData);

		if (isValid) {
			const url = `${API_URL}/insert_missing_report`;

			const missingReport = {
				authorId: USER_ID,
				missingPetId: formData.missingPetId,
				description: formData.description,
				lastSeenDateTime: formatDatetime(selectedDatetime),
				dateTimeOfCreation: formatDatetime(new Date()),
				lastLocation: formData.lastLocation,
			}

			await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID
				},
				body: JSON.stringify(missingReport),
			})
				.then((res) => {
					if (res.status == 201) {
						// Show success
						toast.show({
							description: "Your report has been added!",
							placement: "top"
						})

						// Pop to previous screen
						navigation.goBack();
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
		}
		else {
			setButtonText("Create report")
			setIsButtonDisabled(false);
		}
	}

	const validateDetails = async (formData) => {
		// Validates details. If details are valid, send formData object to onCreateReportPress.
		foundErrors = {};

		if (!formData.missingPetId || formData.missingPetId == "") {
			foundErrors = { ...foundErrors, missingPetId: 'Please select a pet' }
		}
		else {
			if (exists) {
				foundErrors = { ...foundErrors, missingPetId: 'Pet Report already exists' }
			}
		}

		if (formData.description.length > 500) {
			foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
		}

		const exists = await missingReportExists(formData.missingPetId);


		setErrors(foundErrors);
		console.log(foundErrors)

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		console.log(Object.keys(foundErrors).length === 0)
		return Object.keys(foundErrors).length === 0;
	}

	const missingReportExists = async (pet_id) => {
		try {
			const petId = pet_id; // Replace with the actual pet ID you want to retrieve reports for
			const response = await fetch(`${API_URL}/get_reports_by_pet?pet_id=${petId}`, {
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
		console.log(selectedDatetime)
		setShowPicker(false);
	}

	// default form values
	const [formData, setFormData] = useState({
		authorId: USER_ID,
		description: '',
		lastSeenDateTime: formatDatetime(selectedDatetime),
	});

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50, backgroundColor: 'white'}}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true} enableAutomaticScroll={true} extraScrollHeight={30}>
			<StatusBar style="auto" />
			<SafeAreaView style={{ flex: 1, marginHorizontal: "10%" }}>
				<VStack>
					<Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Report Your Missing Pet</Heading>
					<Subheading>Lost your pet? Report your missing pet here so others can help</Subheading>

					<VStack space={3} mt="5">

						<FormControl isRequired isInvalid={'missingPetId' in errors}>
							<FormControl.Label>Your Pet</FormControl.Label>
							<Select size="lg" placeholder="Select a pet"
								selectedValue={formData.missingPetId}
								onValueChange={(value) => setFormData({ ...formData, missingPetId: value })}>
								<Select.Item label="Select a pet" value="" disabled hidden />
								{dropdownOptions.map((option, index) => (
									<Select.Item key={index} label={option[0]} value={option[1]} />
								))}
							</Select>
							{'missingPetId' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.missingPetId}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired>
							<FormControl.Label>Last Seen Date and Time</FormControl.Label>
							<Button buttonColor={Color.NENO_BLUE} mode="contained" onPress={openPicker}>{formatDateTimeDisplay(selectedDatetime)}</Button>
							<DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" maximumDate={new Date()} themeVariant="light" display="inline"
								onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
						</FormControl>

						<FormControl isRequired>
							<FormControl.Label>Last Known Location</FormControl.Label>
							<MapAddressSearch formData={formData} setFormData={setFormData} />
							{<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>No address found.</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isInvalid={'description' in errors}>
							<FormControl.Label>Description</FormControl.Label>
							<Input size="lg" placeholder='Additional info' onChangeText={value => setFormData({ ...formData, description: value })} />
							{'description' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.description}</FormControl.ErrorMessage>}
						</FormControl>

                        <Button buttonColor={Color.NENO_BLUE} mode="contained" disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onCreateReportPress}>
                            {buttonText}
                        </Button>

					</VStack>
				</VStack>
			</SafeAreaView>
		</KeyboardAwareScrollView>
	);
};

export default NewReportPage;