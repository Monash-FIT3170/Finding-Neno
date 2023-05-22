import React from 'react';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { ScrollView, Button, Box } from 'native-base';
import {Dimensions} from 'react-native';
import { IP, PORT } from "@env";

import Report from "../components/Report";

export default function ReportPage({ navigation: { navigate}}, {route}) {
    const IP="http://118.138.82.228"
    const PORT=5000

    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    //const {ownerId, accessToken} = route.params;
    
    console.log("Report: " + user);

    const user = {
        name: "Human Being",
        image: "https://wallpaperaccess.com/full/317501.jpg",
        phone: "0412 345 678"
    };

    const pet1 = {
        name: "Peanutbutter",
        species: "Dog",
        breed: "Labrador",
        desc: "Is this a crossever episode and i am testing that this is wrapping around",
        lastSeen: "3:00 pm, 18/05/2023",
        lastKnownLocation: "Clayton"
    };

    const pet2 = {
        name: "Princess Carolyn",
        species: "Cat",
        breed: "Manager",
        desc: "Is this a crossever episode and i am testing that this is wrapping around",
        lastSeen: "3:00 pm, 18/05/2023",
        lastKnownLocation: "Clayton"
    };

    return (
    <ScrollView>
    <Box alignItems="center" bg="#FFFFFF">
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

        <Report windowWidth={windowWidth} user={user} pet={pet1}/>
        <Box height={5}/>
        <Report windowWidth={windowWidth} user={user} pet={pet2}/>
        <Box height={5}/>
        
    </Box>
    </ScrollView>
    
    )
}