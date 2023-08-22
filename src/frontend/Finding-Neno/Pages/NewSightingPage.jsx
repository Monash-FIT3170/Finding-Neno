import { useNavigation } from '@react-navigation/native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView, FlatList } from "native-base";
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

import { petTypeOptions } from "./shared";

const NewSightingPage = ({ navigation: { navigate } }) => {
    const { IP, PORT } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const navigation = useNavigation();

    const [errors, setErrors] = useState({});
    const [buttonText, setButtonText] = useState("Add sighting")
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [selectedDatetime, setSelectedDatetime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState("dog");
    const [image, setImage] = useState(null);
    const toast = useToast();

    const handleTakePhoto = async () => {
        /**
         * This function is used to take a photo from the user's camera.
         * It will call the ImagePicker API to open the camera and allow the user to take a photo.
         * It will then set the petImage state to the taken photo.
         */
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri.toString());
                setFormData({ ...formData, image_url: result.assets[0].uri.toString() });
            }
        }
    };

    const handleChoosePhoto = async () => {
        /**
         * This function is used to choose a photo from the user's photo library.
         * It will call the ImagePicker API to open the photo library and allow the user to choose a photo.
         * It will then set the petImage state to the chosen photo.
         */
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri.toString());
                setFormData({ ...formData, image_url: result.assets[0].uri.toString() });
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

        if (!formData.animal || formData.animal == "") {
            foundErrors = { ...foundErrors, animal: 'Please select a pet type' }
        }

        if (formData.description.length > 500) {
            foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
        }

        setErrors(foundErrors);

        // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
        return Object.keys(foundErrors).length === 0;
    }

    const onPress = async () => {
        setIsButtonDisabled(true);
        setButtonText("Adding sighting...");

        let isValid = validateDetails(formData);

        if (isValid) {
            setFormData({ ...formData, missing_report_id: null, animal: selectedAnimal, id:USER_ID  });

            const url = `${IP}:${PORT}/insert_new_sighting`;

            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID
                },
                body: JSON.stringify(formData),
            })
                .then((res) => {
                    if (res.status == 201) {
                        toast.show({
                            description: "Your sighting has been added!",
                            placement: "top"
                        })
                        navigate('Sightings Page')
                    }
                })
                .catch((error) => alert(error));
        };
        setButtonText("Add sighting");
        setIsButtonDisabled(false);
    }

    // Date picker
    var maximumDate;
    const openPicker = () => {
        maximumDate = new Date();
        setShowPicker(true);
    }

    const handleDatetimeConfirm = (datetime) => {
        setSelectedDatetime(datetime);
        setFormData({ ...formData, dateTime: formatDatetime(datetime) });
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
        missing_report_id: null,
        authorId: USER_ID,
        animal: 'dog',
        breed: null,
        image_url: null,
        description: '',
        dateTime: formatDatetime(selectedDatetime),
        dateTimeOfCreation: formatDatetime(new Date())
    });

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            <FlatList
                data={[{ key: 'form' }]} // Use a single item array as data source
                renderItem={() => (
                    <Box flex={1} alignItems="center" justifyContent="center">
                        <Center w="100%">
                            <Box safeArea p="2" py="8" w="90%" maxW="290">
                                <VStack>
                                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Add a New Sighting</Heading>

                                    <VStack space={3} mt="5">
                                        <FormControl.Label>Photo</FormControl.Label>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt='pet sighting image' />}
                                        </View>
                                        <Button variant="ghost" onPress={handleChoosePhoto}>
                                            Choose From Library
                                        </Button>
                                        <Button variant="ghost" onPress={handleTakePhoto}>
                                            Take Photo
                                        </Button>

                                        <FormControl isInvalid={'petType' in errors}>
                                            <FormControl.Label>Choose Pet Type</FormControl.Label>
                                            <Select placeholder="Select a pet type"
                                                selectedValue={formData.petType}
                                                onValueChange={(value) => setFormData({ ...formData, animal: value })}>
                                                <Select.Item label="Select a pet" value="" disabled hidden />
                                                {petTypeOptions.map((option, index) => (
                                                    <Select.Item key={index} label={option.label} value={option.value} />
                                                ))}
                                            </Select>
                                            {'petType' in errors && <FormControl.ErrorMessage>{errors.petType}</FormControl.ErrorMessage>}
                                        </FormControl>

                                        <FormControl>
                                            <FormControl.Label>Breed</FormControl.Label>
                                            <Input
                                                placeholder="Pet breed"
                                                onChangeText={value => setFormData({ ...formData, breed: value })}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormControl.Label>Date and Time of Sighting</FormControl.Label>
                                            <Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
                                            <DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
                                                onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
                                        </FormControl>

                                        <FormControl isInvalid={'lastLocation' in errors}>
                                            <FormControl.Label>Location of Sighting</FormControl.Label>
                                            <Input onChangeText={value => setFormData({ ...formData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
                                            {'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
                                        </FormControl>

                                        <FormControl isInvalid={'description' in errors}>
                                            <FormControl.Label>Description (Additional Info)</FormControl.Label>
                                            <Input onChangeText={value => setFormData({ ...formData, description: value })} />
                                            {'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>}
                                        </FormControl>

                                        <Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onPress}>
                                            {buttonText}
                                        </Button>

                                    </VStack>
                                </VStack>
                            </Box>
                        </Center>
                    </Box>
                )}
            />
        </KeyboardAvoidingView>
    );

}

export default NewSightingPage;