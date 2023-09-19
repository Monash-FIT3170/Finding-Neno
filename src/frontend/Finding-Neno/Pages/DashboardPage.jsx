import { useNavigation } from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { ActivityIndicator, Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Appbar, FAB, Provider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from 'expo-status-bar';

import { useSelector } from "react-redux";
import ReportsComponent from '../components/ReportsComponent';
import SightingsComponent from '../components/SightingsComponent';

const DashboardPage = () => {
	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const windowWidth = Dimensions.get('window').width;
	const navigation = useNavigation();
	const toast = useToast();
	const isFocused = useIsFocused();

	// TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
	const [reports, setReports] = useState([]);
	//   const [modalVisible, setModalVisible] = useState(false);
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	// const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
	const [sightingImage, setSightingImage] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [tabValue, setTabValue] = useState("reports");
	const [allSightings, setAllSightings] = useState([]);
	const [reportCards, setReportCards] = useState("");
	const [sightingCards, setSightingCards] = useState("");

	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const [routes] = useState([
		{ key: 'reports', title: 'Reports' },
		{ key: 'sightings', title: 'Sightings' },
	])
	const [index, setIndex] = useState(0);

	// 
	// Fetch when tab is changed or page is focused
	useEffect(() => {
		if (isFocused) {
			fetchData();
		}
	}, [isFocused]);

	const onRefresh = () => {
		fetchData();
	}

	const fetchData = () => {
		fetchAllReports();
		// setReportCards(generateReportCards());
		fetchAllSightings();
		// setSightingCards(generateSightingCards());
	}

	// const generateReportCards = () => {
	// 	return (
	// 		reports?.map((report, index) => (
	// 			<Report userId={USER_ID} report={report} key={index} />
	// 		))
	// 	)
	// }

	// const generateSightingCards = () => {
	// 	return (
	// 		allSightings?.map((sighting, index) => (
	// 			<Sighting userId={USER_ID} sighting={sighting} key={index} />
	// 		))
	// 	)
	// }

	const ReportsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{reportCards}
		</ScrollView>
	)

	const SightingsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{sightingCards}
		</ScrollView>
	)

	// API calls 
	const fetchAllReports = async () => {
		try {
			const url = `${IP}:${PORT}/get_missing_reports`;
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

			await response.json().then(data => {
				setReports(data[0]);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchAllSightings = async () => {
		try {
			const url = `${IP}:${PORT}/get_sightings`;
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

			await response.json().then(data => {
				setAllSightings(data[0]);
				console.log(data[0].length)
			});
		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	return (
		<Provider>
			<SafeAreaView style={{ flex: 1, height: '100%' }}>
				<StatusBar style="auto" />
				{/* TABS */}
				<TabView lazy
					navigationState={{ index, routes }}
					renderScene={({ route }) => {
						switch (route.key) {
							case 'reports':
								console.log(reports)
								return <ReportsComponent reports={reports} onRefresh={onRefresh} />;
							case 'sightings':
								return <SightingsComponent sightings={allSightings} onRefresh={onRefresh} />;
							default:
								return null; // TODO: make a view that says "no reports/sightings yet" etc for when theres nothing on the app yet ?
						}
					}}
					onIndexChange={setIndex}
					initialLayout={{ width: windowWidth }}
					renderTabBar={props => <TabBar {...props} style={{ backgroundColor: Color.NENO_BLUE }} />}
				/>

				{/* TODO: fix this - it is not scrolling all the way */}

				<Portal>
					<FAB.Group icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
						actions={[
							{ icon: 'bullhorn', label: 'New Report', onPress: () => navigation.navigate('Dashboard', { screen: 'New Report' }) },
							{ icon: 'eye', label: 'New Sighting', onPress: () => navigation.navigate('Dashboard', { screen: 'New Sighting' }) },
						]} />
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}

export default DashboardPage;