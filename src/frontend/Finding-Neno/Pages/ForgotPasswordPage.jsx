import { Box, Center, Heading, VStack, FormControl, Input, Button } from "native-base";
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import {validEmail} from "./validation"
import { useState } from "react";

const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const navigation = useNavigation();

    const onForgotPasswordPress = (formData) => {
        alert("forgot password data: " + JSON.stringify(formData));
      };

    const validateDetails = () => {
      // Validates details. If details are valid, send formData object to onForgotPasswordPress.
      foundErrors = {};
      console.log(formData)
      if (!formData.email) {
        foundErrors = {...foundErrors, email: 'Email is required'}
      } else if (!validEmail(formData.email)) {
        foundErrors = {...foundErrors, email: 'Email is invalid'}
      }
  
      setErrors(foundErrors);
  
      if (Object.keys(foundErrors).length === 0) {
        // no errors!
        onForgotPasswordPress(formData);
        navigation.navigate("PasswordReset");
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
                Forgot Password
            </Heading>

            <VStack space={3} mt="5">

              <FormControl isInvalid={'email' in errors}>
                <FormControl.Label>Email</FormControl.Label>
                <Input onChangeText={value => setFormData({...formData, email: value})} />
                {'email' in errors && <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>}
              </FormControl>

              <Button mt="2" bgColor={Color.NENO_BLUE} 
              onPress={
                validateDetails
              }>
                  Send Reset Code
              </Button>

            </VStack>
          </Box>
        </Center>
      </Box>
    );
};

export default ForgotPasswordPage;