import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text, ScrollView, Button, Box, Image, View, Heading, VStack, HStack } from 'native-base';
import { Dimensions } from 'react-native';
import { IP, PORT } from "@env";



export default function SightingsPage({navigation: { navigate }, route}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    
    const {headers} = route.params;
    const ownerId = headers["userid"];
    const accessToken = headers["accesstoken"]

    // console.log("Sighting: " + user);
  
    return (
        <ScrollView>
            {/* TODO: fix this button at the top  */}
            <Box alignItems="center" bg="#FFFFFF">
                <Box height={3}/>
                <Button
                bg="#FA8072"
                onPress={() => navigate('New Sighting Page')} 
                width={windowWidth - 60}
                height="40px"
                >
                Add New Sighting
                </Button>

                <Box height={3}/>
            </Box>

            {/* TODO: all sightings go below */}


        </ScrollView>
    )
}