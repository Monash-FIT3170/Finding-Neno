import { useNavigation, useTheme } from '@react-navigation/native';
import { Heading, VStack, useToast, FormControl, Input, Select, Text, WarningOutlineIcon } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, { useState, useRef } from 'react';
import { Color } from "../components/atomic/Theme";
import { Button, Subheading } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from "react-redux";
import { formatDatetime, formatDateTimeDisplay, petTypeOptions } from "./shared";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapAddressSearch from "../components/MapAddressSearch";
import ImageHandler from "../components/ImageHandler";
import { Dropdown } from 'react-native-element-dropdown';
import { useColorScheme } from 'react-native';

const NewSightingPage = ({ navigation: { navigate } }) => {
    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const navigation = useNavigation();
    const scheme = useColorScheme();
    const { colors } = useTheme();

    const [errors, setErrors] = useState({});
    const [buttonText, setButtonText] = useState("Add Sighting")
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [selectedDatetime, setSelectedDatetime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const toast = useToast();

    // default form values
    const [formData, setFormData] = useState({
        breed: '',
        imageUrl: '',
        dateTime: selectedDatetime,
        description: '',
    });
    const [sightingImage, setSightingImage] = useState(null);

    const validateDetails = (formData) => {
        // Validates details. If details are valid, send formData object to onCreateReportPress.
        foundErrors = {};

        // if (!formData.lastLocation || formData.lastLocation == "") {
        //     foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
        // }

        if (!formData.animal || formData.animal == "") {
            foundErrors = { ...foundErrors, animal: 'Pet is required.' }
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
                animal: formData.animal,
                breed: formData.breed,
                imageUrl: sightingImage,
                dateTime: formData.dateTime,
				dateTimeOfCreation: new Date(),
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
                            title: "Sighting Added",
                            description: "Your sighting has been added!",
                            placement: "top",
                            alignItems: "center"
                        })
                        
                        navigation.goBack();
                    }
                    else {
                        setButtonText("Add Sighting");
                        setIsButtonDisabled(false);
                    }
                })
                .catch((error) => {
                    setButtonText("Add Sighting");
                    setIsButtonDisabled(false);
                    alert(error);
                });
        }
        else {
            setButtonText("Add Sighting");
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
        setFormData({ ...formData, dateTime: datetime });
        closePicker();
    }

    const closePicker = () => {
        console.log(selectedDatetime)
        setShowPicker(false);
    }

    return (
		<KeyboardAwareScrollView contentContainerStyle={{paddingVertical: 50}}>
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%'}}>
				<VStack width={300} justifyContent='center'>
                    <Heading size="lg" fontWeight="600" color={colors.primary}>Report a Pet Sighting</Heading>
                    <Subheading style={{color: colors.text}}>Found a lost pet? Report your sighting here</Subheading>
                    <Subheading style={{color: colors.text}}>Sighting will automatically expire after 30 days</Subheading>

                    <VStack space={3} mt="5"> 
                        <ImageHandler image={sightingImage} setImage={setSightingImage} setIsButtonDisabled={setIsButtonDisabled} />

                        <FormControl isRequired isInvalid={'animal' in errors}>
                            <FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Type</Text></FormControl.Label>
							<Dropdown data={petTypeOptions} placeholder='Select a pet type' 
								style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 4}}
								placeholderStyle={{color: 'darkgray', marginHorizontal: 13}}
								itemTextStyle={{color: colors.text}}
								itemContainerStyle={{backgroundColor: colors.background}}
								containerStyle={{backgroundColor: colors.background}}
								selectedTextStyle={{color: colors.text, marginHorizontal: 13}}
                                iconStyle={{marginRight: 10}}
								activeColor={ scheme === 'dark' ? '#313338' : '#dbdbdb' }
								onChange={(item) => setFormData({ ...formData, animal: item.value })}
								labelField='label' valueField='value'
							/>
                            {'animal' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.animal}</FormControl.ErrorMessage>}
                        </FormControl>

                        <FormControl>
                            <FormControl.Label><Text fontWeight={500} color={colors.text}>Breed</Text></FormControl.Label>
                            <Input size="lg" color={colors.text}
                                placeholder="Pet breed"
                                onChangeText={value => setFormData({ ...formData, breed: value })}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormControl.Label><Text fontWeight={500} color={colors.text}>Date and Time of Sighting</Text></FormControl.Label>
                            <Button style={{ borderColor: colors.primary}} textColor={colors.primary} mode="outlined" onPress={openPicker}>{formatDateTimeDisplay(selectedDatetime)}</Button>
                            <DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" maximumDate={new Date()} themeVariant="light" display="inline"
                                onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label><Text fontWeight={500} color={colors.text}>Last Known Location</Text></FormControl.Label>
                            <MapAddressSearch formData={formData} setFormData={setFormData} />
                            {<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>No address found.</FormControl.ErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={'description' in errors}>
                            <FormControl.Label><Text fontWeight={500} color={colors.text}>Description</Text></FormControl.Label>
                            <Input multiline={true} size="lg" color={colors.text} placeholder="Additional info" onChangeText={value => setFormData({ ...formData, description: value })} />
                            {'description' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.description}</FormControl.ErrorMessage>}
                        </FormControl>

                        <Button buttonColor={Color.NENO_BLUE} style={{opacity: !isButtonDisabled ? 1 : 0.4}} mode="contained" onPress={!isButtonDisabled ? onPress : () => {}}>
                            {buttonText}
                        </Button>

                    </VStack>
                </VStack>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}

export default NewSightingPage;