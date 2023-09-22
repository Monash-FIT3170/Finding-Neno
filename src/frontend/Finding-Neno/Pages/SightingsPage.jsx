import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text, Dimensions } from 'react-native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, ScrollView, Alert, KeyboardAvoidingView, FlatList} from "native-base";
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import store from "../store/store";
import Sighting from '../components/Sighting';

export default function SightingsPage({navigation: {navigate}}) {

    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    const isFocused = useIsFocused();

	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [myReportSightings, setMyReportSightings] = useState([]);
    const [mySavedSightings, setMySavedSightings] = useState([]);

    const [reloadPage, setReloadPage] = useState(false);

    useEffect(() => {
        fetchMyReportSightings();
        fetchMySavedSightings();
        setReloadPage(false);
	}, [isFocused, reloadPage]);


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

      const fetchMySavedSightings = async () => {
        try {
                const url = `${IP}:${PORT}/retrieve_saved_sightings`;
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
                setMySavedSightings(data[0]);
            } catch (error) {
                console.error(error);
            }
      };
      
    return (
        <ScrollView style={{backgroundColor: '#EDEDED'}}>
            <Text>Sightings of your pets</Text>
            {myReportSightings.length > 0 
            ? 
                myReportSightings.map((sighting, index) => (
                    <Sighting userId={USER_ID} sighting={sighting} key={index} setReloadParent={setReloadPage}/>
                ))
            : 
                <Text>No sightings of your pets yet!</Text>}

            <Text>Saved Sightings</Text>
            {mySavedSightings.length > 0
                ? 
                mySavedSightings.map((sighting, index) => (
                    <Sighting userId={USER_ID} sighting={sighting} key={index} setReloadParent={setReloadPage}/>
                ))
            : 
                <Text>No saved sightings yet!</Text>}

        
            
        </ScrollView>
    )
}