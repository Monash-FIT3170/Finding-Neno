import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

export default function SightingsPage() {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    

    console.log("Sighting: " + user);
  
    return (<Text>Sightings page</Text>)
}