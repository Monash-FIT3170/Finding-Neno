import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text} from 'react-native';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from 'react-native';
import { View, Button } from 'native-base';

export default function MapPage() {
	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    const toggleMissingStatus = async () => {
        try {
            petId = 5;
            const response = await fetch(`${IP}:${PORT}/toggle_missing_status`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pet_id: petId }),
            });
    
            if (response.ok) {
                console.log('Status toggled successfully');
                // Perform any necessary updates on the frontend
            } else {
                console.log('Error while toggling status:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
    <View>
    <Button onPress={toggleMissingStatus}>
        TEST BUTTON

    </Button>
    </View>
    )
}