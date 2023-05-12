import { Box, Center, Heading, VStack, HStack, FormControl, Input, Link, Button, Text } from "native-base";
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import {validEmail} from "./validation"
import { useState } from "react";
import { IP, PORT } from "@env";

const LoginPage = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  
  const onLoginPress = (formData) => {
    const url = `${IP}:${PORT}/login`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status == 200) {
          navigation.navigate('Tab Navigator', { screen: 'Dashboard' });
        } else {
          setErrors({
            email: 'Email or password is invalid',
            password: 'Email or password is invalid'
          });
        }
      })
      .catch((error) => alert(error));
  };

  const validateDetails = () => {
    // Validates details. If details are valid, send formData object to onLoginPress.
    foundErrors = {};
  
    if (!formData.email) {
      foundErrors = {...foundErrors, email: 'Email is required'}
    } else if (!validEmail(formData.email)) {
        foundErrors = {...foundErrors, email: 'Email is invalid'}
      }
    
    if (!formData.password || formData.password == "") {
      foundErrors = {...foundErrors, password: 'Password is required'}
    }

    setErrors(foundErrors);

    if (Object.keys(foundErrors).length === 0) {
      // no errors!
      onLoginPress(formData)
    }
  }

  return (
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
            Welcome to Finding Neno!
          </Heading>
          <VStack space={3} mt="5">

            <FormControl isInvalid={'email' in errors}>
              <FormControl.Label>Email</FormControl.Label>
              <Input onChangeText={value => setFormData({...formData, email: value})} />
              {'email' in errors && <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>}
            </FormControl>

            <FormControl isInvalid={'password' in errors}>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" onChangeText={value => setFormData({...formData, password: value})} />
              {'password' in errors && <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>}
              <Link
                _text={{
                  fontSize: "xs",
                  fontWeight: "500",
                  color: Color.NENO_BLUE,
                }}
                alignSelf="flex-end"
                mt="1"
                href=""
                onPress={() => {
                  navigation.navigate("ForgotPassword");
                }}
              >
                Forgot Password
              </Link>
            </FormControl>
            
            <Button mt="2" bgColor={Color.NENO_BLUE} onPress={validateDetails}>
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                New user?{" "}
              </Text>
              <Link
                _text={{
                  color: Color.NENO_BLUE,
                  fontWeight: "medium",
                  fontSize: "sm",
                }}
                href=""
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >
                Sign Up
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default LoginPage;
