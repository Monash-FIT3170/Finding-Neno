import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";


export default function SightingsPage({route}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    
    const {headers} = route.params;
    const ownerId = headers["userid"];
    const accessToken = headers["accesstoken"]

    console.log("Sighting: " + user);
  
    return (<Text>Sightings page</Text>)
}