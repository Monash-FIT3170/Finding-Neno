import React, { useState } from 'react';
import {View, Text, TextInput, ScrollView,} from 'react-native';
import { Button} from "native-base";
import { Color } from "../components/atomic/Theme";
import Dropdown from './Dropdown';

const ReportPage = () => {
  const [missingPet, setMissingPet] = useState('');
  const options = ['Option 1', 'Option 2', 'Add new Pet'];
  const handleSelectOption = (option) => setMissingPet(option);

  const [lastSeen, setLastSeen] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [description, setDescription] = useState('');

  const [dropdownHeight, setDropdownHeight] = useState(150);


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
    // Validates details. If details are valid, send formData object to onSignupPress.
    foundErrors = {};

    // if (!formData.name || formData.name == "") {
    //   foundErrors = {...foundErrors, name: 'Name is required'}
    // }

    // if (!formData.email || formData.email == "") {
    //   foundErrors = {...foundErrors, email: 'Email is required'}
    // } else if (!validEmail(formData.email)) {
    //   foundErrors = {...foundErrors, email: 'Email is invalid'}
    // }

    // if (!formData.phoneNumber || formData.phoneNumber == "") {
    //   foundErrors = {...foundErrors, phoneNumber: 'Phone number is required'}
    // } else if (!validPhoneNumber(formData.phoneNumber)) {
    //   foundErrors = {...foundErrors, phoneNumber: 'Phone number is invalid'}
    // }

    // if (!formData.password || formData.password == "") {
    //   foundErrors = {...foundErrors, password: 'Password is required'}
    // }

    // if (!formData.confirmPassword || formData.confirmPassword == "") {
    //   foundErrors = {...foundErrors, confirmPassword: 'Password confirmation is required'}
    // }

    // if (formData.confirmPassword !== formData.password) {
    //   foundErrors = {...foundErrors, confirmPassword: 'Passwords must match'}
    // }

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      // no errors!
      onSignupPress(formData)
    }
  }

  return (
    <ScrollView>
        <View style={{ padding: 16 }}>

            <Text style={{ marginBottom: 8, fontSize: 16 }}>Choose Pet:</Text>
            <View style={{ marginBottom: 8, height: dropdownHeight }}>
                <Dropdown
                    options={options}
                    selectedOption={missingPet}
                    onSelect={handleSelectOption}
                    onLayout={(event) => setDropdownHeight(event.nativeEvent.layout.height)}
                    placeholder="Select a pet"
                />
            </View>

            <Text style={{ marginBottom: 8, fontSize: 16 }}>Last seen:</Text>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: '#ddd',
                    padding: 8,
                    marginBottom: 16,
                }}>
                <TextInput
                    style={{ fontSize: 16 }}
                    placeholder="dd/mm/yyyy hh:mm"
                    value={lastSeen}
                    onChangeText={setLastSeen}
                />
            </View>

            <Text style={{ marginBottom: 8, fontSize: 16 }}>Last Known Location:</Text>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: '#ddd',
                    padding: 8,
                    marginBottom: 16,
                }}>
                <TextInput
                    style={{ fontSize: 16 }}
                    placeholder="Enter last known location"
                    value={lastLocation}
                    onChangeText={setLastLocation}
                />
            </View>

            <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet Description:</Text>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    borderColor: '#ddd',
                    padding: 8,
                    marginBottom: 16,
                }}>
                <TextInput
                    style={{ fontSize: 16 }}
                    placeholder="Enter pet description"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <Button mt="2" bgColor={Color.NENO_BLUE} >
                Submit Report
            </Button>
        </View>
    </ScrollView>
  );
};

export default ReportPage;