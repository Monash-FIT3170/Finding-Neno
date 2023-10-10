import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { Box, Center, Select, Heading, VStack, useToast, FormControl, Input, Alert, Text, KeyboardAvoidingView, WarningOutlineIcon, View } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import React, { useEffect, useState, useRef } from 'react';
import { Color } from "../components/atomic/Theme";
import { Button, Subheading } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector, useDispatch } from "react-redux";

import { formatDateTimeDisplay, formatDatetime, petTypeOptions } from "./shared";

import MapAddressSearch from "../components/MapAddressSearch";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { useColorScheme } from 'react-native';

const NewReportPage = ({ navigation: { navigate } }) => {
	const navigation = useNavigation();

	const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const [errors, setErrors] = useState({});
	const [buttonText, setButtonText] = useState("Create Report")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDatetime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const toast = useToast();
	const scheme = useColorScheme();
	const { colors } = useTheme();
	const isFocused = useIsFocused();


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

				const petOptions = data.map((pet) => ({ label: pet["name"], value: pet["id"] }));
				
				setDropdownOptions(petOptions)
			} catch (error) {
				console.error(error);
			}
		}

		fetchOwnerPets();
	}, [isFocused]);

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
				lastSeenDateTime: selectedDatetime,
				dateTimeOfCreation: new Date(),
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
							title: "Report Added",
							description: "Your report has been added!",
							placement: "top",
							alignItems: "center"
						})

						// Pop to previous screen
						navigation.goBack();
					}
					else {
						setButtonText("Create Report")
						setIsButtonDisabled(false);
					}
				})
				.catch((error) => {
					setButtonText("Create Report")
					setIsButtonDisabled(false);
					alert(error)
				});
		}
		else {
			setButtonText("Create Report")
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
		setFormData({ ...formData, lastSeenDateTime: datetime });
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
		lastSeenDateTime: selectedDatetime,
	});

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownOptions, setDropdownOptions] = useState(petTypeOptions);
	const [value, setValue] = useState();

	return (
		<KeyboardAwareScrollView contentContainerStyle={{paddingVertical: 20}}>
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%'}}>
				<VStack width={300} justifyContent='center'>
					<Heading size="lg" fontWeight="600" color={colors.primary}>Report Your Missing Pet</Heading>
					<Subheading style={{color: colors.text}}>Lost your pet? Report your missing pet here so others can help</Subheading>

					<VStack space={3} mt="5">

						<FormControl isRequired isInvalid={'missingPetId' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Your Pet</Text></FormControl.Label>
							<Dropdown data={dropdownOptions} placeholder='Select a pet' 
								style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 4}}
								placeholderStyle={{color: 'darkgray', marginHorizontal: 13}}
								itemTextStyle={{color: colors.text}}
								itemContainerStyle={{backgroundColor: colors.background}}
								containerStyle={{backgroundColor: colors.background}}
								selectedTextStyle={{color: colors.text, marginHorizontal: 13}}
								iconStyle={{marginRight: 10}}
								activeColor={ scheme === 'dark' ? '#313338' : '#dbdbdb' }
								onChange={(item) => setFormData({ ...formData, missingPetId: item.value })}
								labelField='label' valueField='value'
							/>

							{'missingPetId' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.missingPetId}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Last Seen Date and Time</Text></FormControl.Label>
							<Button style={{ marginTop: 5, borderColor: Color.NENO_BLUE}} mode="outlined" textColor={Color.NENO_BLUE} onPress={openPicker}>{formatDateTimeDisplay(selectedDatetime)}</Button>
							<DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" maximumDate={new Date()} display="inline"
								onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
						</FormControl>

						<FormControl isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Last Known Location</Text></FormControl.Label>
							<MapAddressSearch formData={formData} setFormData={setFormData} />
							{<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>No address found.</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isInvalid={'description' in errors} isRequired>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Description</Text></FormControl.Label>
							<Input color={colors.text} multiline={true} size="lg" placeholder='Additional info' onChangeText={value => setFormData({ ...formData, description: value })} />
							{'description' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.description}</FormControl.ErrorMessage>}
						</FormControl>

                        <Button buttonColor={Color.NENO_BLUE} style={{opacity: !isButtonDisabled ? 1 : 0.4}} mode="contained" onPress={!isButtonDisabled ? onCreateReportPress : () => {}}>
                            {buttonText}
                        </Button>

					</VStack>
				</VStack>
			</SafeAreaView>
		</KeyboardAwareScrollView>
	);
};

export default NewReportPage;