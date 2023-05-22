import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function MapPage(user) {
    const IP="http://118.138.82.228"
    const PORT=5000
    const navigation = useNavigation();

    console.log("Map: " + user);
    console.log(IP);
    console.log(PORT);
      

    return (<Text>Map page</Text>)
}