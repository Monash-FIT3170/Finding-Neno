import React from 'react';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { ScrollView, Button, Box, Image, View, Heading, VStack, HStack, Text } from 'native-base';
import {Dimensions} from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Color } from "../components/atomic/Theme";

import Report from "../components/Report";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";


export default function ReportPage({ navigation: { navigate}}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const isFocused = useIsFocused();
    
    const image = "https://wallpaperaccess.com/full/317501.jpg";
    const petImage = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq"

    const [reports, setReports] = useState([]);


    useEffect(() => {
      if (isFocused) {
        fetchAllReports();
      }
    }, [isFocused]);
  
    const fetchAllReports = async () => {
      try {
        const url = `${IP}:${PORT}/get_missing_reports?owner_id=${USER_ID}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setReports(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    const owner = {
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

        
    </Box>
    </ScrollView>
    
    )
}