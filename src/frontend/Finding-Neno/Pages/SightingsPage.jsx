import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text, Dimensions } from 'react-native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, ScrollView, Alert, KeyboardAvoidingView } from "native-base";
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import store from "../store/store";
import Sighting from '../components/Sighting';
import { StatusBar } from 'expo-status-bar';

export default function SightingsPage({navigation: {navigate}}) {

    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    const isFocused = useIsFocused();

	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [myReportSightings, setMyReportSightings] = useState([]);

    useEffect(() => {
		if (isFocused) {
			fetchMyReportSightings();
		}
	}, [isFocused]);


    const fetchMyReportSightings = async () => {
        try {
                const url = `${IP}:${PORT}/get_my_report_sightings`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                        'User-ID': USER_ID,
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
    
                const data = await response.json();
                setMyReportSightings(data[0]);
            } catch (error) {
                console.error(error);
            }
      };
    

    // TODO: display saved sightings here too (if any)
  
    return (
        <ScrollView style={{backgroundColor: '#EDEDED'}}>
            <StatusBar style="auto" />

            {myReportSightings 
            ? 
                myReportSightings.map((sighting, index) => (
                    <Sighting userId={USER_ID} sighting={sighting} key={index}/>
                ))
            : 
                <Text>No sightings yet!</Text>}
        </ScrollView>
    )
}