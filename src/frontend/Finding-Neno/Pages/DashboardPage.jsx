import { useNavigation } from '@react-navigation/native';
import { useToast, View } from "native-base";
import { ActivityIndicator, Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Appbar, FAB, Provider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import { StatusBar } from 'expo-status-bar';

import { useSelector } from "react-redux";
import ReportsList from '../components/ReportsList';
import SightingsList from '../components/SightingsList';
import IconText from '../components/IconText';

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
	const [allSightings, setAllSightings] = useState([]);

	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const [routes] = useState([
		{ key: 'reports', title: 'Reports', icon: 'file-document', color: Color.NENO_BLUE },
		{ key: 'sightings', title: 'Sightings', icon: 'magnify', color: Color.NENO_BLUE },
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
			});
		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	const [tabBarRendered, setTabBarRendered] = useState(false);

	const renderTabBar = (props) => (
		<TabBar {...props} 
			renderLabel={({ route, focused, color }) => (
				// <Text style={{ color: 'black', fontWeight: 'bold' }}>{route.title}</Text>
				<IconText iconName={route.icon} text={route.title} textColor={route.color} iconColor={route.color} iconSize={24} fontWeight='bold' />)} 
			style={{ backgroundColor: 'white' }}
			indicatorStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, height: 3, borderRadius: 1.5, width: '15%', left: '17.5%' }} 
		/>
	);

	return (
		<Provider>
			<SafeAreaView style={{ flex: 1, height: '100%' }}>
				<StatusBar style="auto" />
				{/* TABS */}
				<TabView renderTabBar={renderTabBar}
					navigationState={{ index, routes }}
					renderScene={({ route }) => {
						switch (route.key) {
							case 'reports':
								return <ReportsList reports={reports} onRefresh={onRefresh} columns={1} />;
							case 'sightings':
								return <SightingsList sightings={allSightings} onRefresh={onRefresh} />;
							default:
								return null; // TODO: make a view that says "no reports/sightings yet" etc for when theres nothing on the app yet ?
						}
					}}
					onIndexChange={setIndex}
					initialLayout={{ width: windowWidth }}
					
				/>
				<Portal>
					<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
						actions={[
							{ icon: 'file-document', label: 'New Report', onPress: () => navigation.navigate('Dashboard', { screen: 'New Report' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
							{ icon: 'magnify', label: 'New Sighting', onPress: () => navigation.navigate('Dashboard', { screen: 'New Sighting' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
						]} />
				</Portal>

			</SafeAreaView>
		</Provider>
	);
}

export default DashboardPage;