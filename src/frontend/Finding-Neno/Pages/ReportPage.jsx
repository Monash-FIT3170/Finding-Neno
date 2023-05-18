import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { ScrollView, Button } from 'native-base';
import { Text } from 'react-native';
import {Dimensions} from 'react-native';

export default function ReportPage({ navigation: { navigate}}, {route}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    //const {ownerId, accessToken} = route.params;

    return (
    <ScrollView>
        <Text>Map page</Text>

        <Button
        onPress={() => navigate('New Report Page')} 
        width={windowWidth - 100}
        height="40px"
        >
        Add New Reprot
        </Button> 
        
    </ScrollView>
    
    )
}