import { 
    Box, 
    Center, 
    Heading, 
    VStack,
    HStack, 
    FormControl,
    Input, 
    Link,
    Button,
    Text} from "native-base";

import { Color } from '../atomic/Theme';


const LoginPage = ({onPress}) => {
    return <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
            color: "warmGray.50"
        }}>
            Welcome to Finding Neno!
            </Heading>
            <VStack space={3} mt="5">
            <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input />
            </FormControl>
            <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input type="password" />
                <Link _text={{
                fontSize: "xs",
                fontWeight: "500",  
                color: Color.NENO_BLUE  
            }} alignSelf="flex-end" mt="1">
                Forgot Password
                </Link>
            </FormControl>
            <Button mt="2" bgColor={Color.NENO_BLUE} onPress={onPress}>
                Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="coolGray.600" _dark={{
                color: "warmGray.200"
            }}>
                New user?{" "}
                </Text>
                <Link 
                _text={{
                color: Color.NENO_BLUE,
                fontWeight: "medium",
                fontSize: "sm"
            }} href="#">
                Sign Up
                </Link>
            </HStack>
            </VStack>
        </Box>
        </Center>;
    };
    
export default LoginPage