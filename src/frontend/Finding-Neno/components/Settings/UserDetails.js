import React, { useState, useEffect } from 'react';
import { Heading, Box, HStack, Text, Input, FormControl, Spacer, useToast, useTheme} from 'native-base';
import { Dimensions, TouchableOpacity, View} from 'react-native';
import { useIsFocused } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { validPhoneNumber } from "../../Pages/validation";



function UserDetails({ colors }) {
  const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);
    const textInputWidth = WINDOW_WIDTH*0.7;

    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [user, setUser] = useState([]);
    const [errors, setErrors] = useState({});
    const [tempDetails, setTempDetails] = useState({
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
            const url = `${API_URL}/retrieve_profile?user_id=${USER_ID}`;
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
            setTempDetails({ name: name, phone: phone_number });
        } catch (error) {
            console.log("error in profile page")
            console.log(error);
        }
    }

    const updateUser = async () => {
        try {
          const response = await fetch(`${API_URL}/update_profile`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              'User-ID': USER_ID,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempDetails),
          });
      
          if (response.ok) {
            console.log('User Settings updated successfully');
          } else {
            console.log('Error while updating User Settings:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };

    const updateName = (newName) => {
        setTempDetails({ ...tempDetails, name: newName})
    }

    const updatePhoneNumber = (newNumber) => {
        setTempDetails({ ...tempDetails, phone: newNumber})
    }



    const saveDetails = () => {
        // Show success 
        if(validateDetails()){
          setUser({...user, name: tempDetails.name.trim(), phone: tempDetails.phone})
          updateUser()
          toast.show({
              description: "User details updated!",
              placement: "top",
              alignItems: "center"
          })
        } else {
          console.log("invalid details");
          toast.show({
            description: "Invalid Details",
            placement: "top",
            alignItems: "center"
          })
          setTempDetails({ name: user.name, phone: user.phone });
        }
    }

    const validateDetails = () => {
      // Validates details. If details are valid, send formData object to onSignupPress.
      foundErrors = {};
      if(!tempDetails.name || tempDetails.name == ""){
          foundErrors = { ...foundErrors, name: 'Name is required' }
      }

      if (!validPhoneNumber(tempDetails.phone)) {
        foundErrors = { ...foundErrors, phoneNumber: 'Phone number is invalid' }
      }

      setErrors(foundErrors);

      console.log(foundErrors)

      // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
      return Object.keys(foundErrors).length === 0;
    }

    return (
      <View >
        <Box h={165} backgroundColor={colors.background} borderRadius={10} marginBottom='5%'>
        <Box padding={3}>
        <HStack justifyContent="space-between" marginBottom={3}>
        <Heading
          fontSize="md"
          color={colors.primary}
          pr={WINDOW_WIDTH / 3.5}
        >
          User Details
        </Heading>
        <TouchableOpacity onPress={saveDetails} fontSize="100%">
          <Text color={"#007AFF"} fontSize="md">Save</Text>
        </TouchableOpacity>
        </HStack>
        
        <HStack justifyContent="space-between"  marginBottom='1%'>

        <Text color={colors.text} fontSize="md">Name </Text>
        <Spacer width={5}/>
		    <Input 
            _input={{selectionColor: colors.primary}} 
            color={colors.text}
            placeholder={user.name}
            onEndEditing={(e) => updateName(e.nativeEvent.text)}
            width={textInputWidth} 
            textAlign="right" 
            variant={"unstyled"}/>

        </HStack>

        <HStack justifyContent="space-between"  marginBottom='1%'>
        <Text color={colors.text} fontSize="md">Phone</Text>
        <Spacer width={5}/>

		    <Input 
            _input={{selectionColor: colors.primary}} 
            color={colors.text}
            keyboardType="numeric" 
            maxLength={10} 
            placeholder={user.phone}
            onEndEditing={(e) => updatePhoneNumber(e.nativeEvent.text)}
            width={textInputWidth} 
            textAlign="right" 
            variant={"unstyled"}/>

        </HStack>        
        
        <HStack justifyContent="space-between"  marginBottom='1%'>
        <Text color={colors.text} fontSize="md">Email</Text>
        <Text color={colors.text} width={textInputWidth} textAlign="right">{user.email} </Text>
        </HStack>
        </Box>  
        </Box>

      </View>
    );
  }
  
  export default UserDetails;