import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ScrollView, Button, Box, Image, View, Heading, VStack, HStack, Text } from 'native-base';
import { Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Color } from "../components/atomic/Theme";
import { Appbar, FAB, Provider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import Report from "../components/Report";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";

import ReportsList from '../components/ReportsList';

export default function ReportsPage({ navigation: { navigate } }) {

    const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const isFocused = useIsFocused();
	const navigation = useNavigation();
	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const [reports, setReports] = useState([]);


	useEffect(() => {
		if (isFocused) {
			fetchUserReports();
		}
	}, [isFocused]);

	const onRefresh = () => {
		fetchUserReports();
	}

	const fetchUserReports = async () => {
		try {
			const url = `${API_URL}/get_missing_reports?author_id=${USER_ID}`;
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
		<Provider>
			<SafeAreaView style={{height: '100%'}}>
				<StatusBar style="auto" />
				<View>
					<ReportsList reports={reports} onRefresh={onRefresh} />
				</View>
				<Portal>
					<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
						actions={[
                            { icon: 'file-document', label: 'New Missing Report', onPress: () => navigate('New Missing Report'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
                            { icon: 'magnify', label: 'New Sighting', onPress: () => navigate('New Sighting'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
						]} />
				</Portal>
			</SafeAreaView>
		</Provider>
	)
}