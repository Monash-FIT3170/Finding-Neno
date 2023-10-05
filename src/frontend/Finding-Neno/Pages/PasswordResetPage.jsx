import { Box, Center, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import {validEmail} from "./validation"
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";



const PasswordResetPage = () => {

	const { API_URL } = useSelector((state) => state.api);
	
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
	const [show, setShow] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [buttonText, setButtonText] = useState("Set password")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const navigation = useNavigation();

	var resetCodeAttempts = 3;
    
	// TODO
	// Password should be hashed before calling API?


    const onPasswordResetPress = (formData) => {
		setIsButtonDisabled(true);
		setButtonText("Setting password...");

		let isValid = validateDetails(formData);
		if (isValid) {
			const url = `${API_URL}/reset_password`
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
			.then((res) => {
				// something
			})
			.catch((error) => {
				alert(error);
			})
		}


		setButtonText("Set Password");
		setIsButtonDisabled(false);


    	alert("password reset data: " + JSON.stringify(formData));
    };

    const validateDetails = (formData) => {
      // Validates details. If details are valid, send formData object to onPasswordResetPress.
    	foundErrors = {};
  
		if (!formData.resetCode || formData.resetCode == "") {
			foundErrors = {...foundErrors, resetCode: 'Reset Code is required'}
		}

		// If reset code is wrong
		// resetCodeAttempts -= 1

		if (resetCodeAttempts == 0) {
			foundErrors = {...foundErrors, resetCode: "Out of attempts. Generate a new code"}
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
	
		return Object.keys(foundErrors).length === 0;
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
							Password Reset
						</Heading>


						<VStack space={3} mt="5">

							<FormControl isInvalid={'resetCode' in errors}>
								<FormControl.Label>Reset Code</FormControl.Label>
								<Input onChangeText={value => setFormData({...formData, resetCode: value})} />
								{'resetCode' in errors && <FormControl.ErrorMessage>{errors.resetCode}</FormControl.ErrorMessage>}
							</FormControl>

							<FormControl isInvalid={'password' in errors}>
								<FormControl.Label>Password</FormControl.Label>
								<Input type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}> 
								<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
								</Pressable>} onChangeText={value => setFormData({...formData, password: value})} />
								{'password' in errors && <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>}
							</FormControl>

							<FormControl isInvalid={'confirmPassword' in errors}>
								<FormControl.Label>Confirm Password</FormControl.Label>
								<Input type={showConfirm ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowConfirm(!showConfirm)}> 
								<Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
								</Pressable>} onChangeText={value => setFormData({...formData, confirmPassword: value})} />
								{'confirmPassword' in errors && <FormControl.ErrorMessage>{errors.confirmPassword}</FormControl.ErrorMessage>}
							</FormControl>

							<Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onPasswordResetPress}>
								{buttonText}
							</Button>

						</VStack>
					</Box>
				</Center>
			</Box>
		</KeyboardAvoidingView>
    );
};

export default PasswordResetPage;