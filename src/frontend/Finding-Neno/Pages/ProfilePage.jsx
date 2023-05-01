import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text, Button, Box, View } from 'react-native';

export default function ProfilePage({ navigation: { navigate}}) {
    const navigation = useNavigation();

    return (
        <View>
            <Button 
                onPress={() => navigate('New Pet Page')} 
                title="Add New Pet"> 
            </Button>
        </View>
        
        
    )
}