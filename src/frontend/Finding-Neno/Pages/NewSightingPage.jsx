import { useNavigation } from '@react-navigation/native';
import { Heading, VStack, useToast, FormControl, Input, Select, WarningOutlineIcon } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useState, useRef } from 'react';
import { Color } from "../components/atomic/Theme";
import { StatusBar } from 'expo-status-bar';
import { Button, Subheading, Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from "react-redux";
import { formatDatetime, formatDateTimeDisplay, petTypeOptions } from "./shared";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapAddressSearch from "../components/MapAddressSearch";
import ImageHandler from "../components/ImageHandler";

const NewSightingPage = ({ navigation: { navigate } }) => {
    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const navigation = useNavigation();

    const [errors, setErrors] = useState({});
    const [buttonText, setButtonText] = useState("Add sighting")
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [selectedDatetime, setSelectedDatetime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const toast = useToast();

    // default form values
    const [formData, setFormData] = useState({
        breed: '',
        imageUrl: '',
        dateTime: formatDatetime(selectedDatetime),
        description: '',
        petType: ''
    });
    const [sightingImage, setSightingImage] = useState(null);

    const validateDetails = (formData) => {
        // Validates details. If details are valid, send formData object to onCreateReportPress.
        foundErrors = {};

        // if (!formData.lastLocation || formData.lastLocation == "") {
        //     foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
        // }

        if (formData.petType == "") {
            foundErrors = { ...foundErrors, petType: 'Pet type is required' }
        }

        if (formData.description.length > 500) {
            foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
        }

        setErrors(foundErrors);
        console.log(foundErrors)

        // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
        return Object.keys(foundErrors).length === 0;
    }

    const onPress = async () => {
        setIsButtonDisabled(true);
        setButtonText("Adding sighting...");

        let isValid = validateDetails(formData);

        if (isValid) {
            const sighting = {
                authorId: USER_ID,
                missingReportId: null,
                animal: formData.petType,
                breed: formData.breed,
                imageUrl: sightingImage,
                dateTime: formData.dateTime,
                dateTimeOfCreation: formatDatetime(new Date()),
                description: formData.description,
				lastLocation: formData.lastLocation
            }

            const url = `${API_URL}/insert_sighting`;

            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID
                },
                body: JSON.stringify(sighting),
            })
                .then((res) => {
                    if (res.status == 201) {
                        toast.show({
                            description: "Your sighting has been added!",
                            placement: "top"
                        })
                        
                        navigation.goBack();
                    }
                    else {
                        setButtonText("Add sighting");
                        setIsButtonDisabled(false);
                    }
                })
                .catch((error) => {
                    setButtonText("Add sighting");
                    setIsButtonDisabled(false);
                    alert(error);
                });
        }
        else {
            setButtonText("Add sighting");
            setIsButtonDisabled(false);
        }
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
        console.log(selectedDatetime)
        setShowPicker(false);
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <StatusBar style="auto" />
            <SafeAreaView style={{ flex: 1, marginHorizontal: "10%" }}>

                <VStack>
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50", }}>Report a Pet Sighting</Heading>
                    <Subheading>Found a lost pet? Report your sighting here</Subheading>
                    <Subheading>Sighting will automatically expire after 30 days</Subheading>

                    <VStack space={3} mt="5"> 
                        <ImageHandler image={sightingImage} setImage={setSightingImage} setIsButtonDisabled={setIsButtonDisabled} />

                        <FormControl isRequired isInvalid={'petType' in errors}>
                            <FormControl.Label>Pet Type</FormControl.Label>
                            <Select size="lg" placeholder="Select a pet type"
                                selectedValue={formData.petType}
                                onValueChange={(value) => setFormData({ ...formData, petType: value })}>
                                <Select.Item label="Select a pet" value="" disabled hidden />
                                {petTypeOptions.map((option, index) => (
                                    <Select.Item key={index} label={option.label} value={option.value} />
                                ))}
                            </Select>
                            {'petType' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.petType}</FormControl.ErrorMessage>}
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Breed</FormControl.Label>
                            <Input
                                placeholder="Pet breed"
                                onChangeText={value => setFormData({ ...formData, breed: value })}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormControl.Label>Date and Time of Sighting</FormControl.Label>
                            <Button buttonColor={Color.NENO_BLUE} mode="contained" onPress={openPicker}>{formatDateTimeDisplay(selectedDatetime)}</Button>
                            <DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" maximumDate={new Date()} themeVariant="light" display="inline"
                                onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>Last Known Location</FormControl.Label>
                            <MapAddressSearch formData={formData} setFormData={setFormData} />
                            {<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>No address found.</FormControl.ErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={'description' in errors}>
                            <FormControl.Label>Description</FormControl.Label>
                            <Input size="lg" placeholder="Additional info" onChangeText={value => setFormData({ ...formData, description: value })} />
                            {'description' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.description}</FormControl.ErrorMessage>}
                        </FormControl>

                        <Button buttonColor={Color.NENO_BLUE} mode="contained" disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onPress}>
                            {buttonText}
                        </Button>

                    </VStack>
                </VStack>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}

export default NewSightingPage;