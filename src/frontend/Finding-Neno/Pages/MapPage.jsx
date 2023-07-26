import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import store from "../store/store";

export default function MapPage() {
    const IP = store.getState().IP;
    const PORT = store.getState().PORT;
    const USER_ID = store.getState().userId;
    const ACCESS_TOKEN = store.getState().accessToken;
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    return (<Text>Map page</Text>)
}