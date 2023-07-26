import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import store from "../store/store";


export default function SightingsPage() {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

	const IP = useSelector((state) => state.IP);
	const PORT = useSelector((state) => state.PORT);
    const USER_ID = useSelector((state) => state.userId);
    const ACCESS_TOKEN = useSelector((state) => state.accessToken);
    

    console.log("Sighting: " + user);
  
    return (<Text>Sightings page</Text>)
}