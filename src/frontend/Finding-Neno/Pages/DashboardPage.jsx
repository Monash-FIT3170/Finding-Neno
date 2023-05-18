import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';

export default function DashboardPage({route}) {
    const navigation = useNavigation();
    //const {ownerId, accessToken} = route.params;

    return (<Text>Dashboard page</Text>)
}