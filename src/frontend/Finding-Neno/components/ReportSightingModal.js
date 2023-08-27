import { useNavigation } from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { ActivityIndicator, Dimensions } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';



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
		} else if (!validateCoordinates(formData.lastLocation)) {
			foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
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
								<Button onPress={openPicker}>{`${sightingDateTime.getHours().toString().padStart(2, '0')}:${sightingDateTime.getMinutes().toString().padStart(2, '0')} ${sightingDateTime.toDateString()}`}</Button>
								<DateTimePickerModal date={sightingDateTime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
									onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
							</FormControl>

							<FormControl isInvalid={'lastLocation' in sightingFormErrors}>
								<FormControl.Label>Location of Sighting</FormControl.Label>
								<Input value={sightingData.lastLocation} onChangeText={value => setSightingData({ ...sightingData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
								{'lastLocation' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.lastLocation}</FormControl.ErrorMessage>}
							</FormControl>

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

export default ReportSightingModal;