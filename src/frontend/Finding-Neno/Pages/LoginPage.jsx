import { Box, Center, FormControl, Heading, HStack, Icon, Input, KeyboardAvoidingView, Link, VStack, Pressable, Text, WarningOutlineIcon, View } from "native-base";
import { Dimensions, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from "react-native-paper";
import { useTheme } from '@react-navigation/native'

import { Color } from "../components/atomic/Theme";
import { validEmail, validPhoneNumber } from "./validation"
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";
import { login } from "../store/user";

const LoginPage = () => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [buttonText, setButtonText] = useState("Sign in")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const dispatch = useDispatch();
	const { API_URL } = useSelector((state) => state.api);

	const navigation = useNavigation();
	const { colors } = useTheme();
	

	const onLoginPress = () => {
		setIsButtonDisabled(true);
		setButtonText("Signing in...");

		let isValid = validateDetails(formData);
		if (isValid) {
			const url = `${API_URL}/login`;
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
				.then((res) => {
					if (res.status == 200 || res.status == 201) {
						payload = {
							USER_ID: res.headers.map.userid,
							ACCESS_TOKEN: res.headers.map.accesstoken,
						}
						dispatch(login(payload));
						console.log(store.getState());

					} else {
						setErrors({
							username: 'Email / phone number or password is invalid',
							password: 'Email / phone number or password is invalid'
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

		if (!formData.username) {
			foundErrors = { ...foundErrors, username: 'Email or phone number is required' }
		} else if (!validEmail(formData.username) && !validPhoneNumber(formData.username)) {
			foundErrors = { ...foundErrors, username: 'Email or phone number is invalid' }
		}

		if (!formData.password || formData.password == "") {
			foundErrors = { ...foundErrors, password: 'Password is required' }
		}

		setErrors(foundErrors);

		// true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
		return Object.keys(foundErrors).length === 0;
	}

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50, justifyContent: 'center', height: '100%', backgroundColor: colors.background }}
			resetScrollToCoords={{ x: 0, y: 0 }}
			scrollEnabled={true}
			bounces={false}
			enableAutomaticScroll={true}
			extraScrollHeight={30}>
			<StatusBar style="auto" />


			<SafeAreaView style={{ alignItems: 'center', justifyContent: 'center' }}>
				<VStack style={{ alignItems: 'center', maxWidth: 350 }}>
					<Heading size="2xl" fontWeight="700" color={colors.primary}>
						Finding Neno
					</Heading>
					<VStack space={3} mt="5" width='100%'>
						<FormControl isRequired isInvalid={'username' in errors}>
							<FormControl.Label>Email / Phone Number</FormControl.Label>
							<Input color={colors.text} size="lg" width='100%' onChangeText={value => setFormData({ ...formData, username: value })} />
							{'username' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.username}</FormControl.ErrorMessage>}
						</FormControl>

						<FormControl isRequired isInvalid={'password' in errors}>
							<FormControl.Label>Password</FormControl.Label>
							<Input color={colors.text} size="lg" width='100%' type={showPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowPassword(!showPassword)}>
								<Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
							</Pressable>} onChangeText={value => setFormData({ ...formData, password: value })} />
							{'password' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>}

							{/* <Link _text={styles.actionButton} alignSelf="flex-end" mt="1" href=""
								onPress={() => { navigation.navigate("ForgotPassword"); }}> Forgot Password </Link> */}
						</FormControl>


						<Button buttonColor={Color.NENO_BLUE} style={{marginTop: 15}} mode="contained" disabled={isButtonDisabled} opacity={!isButtonDisabled ? 1 : 0.6} onPress={onLoginPress}>
							{buttonText}
						</Button>
						<HStack mt="6" justifyContent="center">
							<Text fontSize="sm" color={colors.text}>New user?{" "}</Text>
							<Link _text={styles.actionButton} href=""
								onPress={() => { navigation.navigate("Signup"); }}>Sign Up</Link>
						</HStack>
					</VStack>
				</VStack>
			</SafeAreaView>
		</KeyboardAwareScrollView>
	)
};

const styles = StyleSheet.create({
	actionButton: {
		color: Color.NENO_BLUE,
		fontWeight: "medium",
		fontSize: "sm"
	}
})

export default LoginPage;
