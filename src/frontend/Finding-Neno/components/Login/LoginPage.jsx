import { Box, Center, Heading, VStack, HStack, FormControl, Input, Link, Button, Text } from "native-base";

import { Color } from "../atomic/Theme";
import { useState } from "react";

const LoginPage = ({ onLoginPress, onSwitchPress }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validateDetails = () => {
    // Validates details. If details are valid, send formData object to onLoginPress.
    foundErrors = {};

    if (!formData.email.includes('@')) {
      foundErrors = {...foundErrors, email: 'Email is invalid'}
    }
    if (!formData.email || formData.email == "") {
      foundErrors = {...foundErrors, email: 'Email is required'}
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
              onPress={onSwitchPress}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginPage;