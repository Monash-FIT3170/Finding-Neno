import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';

export default function DashboardPage({route}) {
    const navigation = useNavigation();
    const {user} = route.params;

    console.log(user)

    return (<Text>Dashboard page</Text>)
}