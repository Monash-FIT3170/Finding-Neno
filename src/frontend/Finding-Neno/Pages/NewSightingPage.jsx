import { useNavigation } from '@react-navigation/native';
import { Box, Center, Heading, VStack, FormControl, Input, Button, Select, Alert, Text, KeyboardAvoidingView } from "native-base";

import React, { useEffect, useState } from 'react';
import { Color } from "../components/atomic/Theme";
import { IP, PORT } from "@env";
import { validDateTime, validateCoordinates } from "./validation"

const AlertComponent = ({ onClose }) => (
	<Alert w="100%" status="success">
		<VStack space={1} flexShrink={1} w="100%" alignItems="center">
			<Alert.Icon size="md" />
			<Text fontSize="md" fontWeight="medium" _dark={{ color: "coolGray.800" }}>
				Your sighting has been added!
			</Text>
			<Button mt="2" bgColor={Color.NENO_BLUE} onPress={onClose}>
				Close
			</Button>
		</VStack>
	</Alert>
);

const NewSightingPage = ({navigation: {navigate}, route }) => {

    const navigation = useNavigation();
    const { headers } = route.params;
    const ownerId = headers["userid"];
	const accessToken = headers["accesstoken"];

    const [formData, setFormData] = useState({ description: '' });
	const [errors, setErrors] = useState({});
	const [isCreated, setIsCreated] = useState(false);
	const [buttonText, setButtonText] = useState("Add sighting")
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const [selectedDatetime, setSelectedDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

    return (
    <Text>testing sighting</Text>
    );

}

export default NewSightingPage;