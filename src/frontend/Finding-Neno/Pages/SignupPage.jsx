import { Box, Center, FormControl, Heading, HStack, Icon, Input, KeyboardAvoidingView, Link, VStack, Pressable, Text, Alert, Modal, WarningOutlineIcon, useToast } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native';
import { Button } from "react-native-paper";

import { Color } from "../components/atomic/Theme";
import { validEmail, validPhoneNumber, validatePassword } from "./validation";
import { useState } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
	const [showAccountExistsModal,setShowAccountExistsModal] = useState(false);

	const toast = useToast();

	const {API_URL} = useSelector((state) => state.api)

	const navigation = useNavigation();
	const { colors } = useTheme();

	const onSignupPress = async () => {
		setIsButtonDisabled(true);
		setButtonText("Signing up...")

		let isValid = validateDetails(formData);
		if (isValid) {
			const url = `${API_URL}/insert_user`;

			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})

			if (res.status == 201) {
				toast.show({
					title: "Account Created",
					description: "Your account has been created successfully!",
					placement: "top",
					alignItems: "center"
				})
				
				navigation.navigate("Login");
			}
			else if (res.status == 409) {
				toast.show({
					title: "Account Already Exists",
					description: "An account with the email address already exists.",
					placement: "top",
					alignItems: "center",
					
				})
			}
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
		else {
			const passwordError = validatePassword(formData.password);
			if (passwordError) {
				foundErrors = { ...foundErrors, password: passwordError }
			}
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

	const redirectToLogin = () => {
		setShowAccountExistsModal(false);
	}

	return (		
		<KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={{paddingVertical: 50, height: '100%'}}>
			<SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
				<VStack style={{ width: 300 }}>
					<Heading
						size="lg"
						fontWeight="600"
						color={colors.primary}
					>
						Sign Up
					</Heading>
					<VStack space={3} mt="5">

						<FormControl isRequired isInvalid={'name' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Name</Text></FormControl.Label>
							<Input width='100%' color={colors.text} size="lg" onChangeText={value => setFormData({ ...formData, name: value.trim() })} />
							{'name' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.name}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired isInvalid={'email' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Email</Text></FormControl.Label>
							<Input width='100%' color={colors.text} size="lg" autoCapitalize="none" keyboardType="email-address" onChangeText={value => setFormData({ ...formData, email: value })} />
							{'email' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired isInvalid={'phoneNumber' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Phone Number</Text></FormControl.Label>
							<Input width='100%' color={colors.text} size="lg" keyboardType="phone-pad" maxLength={10} onChangeText={value => setFormData({ ...formData, phoneNumber: value })} />
							{'phoneNumber' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired isInvalid={'password' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Password</Text></FormControl.Label>
							<Input width='100%' color={colors.text} size="lg" type={showPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowPassword(!showPassword)}>
								<Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
							</Pressable>} onChangeText={value => setFormData({ ...formData, password: value })} />
							{'password' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired isInvalid={'confirmPassword' in errors}>
							<FormControl.Label><Text fontWeight={500} color={colors.text}>Confirm Password</Text></FormControl.Label>
							<Input width='100%' color={colors.text} size="lg" type={showConfirmPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
								<Icon as={<MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
							</Pressable>} onChangeText={value => setFormData({ ...formData, confirmPassword: value })} />
							{'confirmPassword' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.confirmPassword}</FormControl.ErrorMessage>}
						</FormControl>

						<Button buttonColor={Color.NENO_BLUE} mode="contained" style={{marginTop: 15}} disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onSignupPress}>
							{buttonText}
						</Button>

						<HStack mt="6" justifyContent="center">
							<Text
								fontSize="sm"
								color={colors.text}
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
			</SafeAreaView>
		</KeyboardAwareScrollView>
		// </>
		// </TouchableWithoutFeedback>
	);
};

function AccountExistsModal({modalVisible, onClose}) {
	return <Modal isOpen={modalVisible} onClose={onClose} size={"md"}>
		<Modal.Content >
			<Modal.CloseButton />
			<Modal.Header>Account Already Exists</Modal.Header>
			<Modal.Body>
				<Text>You already have an account with this email or phone number.</Text>
			</Modal.Body>

			<Modal.Footer>
				<Button.Group space={2}>
					<Button variant="ghost" onPress={onClose} >
						Ok
					</Button>
				</Button.Group>
			</Modal.Footer>
		</Modal.Content>
	</Modal>
}

const styles = StyleSheet.create({
	actionButton: {
		color: Color.NENO_BLUE,
		fontWeight: "medium",
		fontSize: "sm"
	}
})

export default SignupPage;
