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
                        Password Reset
                    </Heading>

                    <Button mt="2" bgColor={Color.NENO_BLUE} onPress={validateDetails}>
                        Reset Password
                    </Button>

                </Box>
            </Center>
        </Box>
    );
};

export default ForgotPasswordPage;