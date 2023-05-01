import { Box, Center, Heading, VStack, HStack, FormControl, Input, Link, Button, Text } from "native-base";
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import { validEmail } from "./validation";
import { useState } from "react";
import { IP, PORT } from "@env";

const SignupPage = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  const navigation = useNavigation();

  const onSignupPress = async (formData) => {
    const url = `${IP.toString()}:${PORT.toString()}/insert_user`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status == 201) {
          alert("inserted user successfully");
        }
      })
      .catch((error) => alert(error));
  };

  const validateDetails = () => {
    // Validates details. If details are valid, send formData object to onSignupPress.
    foundErrors = {};

    if (!formData.email || formData.email == "") {
      foundErrors = {...foundErrors, email: 'Email is required'}
    } else if (!validEmail(formData.email)) {
      foundErrors = {...foundErrors, email: 'Email is invalid'}
    }

    if (!formData.phoneNumber || formData.phoneNumber == "") {
      foundErrors = {...foundErrors, phoneNumber: 'Phone number is required'}
    }

    if (!formData.password || formData.password == "") {
      foundErrors = {...foundErrors, password: 'Password is required'}
    }

    if (!formData.confirmPassword || formData.confirmPassword == "") {
      foundErrors = {...foundErrors, confirmPassword: 'Password confirmation is required'}
    }

    if (formData.confirmPassword !== formData.password) {
      foundErrors = {...foundErrors, confirmPassword: 'Passwords must match'}
    }

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      // no errors!
      onSignupPress(formData)
    }
  }
  return (
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
          Signup Page
        </Heading>
        <VStack space={3} mt="5">
          
          <FormControl isInvalid={'email' in errors}>
            <FormControl.Label>Email</FormControl.Label>
            <Input onChangeText={value => setFormData({...formData, email: value})} />
            {'email' in errors && <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>}
          </FormControl>

          <FormControl isInvalid={'phoneNumber' in errors}>
            <FormControl.Label>Phone Number</FormControl.Label>
            <Input keyboardType="numeric" onChangeText={value => setFormData({...formData, phoneNumber: value})} />
            {'phoneNumber' in errors && <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>}
          </FormControl>

          <FormControl isInvalid={'password' in errors}>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChangeText={value => setFormData({...formData, password: value})} />
            {'password' in errors && <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>}
          </FormControl>

          <FormControl isInvalid={'confirmPassword' in errors}>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" onChangeText={value => setFormData({...formData, confirmPassword: value})} />
            {'confirmPassword' in errors && <FormControl.ErrorMessage>{errors.confirmPassword}</FormControl.ErrorMessage>}
          </FormControl>

          <Button mt="2" bgColor={Color.NENO_BLUE} onPress={validateDetails}>
            Sign up
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Existing user?{" "}
            </Text>
            <Link
              _text={{
                color: Color.NENO_BLUE,
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => {
                navigation.navigate("SignupPage");
              }}
            >
              Sign In
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignupPage;
