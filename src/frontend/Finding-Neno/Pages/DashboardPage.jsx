import { useNavigation, useTheme } from '@react-navigation/native';
import { StatusBar, useToast, View } from "native-base";
import { ActivityIndicator, Dimensions, RefreshControl, SafeAreaView } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Appbar, FAB, Provider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';

import { useSelector } from "react-redux";
import ReportsList from '../components/Reports/ReportsList';
import SightingsList from '../components/Sightings/SightingsList';
import IconText from '../components/Shared/IconText';

const DashboardPage = () => {
	const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
	const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);

	const navigation = useNavigation();
	const toast = useToast();
	const isFocused = useIsFocused();
	const { colors } = useTheme();

	// TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
	const [reports, setReports] = useState([]);
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	// const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae627a83abd8cc753f9ee819-lq";
	const [sightingImage, setSightingImage] = useState(null);
	const [reportFilters, setReportFilters] = useState({
		pet_type: [],
		pet_breed: [],
		location: { latitude: null, longitude: null, radius: null },
		author_id: null,
		is_active: null,
		sort_order: "DESC",
	});
	const [sightingFilters, setSightingFilters] = useState({
		pet_type: [],
		pet_breed: [],
		location: { latitude: -37.8136, longitude: 144.9631, radius: 50 },
		author_id: null,
		sort_order: "DESC",
		expiry_time: 30,
	});
	const [allSightings, setAllSightings] = useState([]);
	const [initialReportsLoaded, setInitialReportsLoaded] = useState(false);
	const [initialSightingsLoaded, setInitialSightingsLoaded] = useState(false);
	const [reloadPage, setReloadPage] = useState(false);

	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const [routes] = useState([
		{ key: 'reports', title: 'Reports', icon: 'file-document', color: Color.LIGHTER_NENO_BLUE },
		{ key: 'sightings', title: 'Sightings', icon: 'magnify', color: Color.LIGHTER_NENO_BLUE },
	])
	const [index, setIndex] = useState(0);

	// Fetch when tab is changed or page is focused
	useEffect(() => {
		if (isFocused) {
			setReloadPage(false);
			fetchData();
		}
	}, [isFocused, initialReportsLoaded, initialSightingsLoaded, reloadPage]);

	const onRefresh = () => {
		fetchData();
	}

	const fetchData = () => {
		fetchAllReports();
		fetchAllSightings();
		// setSightingCards(generateSightingCards(allSightings)); // moved this into fetchAllSightings
	}

	// API calls 
	const fetchAllReports = async () => {
		try {
			const url = `${API_URL}/filter_missing_reports`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
				},
				body: JSON.stringify(reportFilters),
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.status}`);
			}

			await response.json().then(data => {
				setReports(data[0]);
				setInitialReportsLoaded(true);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchAllSightings = async () => {
		try {
			// Retrieve sightings that are less than 30 days old
			const url = `${API_URL}/filter_sightings`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
				},
				body: JSON.stringify(sightingFilters),
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.status}`);
			}

			await response.json().then(data => {
				setAllSightings(data[0]);
				setInitialSightingsLoaded(true);

				// filters out sightings that are linked to reports where is_active == False i.e pet has been found
				// setSightingCards(generateSightingCards(data[0]));
			});

		} catch (error) {
			console.error(error);
		}
	};

	// image_url is not being set properly without this useEffect - should probs find a more robust way to fix it later 
	useEffect(() => {
		setSightingData({ ...sightingData, image_url: sightingImage })
	}, [sightingImage]);

	const renderTabBar = (props) => (
		<TabBar {...props} pressOpacity={0.6}
			renderLabel={({ route, focused, color }) => (
				// <Text style={{ color: 'black', fontWeight: 'bold' }}>{route.title}</Text>
				<IconText iconName={route.icon} text={route.title} textColor={focused ? route.color : 'gray'} 
					iconColor={focused ? route.color : 'gray'} iconSize={24} fontWeight='bold' />)} 
			style={{ backgroundColor: colors.background }}
			contentContainerStyle={{ backgroundColor: 'transparent' }}
			indicatorStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, height: 3, 
				borderRadius: 1.5, width: '15%', left: '17.5%' }} 
		/>
	);
	
	return (
		<Provider>
			<StatusBar style='auto' />
			<SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: colors.background }}>
				{/* TABS */}
				<TabView renderTabBar={renderTabBar}
					navigationState={{ index, routes }}
					renderScene={({ route }) => {
						switch (route.key) {
							case 'reports':
								return <ReportsList reports={reports} onRefresh={onRefresh} columns={1} userId={USER_ID} />;
							case 'sightings':
								return <SightingsList sightings={allSightings} onRefresh={onRefresh} emptyText={"There are no reported sightings."} />;
							default:
								return null; // TODO: make a view that says "no reports/sightings yet" etc for when theres nothing on the app yet ?
						}
					}}
					onIndexChange={setIndex}
					initialLayout={{ width: WINDOW_WIDTH }}
				/>
				<Portal>
					<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, bottom: -33 }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
						actions={[
							{ icon: 'file-document', label: 'New Missing Report', onPress: () => navigation.navigate('Dashboard', { screen: 'New Missing Report' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
							{ icon: 'magnify', label: 'New Sighting', onPress: () => navigation.navigate('Dashboard', { screen: 'New Sighting' }), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
						]} />
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}

export default DashboardPage;