import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function MapPage({route}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    
    const {headers} = route.params;
    const ownerId = headers["userid"];
    const accessToken = headers["accesstoken"]

    console.log("Map: " + user);

    return (<Text>Map page</Text>)
}