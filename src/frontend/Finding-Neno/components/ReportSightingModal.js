import { useNavigation } from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { ActivityIndicator, Dimensions } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { StyleSheet } from 'react-native';



import store from '../store/store';
import { validDateTime, validateCoordinates } from "../Pages/validation"
import { useSelector, useDispatch } from "react-redux";

import { formatDatetime } from '../Pages/shared';

const ReportSightingModal = ({report, userId, closeModal, showModal}) => {
    const [sightingDateTime, setSightingDateTime] = useState(new Date());
    const [reportSightingBtnDisabled, setReportSightingBtnDisabled] = useState(false);
    const [sightingFormErrors, setSightingFormErrors] = useState({});
    // const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
    const [sightingImage, setSightingImage] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { IP, PORT } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const toast = useToast();
	const isFocused = useIsFocused();
    const navigation = useNavigation();
    // console.log(showModal);
    
    const [sightingData, setSightingData] = useState({
        authorId: userId,
        missingReportId: report[0],
        animal: report[7],
        breed: report[8],
        imageUrl: null,
        dateTime: formatDatetime(new Date()),
        dateTimeOfCreation: formatDatetime(new Date()),
        lastLocation: '',
        description: ''
    });

    const resetForm = (report) => {
		// clears the form to default values
		setSightingData({
			...sightingData,
			missingReportId: report[0],
			animal: report[7],
			breed: report[8],
			imageUrl: null,
			dateTime: formatDatetime(new Date()),
			dateTimeOfCreation: formatDatetime(new Date()),
			lastLocation: '',
			description: ''
		});
		setSightingImage(null);
		setSightingDateTime(new Date());
		setSightingFormErrors({});
		setReportSightingBtnDisabled(false)
	}

    const onClose = () => {
        resetForm(report);
        setIsUploading(false);
        closeModal();
    }


    // setSightingImage(null);
    // setSightingDateTime(new Date());
    // setSightingFormErrors({});
    // setReportSightingBtnDisabled(false)



    const handleDatetimeConfirm = (datetime) => {
		setSightingDateTime(datetime);
		setSightingData({ ...sightingData, dateTime: formatDatetime(datetime) });
		closePicker();
	}
    var maximumDate;
	const openPicker = () => {
		maximumDate = new Date();
		setShowPicker(true);
	};

	const closePicker = () => {
		setShowPicker(false);
	}
    const uploadImage = async (base64Img, setSightingImage) => {
		// Set loading image while the chosen image is being uploaded
		setIsUploading(true);
		setReportSightingBtnDisabled(true);

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
				} else {
					console.log("Image failed to upload - setting default image");
					setSightingImage(null);
				}
			})
			.catch(err => {
				console.log("Image failed to upload:", err);
				setSightingImage(null);
			});

		setIsUploading(false);
		setReportSightingBtnDisabled(false);
	}

    const handleTakePhoto = async () => {
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
					setSightingData({ ...sightingData, image_url: result.assets[0].uri })
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
		}

		if (formData.description.length > 500) {
			foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
		}

		setSightingFormErrors(foundErrors);
		return Object.keys(foundErrors).length === 0;
	}

      // image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
  	useEffect(() => {
		setSightingData({...sightingData, image_url: sightingImage})
	}, [sightingImage]);

    const handleSubmitSighting = async () => {
		let isValid = validateDetails(sightingData);

		if (isValid) {
            const sighting = {
                authorId: USER_ID,
                missingReportId: report[0],
                animal: report[7],
                breed: report[8],
                imageUrl: sightingImage,
                dateTime: sightingData.dateTime,
                dateTimeOfCreation: formatDatetime(new Date()),
                description: sightingData.description,
                lastLocation: sightingData.lastLocation
            }

			setReportSightingBtnDisabled(true);
			const url = `${IP}:${PORT}/insert_sighting`;

			setSightingData({ ...sightingData, image_url: sightingImage })

			await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID
				},
				body: JSON.stringify(sighting),
			})
				.then((res) => {
					if (res.status == 201) {
						toast.show({
							description: "Your sighting has been added, and the owner has been notified.",
							placement: "top"
						})
                        onClose();
					}
				})
				.catch((error) => alert(error));
		}

		setReportSightingBtnDisabled(false);
	}

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
		setSightingData({
			...sightingData,
			lastLocation: `${parseFloat(firstResult.lon)}, ${parseFloat(firstResult.lat)}`,		});
		// You can animate to the new coordinates here if you want
		mapViewRef.current.animateToRegion({
		  latitude: parseFloat(firstResult.lat),
		  longitude: parseFloat(firstResult.lon),
		  latitudeDelta: 0.03,
		  longitudeDelta: 0.05,
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
        <>
        {showModal &&
        <Modal avoidKeyboard isOpen onClose={onClose}>
				<Modal.Content >
					<Modal.CloseButton />
					<Modal.Header>Sighting details</Modal.Header>
					<Modal.Body>
						<FormControl.Label>Photo</FormControl.Label>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							{
								isUploading ? <ActivityIndicator /> :
								sightingImage && <Image source={{ uri: sightingImage }} style={{ width: 100, height: 100 }} alt='pet sighting image' />
							}
						</View>

						<Button variant="ghost" onPress={handleChoosePhoto}>
							Choose From Library
						</Button>
						<Button variant="ghost" onPress={handleTakePhoto}>
							Take Photo
						</Button>
						<ScrollView>
							{/* form details */}
							<FormControl >
								<FormControl.Label>Date and Time of Sighting</FormControl.Label>
								<Button onPress={openPicker}>{`${sightingDateTime.toDateString()} ${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')}`}</Button>
								<DateTimePickerModal date={sightingDateTime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
									onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
							</FormControl>

							<FormControl>
									<FormControl.Label>Last Known Location</FormControl.Label>
									<Input onChangeText={text => setAddress(text)} placeholder="Enter an address" />
									{coordinates === null && <FormControl.ErrorMessage>No address found.</FormControl.ErrorMessage>}
								</FormControl> 

								<Button title="Search" onPress={handleSearch}>Search</Button>

								<Box height={150}>
								<MapView
									ref={mapViewRef}
									provider={PROVIDER_GOOGLE}
									style={styles.map}
									initialRegion={mapRegion}
								>
									{coordinates !== null && <Marker coordinate={coordinates} />}
								</MapView>
								</Box>

							<FormControl isInvalid={'description' in sightingFormErrors}>
								<FormControl.Label>Description (Additional Info)</FormControl.Label>
								<Input value={sightingData.description} onChangeText={value => setSightingData({ ...sightingData, description: value })} />
								{'description' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.description}</FormControl.ErrorMessage>}
							</FormControl>

            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
                {/* TODO: onPress */}
              <Button variant="ghost" colorScheme="blueGray" onPress={onClose} >
                Cancel
              </Button>
              <Button bgColor={Color.NENO_BLUE} 
                disabled={reportSightingBtnDisabled} opacity={!reportSightingBtnDisabled ? 1 : 0.6}
                onPress={() => handleSubmitSighting()}
              >
                Report sighting 
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    }
      </>
    )

}

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

export default ReportSightingModal;