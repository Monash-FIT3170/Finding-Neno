import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker'


import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

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

const NewReportPage = () => {
  const [formData, setFormData] = useState({ description: '' });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isCreated, setIsCreated] = useState(false);

  const [selectedDatetime, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Simulating asynchronous data fetching
    const fetchOwnerPets = async () => {
      try {
        const response = await fetch(`${IP}:${PORT}/get_owner_pets/${ownerId}`);
        const data = await response.json();
        setDropdownOptions = data.map(function(pet) {
          return {
            name: pet.name,
            id: pet.id
          };
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchOwnerPets();
  }, []);


  const onCreateReportPress = async (formData) => {
    const url = `${IP}:${PORT}/insert_missing_report`;
 
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status == 201) {
            // Show success
            // Clear fields?
            setIsCreated(true)
        }
      })
      .catch((error) => alert(error));
  };

  const validateDetails = () => {
    // Validates details. If details are valid, send formData object to onCreateReportPress.
    foundErrors = {};

    // if (!formData.missingPetId) {
    //   foundErrors = {...foundErrors, missingPetId: 'Please select a pet'}
    // }

    console.log(selectedDatetime >= new Date())
    if (!formData.lastSeenDateTime) {
      foundErrors = {...foundErrors, lastSeenDateTime: 'Last seen date is required'}
    // } else if (!validDateTime(formData.lastSeenDateTime)) {
    } else if (selectedDatetime >= new Date()) {
      foundErrors = {...foundErrors, lastSeenDateTime: 'Last seen date cannot be in the future'}
    }
    // formData.lastSeenDateTime = formatDatetimeString(formData.lastSeenDateTime)
    
    if (!formData.lastLocation || formData.lastLocation == "") {
      foundErrors = {...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122'}
    } else if (!validateCoordinates(formData.lastLocation)) {
      foundErrors = {...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122'}
    }

    if (formData.description.length > 500) {
        foundErrors = {...foundErrors, description: 'Must not exceed 500 characters'}
      }

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      // no errors!
      console.log("making report")
      onCreateReportPress(formData)
    }
  }

  const closeAlert = () => {
    setIsCreated(false);
  };

  const formatDatetimeString = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const handleConfirm = (date) => {
    hidePicker();
    if (date) {
      setSelectedDate(date);
      setFormData({...formData, lastSeenDateTime: formatDatetimeString(date)})
    }
  };


  var maximumDate;
  const openPicker = () => {
    maximumDate = new Date();
    setShowPicker(true);
  };

  const hidePicker = () => {
    setShowPicker(false);
  }

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Box flex={1} alignItems="center" justifyContent="center">
          <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
              
              <VStack>
              <Heading
                  size="lg"
                  fontWeight="600"
                  color="coolGray.800"
                  _dark={{
                  color: "warmGray.50",
                  }}
              >
                  Create a Report
              </Heading>

              <VStack space={3} mt="5">

                <FormControl isInvalid={'missingPetId' in errors}>
                  <FormControl.Label>Choose Pet</FormControl.Label>
                  <Select
                    selectedValue={formData.missingPetId}
                    onValueChange={(value) => setFormData({...formData, missingPetId: value})}
                  >
                    {dropdownOptions.map((option, index) => (
                        // <Select.Item key={index} label={option} value={pet_id} />
                      <Select.Item key={index} label={option} value={index+1} />
                    ))}
                  </Select>
                  {'missingPetId' in errors && <FormControl.ErrorMessage>{errors.missingPet}</FormControl.ErrorMessage>}
                </FormControl>

                <FormControl isInvalid={'lastSeenDateTime' in errors}>
                  <FormControl.Label>Last Seen</FormControl.Label>
                  <Button onPress={openPicker}>{`${selectedDatetime.getHours().toString().padStart(2, '0')}:${selectedDatetime.getMinutes().toString().padStart(2, '0')} ${selectedDatetime.toDateString()}`}</Button>
                  <DateTimePickerModal date={selectedDatetime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={maximumDate} onConfirm={(date) => handleConfirm(date)} onCancel={hidePicker} />

                  {/* <DatePicker date={selectedDatetime} mode="datetime" placeholder="Select date and time" maxDate={maximumDate} /> */}
                  {'lastSeenDateTime' in errors && <FormControl.ErrorMessage>{errors.lastSeenDateTime}</FormControl.ErrorMessage>}
                </FormControl>



                <FormControl isInvalid={'lastLocation' in errors}>
                  <FormControl.Label>Last Known Location</FormControl.Label>
                  <Input onChangeText={value => setFormData({...formData, lastLocation: value})} placeholder="long (-180 to 180), lat (-90 to 90)"/>
                  {'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
                </FormControl>

                <FormControl isInvalid={'description' in errors}>
                  <FormControl.Label>Additional Info</FormControl.Label>
                  <Input onChangeText={value => setFormData({...formData, description: value})} />
                  {'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>}
                </FormControl>

                <Button mt="2" bgColor={Color.NENO_BLUE} onPress={validateDetails}>
                    Create Report
                </Button>

              </VStack>
              </VStack>
            
            </Box>
          </Center>
        </Box>
      </KeyboardAvoidingView>
  );
};

export default NewReportPage;