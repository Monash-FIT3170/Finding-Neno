import { useNavigation, useTheme } from '@react-navigation/native';
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
	const { API_URL } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const windowWidth = Dimensions.get('window').width;
	const navigation = useNavigation();
	const toast = useToast();
	const isFocused = useIsFocused();
	const { colors } = useTheme();

	const [reports, setReports] = useState([]);
	const [allSightings, setAllSightings] = useState([]);
	const [sightingData, setSightingData] = useState({ authorId: USER_ID });
	const [sightingImage, setSightingImage] = useState(null);
	const [initialReportsLoaded, setInitialReportsLoaded] = useState(false);
	const [initialSightingsLoaded, setInitialSightingsLoaded] = useState(false);
	const [reloadPage, setReloadPage] = useState(false);

	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;

	const [routes] = useState([
		{ key: 'reports', title: 'Reports', icon: 'file-document', color: Color.NENO_BLUE },
		{ key: 'sightings', title: 'Sightings', icon: 'magnify', color: Color.NENO_BLUE },
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
			const url = `${API_URL}/get_missing_reports`;
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
				setInitialReportsLoaded(true);
			});
		} catch (error) {
			console.error(error);
		}
	};

  const fetchAllSightings = async () => {
    try {
      // Retrieve sightings that are less than 30 days old
      const expiryTime = 30;
			const url = `${API_URL}/get_sightings?expiry_time=${expiryTime}`;
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
		<TabBar {...props}
			renderLabel={({ route, focused, color }) => (
				// <Text style={{ color: 'black', fontWeight: 'bold' }}>{route.title}</Text>
				<IconText iconName={route.icon} text={route.title} textColor={focused ? route.color : colors.text} 
					iconColor={focused ? route.color : colors.text} iconSize={24} fontWeight='bold' />)} 
			style={{ backgroundColor: colors.background }}
			contentContainerStyle={{ backgroundColor: 'transparent' }}
			indicatorStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, height: 3, 
				borderRadius: 1.5, width: '15%', left: '17.5%' }} 
		/>
	);
	
	return (
		<Provider>
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
					initialLayout={{ width: windowWidth }}
				/>
				<Portal>
					<FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
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