import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import { IP, PORT } from "@env";

export default function DashboardPage({route}) {
    const navigation = useNavigation();
    const {user} = route.params;

    console.log(user)

    return (<Text>Dashboard page</Text>)
}