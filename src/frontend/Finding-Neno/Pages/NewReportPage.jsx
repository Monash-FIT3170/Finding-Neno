import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";

import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

const NewReportPage = () => {
  const [formData, setFormData] = useState({ description: '' });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    // Simulating asynchronous data fetching
    setTimeout(() => {
      const fetchedOptions = ['Pet 1', 'Pet 2', 'Add new Pet'];
      setDropdownOptions(fetchedOptions);
    }, 2000);
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

    if (!formData.missingPetId) {
      foundErrors = {...foundErrors, missingPetId: 'Please select a pet'}
    }

    if (!formData.lastSeenDateTime || formData.lastSeenDateTime == "") {
      foundErrors = {...foundErrors, lastSeenDateTime: 'Last seen date is required'}
    } else if (!validDateTime(formData.lastSeenDateTime)) {
      foundErrors = {...foundErrors, lastSeenDateTime: 'Date is invalid'}
    }

    if (!formData.lastLocation || formData.lastLocation == "") {
      foundErrors = {...foundErrors, lastLocation: 'Last known location is required'}
    } else if (!validateCoordinates(formData.lastLocation)) {
      foundErrors = {...foundErrors, lastLocation: 'Location coordinates is invalid'}
    }

    if (formData.description.length > 500) {
        foundErrors = {...foundErrors, description: 'Must not exceed 500 characters'}
      }

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      // no errors!
      onCreateReportPress(formData)
    }
  }

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Box flex={1} alignItems="center" justifyContent="center">
          <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
              
            {
              isCreated ? (
                // TODO: Make this into a component called MyAlert, with headerText, bodyText, link, onLinkPress as props 
                // this will make this file a little less messy 
              <Alert w="100%" status="success">
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="md" />
                  <Text fontSize="md" fontWeight="medium" _dark={{
                  color: "coolGray.800"
                }}>
                    Your report has been created!
                  </Text>
                </VStack>
              </Alert>

              ) : (
                
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
                  <Input onChangeText={value => setFormData({...formData, lastSeenDateTime: value})} placeholder="hh:mm dd/mm/yy" />
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
              )}
            </Box>
          </Center>
        </Box>
      </KeyboardAvoidingView>
  );
};

export default NewReportPage;