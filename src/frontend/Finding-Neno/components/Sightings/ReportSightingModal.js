import { useNavigation, useTheme } from '@react-navigation/native';
import { Modal, useToast, FormControl, Input, HStack, VStack, Text, WarningOutlineIcon } from "native-base";
import { Color } from "../atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { useSelector } from "react-redux";

import { formatDatetime, formatDateTimeDisplay } from '../../Pages/shared';
import MapAddressSearch from "../Shared/MapAddressSearch";
import ImageHandler from '../Shared/ImageHandler';

const ReportSightingModal = ({report, userId, closeModal, showModal}) => {
    const [sightingDateTime, setSightingDateTime] = useState(new Date());
    const [reportSightingBtnDisabled, setReportSightingBtnDisabled] = useState(false);
    const [sightingFormErrors, setSightingFormErrors] = useState({});
    // const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
    const [sightingImage, setSightingImage] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const toast = useToast();
	const { colors } = useTheme();
    // console.log(showModal);
    
    const [sightingData, setSightingData] = useState({
        authorId: userId,
        missingReportId: report[0],
        animal: report[8],
        breed: report[9],
        imageUrl: null,
        dateTime: new Date(),
        lastLocation: '',
        description: ''
    });

	const resetForm = (report) => {
		// clears the form to default values
		setSightingData({
			...sightingData,
			missingReportId: report[0],
			animal: report[8],
			breed: report[9],
			imageUrl: null,
			dateTime: new Date(),
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
		closeModal();
	}


	const handleDatetimeConfirm = (datetime) => {
		setSightingDateTime(datetime);
		setSightingData({ ...sightingData, dateTime: datetime });
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
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	const handleSubmitSighting = async () => {
		let isValid = validateDetails(sightingData);

		if (isValid) {
            const sighting = {
                authorId: USER_ID,
                missingReportId: report[0],
                animal: report[8],
                breed: report[9],
                imageUrl: sightingImage,
                dateTime: sightingData.dateTime,
				dateTimeOfCreation: new Date(),
                description: sightingData.description,
                lastLocation: sightingData.lastLocation
            }

			setReportSightingBtnDisabled(true);
			const url = `${API_URL}/insert_sighting`;

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
							title: "Signting Reported",
							description: "Your sighting has been added, and the owner has been notified.",
							placement: "top",
							alignItems: 'center'
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
					<Modal.Content backgroundColor={colors.background}>
						<Modal.CloseButton _icon={{color: colors.text}} />
						<Modal.Header borderColor={colors.border} backgroundColor={colors.background} _text={{color: colors.text}}>Report a Pet Sighting</Modal.Header>
						<Modal.Body>
							<VStack space={3}>
								<ImageHandler image={sightingImage} setImage={setSightingImage} setIsButtonDisabled={setReportSightingBtnDisabled} />

								<FormControl isRequired>
									<FormControl.Label><Text fontWeight={500} color={colors.text}>Date and Time of Sighting</Text></FormControl.Label>
									<Button style={{ borderColor: colors.primary }} textColor={colors.primary} o mode="outlined" onPress={openPicker}>{formatDateTimeDisplay(sightingDateTime)}</Button>
									<DateTimePickerModal date={sightingDateTime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} display="inline"
										onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
								</FormControl>

								<FormControl isRequired>
									<FormControl.Label><Text fontWeight={500} color={colors.text}>Last Known Location</Text></FormControl.Label>
									<MapAddressSearch formData={sightingData} setFormData={setSightingData} />
									{<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>No address found.</FormControl.ErrorMessage>}
								</FormControl>

								<FormControl isInvalid={'description' in sightingFormErrors}>
									<FormControl.Label><Text fontWeight={500} color={colors.text}>Description</Text></FormControl.Label>
									<Input _input={{selectionColor: colors.primary}} color={colors.text} size="lg" value={sightingData.description} placeholder='Additional info' onChangeText={value => setSightingData({ ...sightingData, description: value })} />
									{'description' in sightingFormErrors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{sightingFormErrors.description}</FormControl.ErrorMessage>}
								</FormControl>
							</VStack>
						</Modal.Body>
						<Modal.Footer borderColor={colors.border} backgroundColor={colors.background}>
								{/* TODO: onPress */}
							<HStack space={2}>
								<Button mode='outlined' textColor={Color.NENO_BLUE} style={{borderColor: Color.NENO_BLUE}} onPress={onClose} >Cancel</Button>
								<Button buttonColor={Color.NENO_BLUE} style={{opacity: !reportSightingBtnDisabled ? 1 : 0.4}} mode="contained" onPress={!reportSightingBtnDisabled ? handleSubmitSighting : () => {}}>
                            		Submit Sighting
                        		</Button>	
							</HStack> 
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
	},
    markerView: {
        top: '50%',
        left: '50%',
        marginLeft: -24,
        marginTop: -44,
        position: 'absolute',
    },
    marker: {
        height: 48,
        width: 48
    }
});

export default ReportSightingModal;