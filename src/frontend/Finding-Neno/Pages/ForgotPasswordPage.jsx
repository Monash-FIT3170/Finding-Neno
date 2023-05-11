import { Box, Center, Heading, VStack, HStack, FormControl, Input, Link, Button, Text } from "native-base";
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import {validEmail} from "./validation"
import { useState } from "react";
import { IP, PORT } from "@env";

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
    
        if (!formData.email || formData.email == "") {
          foundErrors = {...foundErrors, email: 'Email is required'}
        } else if (!validEmail(formData.email)) {
          foundErrors = {...foundErrors, email: 'Email is invalid'}
        }
    
        setErrors(foundErrors);
    
        if (Object.keys(foundErrors).length === 0) {
          // no errors!
          onForgotPasswordPress(formData)
        }
      }

    return (
    );
};

export default ForgotPasswordPage;