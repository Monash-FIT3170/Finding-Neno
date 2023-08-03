import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";

import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

const AlertComponent = ({ onClose }) => (
	<Alert w="100%" status="success">
		<VStack space={1} flexShrink={1} w="100%" alignItems="center">
			<Alert.Icon size="md" />
			<Text fontSize="md" fontWeight="medium" _dark={{ color: "coolGray.800" }}>
				Your sighting has been added!
			</Text>
			<Button mt="2" bgColor={Color.NENO_BLUE} onPress={onClose}>
				Close
			</Button>
		</VStack>
	</Alert>
);

const NewSightingPage = ({navigation: {navigate}, route }) => {

    const navigation = useNavigation();
    const { headers } = route.params;
    const authorId = headers["userid"];
	const accessToken = headers["accesstoken"];

    const [formData, setFormData] = useState({ description: '' });
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Add sighting")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

    // TODO: validation
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

    const onPress = () => {
        console.log("btn pressed")
        setIsButtonDisabled(true);
        setButtonText("Adding sighting...");

        //let isValid = validateDetails(formData);
        
        // TODO: validation
        // if (isValid) {
            setFormData({ ...formData, authorId: authorId });

            const url = `${IP}:${PORT}/insert_new_sighting`;

            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })
                .then((res) => {
                    if (res.status == 201) {
                        console.log("res status 201")
						setIsCreated(true);
					}
                })
                .catch((error) => alert(error))
        // };

        setButtonText("Add sighting")
		setIsButtonDisabled(false);
    }

    const closeAlert = () => {
		setIsCreated(false);
	};

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<Box flex={1} alignItems="center" justifyContent="center">
				<Center w="100%">
					<Box safeArea p="2" py="8" w="90%" maxW="290">
                    { isCreated ? (<AlertComponent onClose={closeAlert} />) :
                        (
                        <VStack>
                            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a New Sighting</Heading>

                            <VStack space={3} mt="5">

                                <FormControl>
                                    {/* TODO: add column for this in DB + onChangeText */}
                                    <FormControl.Label>Animal</FormControl.Label>
                                    <Input placeholder="Type of animal" />
                                </FormControl>

                                <FormControl>
                                    {/* TODO: add column for this in DB + onChangeText */}
                                    <FormControl.Label>Breed</FormControl.Label>
                                    <Input placeholder="Pet breed" />
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Time of Sighting</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, dateTime: value })} placeholder="HH:MM dd/mm/yy" />
                                    {/* {'lastSeenDateTime' in errors && <FormControl.ErrorMessage>{errors.lastSeenDateTime}</FormControl.ErrorMessage>} */}
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Location of Sighting</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
                                    {/* {'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>} */}
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Description (Additional Info)</FormControl.Label>
                                    <Input onChangeText={value => setFormData({ ...formData, description: value })} />
                                    {/* {'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>} */}
                                </FormControl>

                                <Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onPress}>
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

}

export default NewSightingPage;