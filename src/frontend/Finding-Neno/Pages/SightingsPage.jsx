import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function SightingsPage({route}) {
    const IP="http://118.138.82.228"
    const PORT=5000
    const navigation = useNavigation();
    const {user} = route.params;

    console.log("Sighting: " + user);
  
    return (<Text>Sightings page</Text>)
}