import React from 'react';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { ScrollView, Button, Box, Image, View, Heading, VStack, HStack, Text } from 'native-base';
import {Dimensions, SafeAreaView} from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Color } from "../components/atomic/Theme";
import { FAB } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import Report from "../components/Report";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";


export default function ReportsPage({ navigation: { navigate}}) {
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
        fetchUserReports();
      }
    }, [isFocused]);
  
    const fetchUserReports = async () => {
      try {
        const url = `${IP}:${PORT}/get_missing_reports?author_id=${USER_ID}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'User-ID': USER_ID
            },
        });
        const data = await response.json();
        setReports(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <StatusBar style="auto" />
      <ScrollView height="100%">
        <Box alignItems="center" bg="#FFFFFF" marginTop={2}>

          <>
            {reports && reports.map((report, index) => (
              <Report userId={USER_ID} report={report} key={index} />
            ))}
          </>
        </Box>
      </ScrollView>
      <FAB 
        icon={'plus'}
        onPress={() => navigate('New Report')}
        visible={true}
        style={[{position: 'absolute', bottom: 16, right: 16}]}
      />
    </SafeAreaView>

  )
}