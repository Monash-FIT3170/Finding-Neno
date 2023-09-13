import { useNavigation } from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView } from "native-base";
import { ActivityIndicator, Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Appbar, FAB, PaperProvider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from 'expo-status-bar';

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
	//   const [modalVisible, setModalVisible] = useState(false);
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	// const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
	const [sightingImage, setSightingImage] = useState(null);
	const [tabValue, setTabValue] = useState("reports");
	const [allSightings, setAllSightings] = useState([]);
	const [sightingCards, setSightingCards] = useState("");

	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	// Fetch on initial load
	useEffect(() => {
		initialFetch();
	}, []);

	// Fetch all reports and sightings
	initialFetch = () => {
		fetchAllReports();
		fetchAllSightings();
	}

	// Fetch when tab is changed or page is focused
	useEffect(() => {
		fetchData();
	}, [isFocused, tabValue]);

	// Fetch when user pulls down to refresh
	onRefresh = () => {
		fetchData();
	}

	// Fetch data depending on tab
	fetchData = () => {
		if (tabValue == "reports") {
			fetchAllReports();
		} else {
			fetchAllSightings();
		}
	}

	useEffect(() => {
		setSightingCards(allSightings.map((sighting, index) => (
			<Sighting userId={USER_ID} sighting={sighting} key={index} />
		)))
	}, [allSightings]);


	// TODO: replace this image with the actual image from DB ? 
	const image = "https://wallpaperaccess.com/full/317501.jpg";

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

			const data = await response.json();
			setReports(data[0]);
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

			const data = await response.json();
			setAllSightings(data[0]);
		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	return (


		<PaperProvider>
			<StatusBar style="auto" />
			<Portal>
				<FAB.Group icon="plus" open={open} visible onStateChange={onStateChange} style={{ position: 'absolute', bottom: -20, right: 0 }}
					actions={[
						{ icon: 'bullhorn', label: 'New Report', onPress: () => navigation.navigate('Reports', { screen: 'New Report' }) },
						{ icon: 'eye', label: 'New Sighting', onPress: () => navigation.navigate('Sightings', { screen: 'New Sighting' }) },
					]} />
			</Portal>
			<SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
				{/* <View>
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
      </View> */}

				{/* TABS */}
				<SegmentedButtons value={tabValue} onValueChange={setTabValue} style={{ marginTop: 5, width: Dimensions.get('window').width - 20, backgroundColor: '#EDEDED' }}
					buttons={[
						{ label: 'Reports', icon: 'bullhorn', value: 'reports' },
						{ label: 'Sightings', icon: 'eye', value: 'sightings' },
					]}
				/>
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
      </ToggleButton.Row> */}

				{/* TODO: fix this - it is not scrolling all the way */}

				<ScrollView height="100%" style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>

					{/* display depending on tabs */}
					{tabValue == "reports"
						?
						<>
							{reports && reports.map((report, index) => (
								<Report userId={USER_ID} report={report} key={index} />
							))}
						</>
						:
						<>
							{sightingCards}
						</>
					}

					<Box h={180}></Box>

				</ScrollView>
			</SafeAreaView>
		</PaperProvider>
	);
}

export default DashboardPage;