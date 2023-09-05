import { Box, Button, Center, FormControl, Heading, HStack, Icon, Input, KeyboardAvoidingView, Link, VStack, Pressable, Text} from "native-base";
import { StyleSheet } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { NavigationContainer, useNavigation  } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import {validEmail} from "./validation"
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";
import { login } from "../store/user";


const LoginPage = () => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [show, setShow] = useState(false);
	const [buttonText, setButtonText] = useState("Sign in")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const dispatch = useDispatch();
	const { IP, PORT } = useSelector((state) => state.api);

	const navigation = useNavigation();
	
	const onLoginPress = () => {
		setIsButtonDisabled(true); 
		setButtonText("Signing in...");  

		let isValid = validateDetails(formData);
		if (isValid) {
			const url = `${IP}:${PORT}/login`;
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
			.then((res) => {
				if (res.status == 200|| res.status == 201) {
					payload = {
						USER_ID: res.headers.map.userid,
						ACCESS_TOKEN: res.headers.map.accesstoken,
					}
					dispatch(login(payload));
					console.log(store.getState());
					
				} else {
					setErrors({
						email: 'Email or password is invalid',
						password: 'Email or password is invalid'
					});
				}
			})
			.catch((error) => alert(error))
    	}

		setButtonText("Sign in"); 
		setIsButtonDisabled(false);
  	};

  	const validateDetails = (formData) => {
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

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
    	return Object.keys(foundErrors).length === 0;
  	}

  	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      		<Box flex={1} alignItems="center" justifyContent="center">
				<Center w="100%">
					<Box safeArea p="2" py="8" w="90%" maxW="290">
						<Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50",}}>
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
								<Input type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
								<Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
								</Pressable>} onChangeText={value => setFormData({...formData, password: value})} />
								{'password' in errors && <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>}

								<Link _text={styles.actionButton} alignSelf="flex-end" mt="1" href="" 
									onPress={() => { navigation.navigate("ForgotPassword");}}> Forgot Password </Link>
							</FormControl>
			
							<Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onLoginPress}>
								{buttonText}
							</Button>
							<HStack mt="6" justifyContent="center">
								<Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>New user?{" "}</Text>
								<Link _text={styles.actionButton}href=""
									onPress={() => { navigation.navigate("Signup"); }}>Sign Up</Link>
							</HStack>
						</VStack>
					</Box>
				</Center>
			</Box>
    </KeyboardAvoidingView>
)};

const styles = StyleSheet.create({
	actionButton: { 
		color: Color.NENO_BLUE, 
		fontWeight: "medium", 
		fontSize: "sm"
	}
})

export default LoginPage;
