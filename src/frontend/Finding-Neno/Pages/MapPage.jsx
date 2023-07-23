import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function MapPage(user) {
    const navigation = useNavigation();

    console.log("Map: " + user);

    return (<Text>Map page</Text>)
}