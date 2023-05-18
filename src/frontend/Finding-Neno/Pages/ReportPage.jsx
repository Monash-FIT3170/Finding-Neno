import React from 'react';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { ScrollView, Button, Box } from 'native-base';
import {Dimensions} from 'react-native';

import Report from "../components/Report";

export default function ReportPage({ navigation: { navigate}}, {route}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    //const {ownerId, accessToken} = route.params;

    return (
    <ScrollView>
    <Box alignItems="center" bg="#FFFFFF" height={windowHeight}>
        <Box height={3}/>
        <Button
        bg="#FA8072"
        onPress={() => navigate('New Report Page')} 
        width={windowWidth - 60}
        height="40px"
        >
        Add New Report
        </Button>

        <Box height={3}/>

        <Report windowWidth={windowWidth}/>
        <Box height={1}/>
        <Report windowWidth={windowWidth}/>
        <Box height={1}/>
        <Report windowWidth={windowWidth}/>
        <Box height={1}/>
        <Report windowWidth={windowWidth}/>
        <Box height={1}/>
        
    </Box>
    </ScrollView>
    
    )
}