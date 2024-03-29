import { Box, Center, Heading, VStack, FormControl, Input, Button, KeyboardAvoidingView } from "native-base";
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { Color } from "../components/atomic/Theme";
import { validEmail } from "./validation"
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";


const ForgotPasswordPage = () => {
	const { API_URL } = useSelector((state) => state.api);
	const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);

	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [buttonText, setButtonText] = useState("Send Reset Code")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const navigation = useNavigation();

	const onForgotPasswordPress = () => {
		setIsButtonDisabled(true);
		setButtonText("Sending reset code...");

		let isValid = validateDetails(formData);
		if (isValid) {

			// Check if email exists in DB



			navigation.navigate("PasswordReset");
		}


		setIsButtonDisabled(false);
		setButtonText("Send Reset Code")
		//alert("forgot password data: " + JSON.stringify(formData));
	};

	const validateDetails = (formData) => {
		// Validates details. If details are valid, send formData object to onForgotPasswordPress.
		foundErrors = {};
		console.log(formData)
		if (!formData.email) {
			foundErrors = { ...foundErrors, email: 'Email is required' }
		} else if (!validEmail(formData.email)) {
			foundErrors = { ...foundErrors, email: 'Email is invalid' }
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
							Forgot Password
						</Heading>

						<VStack space={3} mt="5">

							<FormControl isInvalid={'email' in errors}>
								<FormControl.Label><Text fontWeight={500} color={colors.text}>Email</Text></FormControl.Label>
								<Input _input={{selectionColor: colors.primary}} size="lg" onChangeText={value => setFormData({ ...formData, email: value })} />
								{'email' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>}
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
		</KeyboardAvoidingView>
	);
};

export default ForgotPasswordPage;