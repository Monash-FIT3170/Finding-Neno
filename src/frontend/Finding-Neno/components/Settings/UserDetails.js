import React, { useState, useEffect } from 'react';
import { Heading, Box, HStack, Text, Input, FormControl, Spacer, useToast} from 'native-base';
import { Dimensions, TouchableOpacity, View} from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { validEmail, validPhoneNumber } from "../../Pages/validation";



function UserDetails() {
    const windowWidth = Dimensions.get('window').width; 
    const textInputWidth = windowWidth*0.7;

    const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [user, setUser] = useState([]);
    const [errors, setErrors] = useState({});
    const [newDetails, setNewDetails] = useState({
        name: user.name,
        phone: user.phone,
    });
    const toast = useToast();

    const isFocused = useIsFocused();
    useEffect(() => {
      if (isFocused) {
        fetchProfileInfo();
      }
    }, [isFocused]);

    const fetchProfileInfo = async () => {
        try {
            const url = `${IP}:${PORT}/retrieve_profile?user_id=${USER_ID}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID
                }
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }
            const profile_info = result[0];
            const name = profile_info[0];
            const email_address = profile_info[1];
            const phone_number = profile_info[2];
            setUser({ name: name, email: email_address, phone: phone_number });
            setNewDetails({ name: name, phone: phone_number });
        } catch (error) {
            console.log("error in profile page")
            console.log(error);
        }
    }

    const updateName = (newName) => {
        setNewDetails({ ...newDetails, name: newName})
    }

    const updatePhoneNumber = (newNumber) => {
        setNewDetails({ ...newDetails, phone: newNumber})
    }


    const saveDetails = () => {
        console.log(newDetails)
        console.log(validateDetails());
        // Show success
        if(!validateDetails()){
            console.log(user.name)
            updateName(user.name)            
            updatePhoneNumber(user.phone)
        } else {
            toast.show({
                description: "User details updated!",
                placement: "top"
            })
        }
        console.log(newDetails)
    }

    //
    const validateDetails = () => {
		// Validates details. If details are valid, send formData object to onSignupPress.
		foundErrors = {};
        if(!newDetails.name || newDetails.name == ""){
            foundErrors = { ...foundErrors, name: 'Name is required' }
        }

        if (!validPhoneNumber(newDetails.phone)) {
			foundErrors = { ...foundErrors, phoneNumber: 'Phone number is invalid' }
		}

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

    return (
      <View >
        <Box h={165} backgroundColor={"#FFFFFF"} borderRadius={10} marginBottom='5%'>
        <Box padding={3}>
        <HStack justifyContent="space-between" marginBottom={3}>
        <Heading
          fontSize="md"
          color="coolGray.600"
          _dark={{ color: "warmGray.200" }}
          pr={windowWidth / 3.5}
        >
          User Details
        </Heading>
        <TouchableOpacity onPress={saveDetails} fontSize="100%">
          <Text color={"#007AFF"} fontSize="md">Save</Text>
        </TouchableOpacity>
        </HStack>
        
        <HStack justifyContent="space-between"  marginBottom='1%'>

        <Text fontSize="md">Name </Text>
        <Spacer width={5}/>
        <FormControl >
		<Input 
            placeholder={user.name}
            onChangeText={(text) => updateName(text)} 
            width={textInputWidth} 
            textAlign="right" 
            variant={"unstyled"}/>
        {'name' in errors && <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>}
		</FormControl>
        </HStack>

        <HStack justifyContent="space-between"  marginBottom='1%'>
        <Text fontSize="md">Phone</Text>
        <Spacer width={5}/>
        <FormControl isInvalid={'phoneNumber' in errors}>
		<Input 
            keyboardType="numeric" 
            maxLength={10} 
            placeholder={user.phone}
            onChangeText={(text) => updatePhoneNumber(text)} 
            width={textInputWidth} 
            textAlign="right" 
            variant={"unstyled"}/>
		</FormControl>
        {'phoneNumber' in errors && <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>}
        </HStack>        
        
        <HStack justifyContent="space-between"  marginBottom='1%'>
        <Text fontSize="md">Email</Text>
        <Text width={textInputWidth} textAlign="right">{user.email} </Text>
        </HStack>
        </Box>  
        </Box>

      </View>
    );
  }
  
  export default UserDetails;