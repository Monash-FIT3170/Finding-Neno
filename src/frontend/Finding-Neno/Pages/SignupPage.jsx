import { Box, Button, Center, FormControl, Heading, HStack, Icon, Input, KeyboardAvoidingView, Link, VStack, Pressable, Text, Alert } from "native-base";
import { StyleSheet } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import { validEmail, validPhoneNumber } from "./validation";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

const SignupPage = () => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [isRegistered, setIsRegistered] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [buttonText, setButtonText] = useState("Sign up")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const {IP, PORT} = useSelector((state) => state.api)

	const navigation = useNavigation();

	console.log("SignupPage");

	const onSignupPress = () => {
		setIsButtonDisabled(true);
		setButtonText("Signing up...")

		let isValid = validateDetails(formData);
		if (isValid) {
			const url = `${IP}:${PORT}/insert_user`;

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
				.catch((error) => {
					console.log(error)
					alert(error)
				});
		}

		setButtonText("Sign up");
		setIsButtonDisabled(false);
	};

	const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onSignupPress.
		foundErrors = {};

		if (!formData.name || formData.name == "") {
			foundErrors = { ...foundErrors, name: 'Name is required' }
		}

		if (!formData.email || formData.email == "") {
			foundErrors = { ...foundErrors, email: 'Email is required' }
		} else if (!validEmail(formData.email)) {
			foundErrors = { ...foundErrors, email: 'Email is invalid' }
		}

		if (!formData.phoneNumber || formData.phoneNumber == "") {
			foundErrors = { ...foundErrors, phoneNumber: 'Phone number is required' }
		} else if (!validPhoneNumber(formData.phoneNumber)) {
			foundErrors = { ...foundErrors, phoneNumber: 'Phone number is invalid' }
		}

		if (!formData.password || formData.password == "") {
			foundErrors = { ...foundErrors, password: 'Password is required' }
		}

		if (!formData.confirmPassword || formData.confirmPassword == "") {
			foundErrors = { ...foundErrors, confirmPassword: 'Password confirmation is required' }
		}

		if (formData.confirmPassword !== formData.password) {
			foundErrors = { ...foundErrors, confirmPassword: 'Passwords must match' }
		}

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

	const keyboardVerticalOffset = Platform.OS === 'ios' ? 170 : 0

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
			<Center w="100%">
				<Box safeArea p="2" py="8" w="90%" maxW="290">
					{
						isRegistered ? (
							// TODO: Make this into a component called MyAlert, with headerText, bodyText, link, onLinkPress as props 
							// this will make this file a little less messy 
							<Alert w="100%" status="success">
								<VStack space={1} flexShrink={1} w="100%" alignItems="center">
									<Alert.Icon size="md" />
									<Text fontSize="md" fontWeight="medium" _dark={{
										color: "coolGray.800"
									}}>
										Thanks for signing up!
									</Text>

									<HStack>
										<Link
											_text={{
												color: Color.NENO_BLUE,
												fontWeight: "medium",
												fontSize: "sm",
											}}
											onPress={() => {
												navigation.navigate("Login");
											}}
										>
											Log In
										</Link>
										<Text
											fontSize="sm"
											color="coolGray.600"
											_dark={{
												color: "warmGray.200",
											}}
										>
											{" "}to begin using Finding Neno!
										</Text>
									</HStack>
								</VStack>
							</Alert>
						) : (
							<VStack>
								<Heading
									size="lg"
									fontWeight="600"
									color="coolGray.800"
									_dark={{
										color: "warmGray.50",
									}}
								>
									Sign Up
								</Heading>
								<VStack space={3} mt="5">

									<FormControl isInvalid={'name' in errors}>
										<FormControl.Label>Name</FormControl.Label>
										<Input onChangeText={value => setFormData({ ...formData, name: value })} />
										{'name' in errors && <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>}
									</FormControl>

									<FormControl isInvalid={'email' in errors}>
										<FormControl.Label>Email</FormControl.Label>
										<Input autoCapitalize="none" onChangeText={value => setFormData({ ...formData, email: value })} />
										{'email' in errors && <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>}
									</FormControl>

									<FormControl isInvalid={'phoneNumber' in errors}>
										<FormControl.Label>Phone Number</FormControl.Label>
										<Input keyboardType="numeric" maxLength={10} onChangeText={value => setFormData({ ...formData, phoneNumber: value })} />
										{'phoneNumber' in errors && <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>}
									</FormControl>

									<FormControl isInvalid={'password' in errors}>
										<FormControl.Label>Password</FormControl.Label>
										<Input type={showPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowPassword(!showPassword)}>
											<Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
										</Pressable>} onChangeText={value => setFormData({ ...formData, password: value })} />
										{'password' in errors && <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>}
									</FormControl>

									<FormControl isInvalid={'confirmPassword' in errors}>
										<FormControl.Label>Confirm Password</FormControl.Label>
										<Input type={showConfirmPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
											<Icon as={<MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
										</Pressable>} onChangeText={value => setFormData({ ...formData, confirmPassword: value })} />
										{'confirmPassword' in errors && <FormControl.ErrorMessage>{errors.confirmPassword}</FormControl.ErrorMessage>}
									</FormControl>

									<Button mt="2" bgColor={Color.NENO_BLUE} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onSignupPress}>
										{buttonText}
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
											_text={styles.actionButton}
											onPress={() => {
												navigation.navigate("Login");
											}}
										>
											Sign In
										</Link>
									</HStack>
								</VStack>
							</VStack>
						)}
				</Box>
			</Center>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	actionButton: {
		color: Color.NENO_BLUE,
		fontWeight: "medium",
		fontSize: "sm"
	}
})

export default SignupPage;
