import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, KeyboardAvoidingView } from "native-base";

import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";

const NewReportPage = ({route}) => {
  const [formData, setFormData] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [errors, setErrors] = useState({});
  // const {ownerId, accessToken} = route.params;

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
          setIsRegistered(true);
        }
      })
      .catch((error) => alert(error));
  };

  const validateDetails = () => {
    // Validates details. If details are valid, send formData object to onCreateReportPress.
    foundErrors = {};

    if (!formData.missingPet) {
      foundErrors = {...foundErrors, missingPet: 'Please select a pet'}
    }

    if (!formData.lastSeen || formData.lastSeen == "") {
      foundErrors = {...foundErrors, lastSeen: 'Last seen is required'}
    }

    if (!formData.lastLocation || formData.lastLocation == "") {
      foundErrors = {...foundErrors, lastLocation: 'Last known location is required'}
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

                <FormControl isInvalid={'missingPet' in errors}>
                  <FormControl.Label>Choose Pet</FormControl.Label>
                  <Select
                    selectedValue={formData.missingPet}
                    onValueChange={(value) => setFormData({...formData, missingPet: value})}
                  >
                    {dropdownOptions.map((option, index) => (
                      <Select.Item key={index} label={option} value={option} />
                    ))}
                  </Select>
                  {'missingPet' in errors && <FormControl.ErrorMessage>{errors.missingPet}</FormControl.ErrorMessage>}
                </FormControl>

                <FormControl isInvalid={'lastSeen' in errors}>
                  <FormControl.Label>Last Seen</FormControl.Label>
                  <Input onChangeText={value => setFormData({...formData, lastSeen: value})} placeholder="dd/mm/yy hh:mm" />
                  {'lastSeen' in errors && <FormControl.ErrorMessage>{errors.lastSeen}</FormControl.ErrorMessage>}
                </FormControl>

                <FormControl isInvalid={'lastLocation' in errors}>
                  <FormControl.Label>Last Known Location</FormControl.Label>
                  <Input onChangeText={value => setFormData({...formData, lastLocation: value})} />
                  {'lastLocation' in errors && <FormControl.ErrorMessage>{errors.lastLocation}</FormControl.ErrorMessage>}
                </FormControl>

                <FormControl isInvalid={'description' in errors}>
                  <FormControl.Label>Pet Description</FormControl.Label>
                  <Input onChangeText={value => setFormData({...formData, description: value})} />
                  {'description' in errors && <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>}
                </FormControl>

                <Button mt="2" bgColor={Color.NENO_BLUE} onPress={validateDetails}>
                    Submit Report
                </Button>

              </VStack>
            </Box>
          </Center>
        </Box>
      </KeyboardAvoidingView>
  );
};

export default NewReportPage;