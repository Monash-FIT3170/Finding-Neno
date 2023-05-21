import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function SightingsPage({route}) {
    const navigation = useNavigation();
    const {user} = route.params;

    console.log("Sighting: " + user);

    return (<Text>Sightings page</Text>)
}