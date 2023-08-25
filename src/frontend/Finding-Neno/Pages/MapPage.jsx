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

    const handleTestButtonPress = async () => {
        try {
            const petId = 1; // Replace with the actual pet ID you want to retrieve reports for
            const response = await fetch(`${IP}:${PORT}/get_reports_by_pet?pet_id=${petId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Reports for pet:', data);
                // You can update your state or perform any other actions with the data
            } else {
                console.log('Error while fetching reports:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
    <View>
    <Button onPress={handleTestButtonPress}>
        TEST BUTTON

    </Button>
    </View>
    )
}