import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';

export default function SightingsPage({route}) {
    const navigation = useNavigation();
    // const {ownerId, accessToken} = route.params;

    return (<Text>Sightings page</Text>)
}