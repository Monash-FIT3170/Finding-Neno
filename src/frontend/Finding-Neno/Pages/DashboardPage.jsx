import { useNavigation } from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ToggleButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TabBar, TabView } from 'react-native-tab-view';

import { useSelector } from "react-redux";
import Report from '../components/Report';
import Sighting from '../components/Sighting';

const DashboardPage = () => {
	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const windowWidth = Dimensions.get('window').width;
	const navigation = useNavigation();
	const toast = useToast();
	const isFocused = useIsFocused();

	// TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
	const [reports, setReports] = useState([]);
	const [allSightings, setAllSightings] = useState([]);
	const [reportCards, setReportCards] = useState('');
	const [sightingCards, setSightingCards] = useState('');
	//   const [modalVisible, setModalVisible] = useState(false);
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	// const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
	const [sightingImage, setSightingImage] = useState(null);
	const [tabValue, setTabValue] = useState("reports");





	const [routes] = useState([
		{ key: 'reports', title: 'Reports' },
		{ key: 'sightings', title: 'Sightings' },
	])
	const [index, setIndex] = useState(0);

	const generateReportCards = () => {
		return (
			reports?.map((report, index) => (
				<Report userId={USER_ID} report={report} key={index} />
			))
		)
	}

	const generateSightingCards = () => {
		return (
			allSightings?.map((sighting, index) => (
				<Sighting userId={USER_ID} sighting={sighting} key={index} />
			))
		)
	}

	const ReportsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }}>
			{reportCards}
		</ScrollView>
	)

	const SightingsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }}>
			{sightingCards}
		</ScrollView>
	)


	useEffect(() => {
		if (isFocused) {
			fetchAllReports();
			setReportCards(generateReportCards());
			fetchAllSightings();
			setSightingCards(generateSightingCards());
		}
	}, [isFocused]);

	// TODO: replace this image with the actual image from DB ? 
	const image = "https://wallpaperaccess.com/full/317501.jpg";

	// API calls 
	const fetchAllReports = async () => {
		setReports([]);
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

			await response.json().then(data => setReports(data[0]));
		} catch (error) {
			console.error(error);
		}
	};

	const fetchAllSightings = async () => {
		setAllSightings([]);
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

			await response.json().then(data => setAllSightings(data[0]));
			console.log("done fetching")
			console.log(allSightings.length)
		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	return (
		<SafeAreaView style={{height: "100%"}}>
			<View justifyContent="center" alignItems="flex-start" bg={'blue.300'} padding={4}>
				<Menu shadow={2} w="360" trigger={(triggerProps) => (
					<Pressable width="100%" accessibilityLabel="More options menu" {...triggerProps}>
						<View style={{ alignItems: 'flex-start' }}>
							<Heading> ➕ New Post </Heading>
						</View>
					</Pressable>
				)}>
					<Menu.Item onPress={() => navigation.navigate('Report', { screen: 'New Report Page' })}>Report</Menu.Item>
					<Menu.Item onPress={() => navigation.navigate('Dashboard', { screen: 'New Sighting Page' })}>Sighting</Menu.Item>
				</Menu>
			</View>

			{/* TABS */}
			{/* <ToggleButton.Row onValueChange={value => {
        value != null ? setTabValue(value) : ''
      }}
        value={tabValue}
        style={{ justifyContent: 'space-between', width: Dimensions.get('window').width }}>
        <ToggleButton icon={() => <Text>Reports</Text>}
          value="reports"
          style={{ width: '50%' }} />
        <ToggleButton icon={() => <Text>Sightings</Text>}
          value="sightings"
          style={{ width: '50%' }} />
      </ToggleButton.Row>

			{/* TODO: fix this - it is not scrolling all the way */}

			<TabView
				navigationState={{ index, routes }}
				renderScene={({ route }) => {
					switch (route.key) {
						case 'reports':
							return ReportsView();
						case 'sightings':
							return SightingsView();
						default:
							return null;
					}
				}}
				onIndexChange={setIndex}
				initialLayout={{ width: windowWidth }}
				renderTabBar={props => <TabBar {...props} style={{backgroundColor: Color.NENO_BLUE}}/>}
			/>

			{/* <ScrollView style={{ backgroundColor: '#EDEDED' }}>

				{tabValue == "reports"
					?
					<>
						{reports && reports?.map((report, index) => (
							<Report userId={USER_ID} report={report} key={index} />
						))}
					</>
					:
					<>
						{allSightings && allSightings?.map((sighting, index) => (
							<Sighting userId={USER_ID} sighting={sighting} key={index} />
						))
						}
					</>
				}

				<Box h={180}></Box>

			</ScrollView> */}
		</SafeAreaView>
	);
}

export default DashboardPage;