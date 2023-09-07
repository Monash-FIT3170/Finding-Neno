import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text, Dimensions } from 'react-native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, ScrollView, Alert, KeyboardAvoidingView } from "native-base";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

export default function SightingsPage({navigation: {navigate}}) {

    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    

    // TODO: display saved sightings + sightings linked to user's own reports here 
  
    return (
        <ScrollView>
            {/* TODO: freeze this button to the top of page */}
            <Box alignItems="center" bg="#FFFFFF">
                <Box height={3}/>
                <Button
                bg="#FA8072"
                // onPress={() => navigate('New Sighting Page')} 
                width={windowWidth - 60}
                height="40px"
                >
                Add New Sighting
                </Button>

                <Box height={3}/>
            </Box>

            {/* TODO: all sightings go below */}


        </ScrollView>
    )
}