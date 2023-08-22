import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import React, { useEffect, useState, useRef } from 'react';
import { Color } from "../components/atomic/Theme";
import { validDateTime, validateCoordinates } from "./validation"
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { Image, StyleSheet, View } from 'react-native';


import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";


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

	const {IP, PORT} = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

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
				const url = `${IP}:${PORT}/get_owner_pets/${USER_ID}`;
				const response = await fetch(url, {
					headers: {
						method: "GET",
						'Authorization': `Bearer ${ACCESS_TOKEN}`
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

		setButtonText("Create report")
		setIsButtonDisabled(false);
	}

	const validateDetails = (formData) => {
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
		const minutes = datetime.getMinutes().toString().padStart(2, '0');
		const day = datetime.getDate().toString().padStart(2, '0');
		const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
		const year = datetime.getFullYear().toString();

		return `${hours}:${minutes} ${day}/${month}/${year}`
	}

    // default form values
    const [formData, setFormData] = useState({ 
        authorId: USER_ID,
        description: '',
        lastSeenDateTime: formatDatetime(selectedDatetime),
        dateTimeOfCreation: formatDatetime(new Date())
    });

	//map box for last known location
	// Initial map view is Melbourne. Delta is the zoom level, indicating distance of edges from the centre.
		const [mapRegion, setMapRegion] = useState({
			latitude: -37.8136,
			longitude: 144.9631,
			latitudeDelta: 0.6,
			longitudeDelta: 0.6,
		})

    // Retrieves coordinates of current centre of map when map is moved around
    const handleRegionChange = (region) => {
        setMapRegion(region);
    }	

	const [address, setAddress] = useState('');
	const [coordinates, setCoordinates] = useState(null);
	const mapViewRef = useRef(null);

	const handleSearch = async () => {
		try {
		  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
	
		  const response = await axios.get(apiUrl);
		  if (response.data.length > 0) {
			const firstResult = response.data[0];
			setCoordinates({
			  latitude: parseFloat(firstResult.lat),
			  longitude: parseFloat(firstResult.lon),
			});
			// You can animate to the new coordinates here if you want
			mapViewRef.current.animateToRegion({
			  latitude: parseFloat(firstResult.lat),
			  longitude: parseFloat(firstResult.lon),
			  latitudeDelta: 0.03,
			  longitudeDelta: 0.02,
			});
			console.log(firstResult);
		  } else {
			setCoordinates(null);
		  }
		} catch (error) {
		  console.error('Error fetching data:', error);
		  setCoordinates(null);
		}
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

										<FormControl>
											<FormControl.Label>Last Seen</FormControl.Label>
											<Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
											<DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
												onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
										</FormControl>

										<FormControl isInvalid={'lastLocation' in errors}>
											<FormControl.Label>Last Known Location</FormControl.Label>
											<Input onChangeText={text => setAddress(text)} placeholder="Enter an address" />
											{'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
										</FormControl>

										<Button title="Search" onPress={handleSearch} />


										<Box padding={3} height={150}>
										<MapView ref={mapViewRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={mapRegion} showCompass={true} showsIndoors={false}
										loadingEnabled={true}
										mapType={Platform.OS == "android" ? "none" : "standard"} onRegionChange={(region) => handleRegionChange(region)} >

										</MapView>
										</Box>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    text: {
        fontSize: 20
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'blue',
    }
});



export default NewReportPage;