import { NavigationContainer, useNavigation, useTheme  } from '@react-navigation/native';
import { Text, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { Box, Center, View, Heading, VStack, useToast, Image, FormControl, Input, Button, ScrollView, Alert, KeyboardAvoidingView } from "native-base";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { Appbar, FAB, Provider, Portal, SegmentedButtons, ToggleButton } from 'react-native-paper';
import { Color } from "../components/atomic/Theme";
import { TabBar, TabView } from 'react-native-tab-view';
import SightingsList from '../components/Sightings/SightingsList';
import IconText from '../components/Shared/IconText';


export default function SightingsPage({ navigation: { navigate } }) {

    const isFocused = useIsFocused();
    const [sightingsOfMyPets, setSightingsOfMyPet] = useState('');
    const [mySavedSightings, setMySavedSightings] = useState('');
    
	const [FABstate, setFABState] = useState({ open: false });
	const onStateChange = ({ open }) => setFABState({ open });
	const { open } = FABstate;
    const { colors } = useTheme();

    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);


    const [reloadPage, setReloadPage] = useState(false);
    const [routes] = useState([
		{ key: 'sightingsOfMyPets', title: 'Sightings Of Your Pets', color: colors.secondary },
		{ key: 'mySavedSightings', title: 'Saved Sightings', color: colors.secondary },
	])
	const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchSightingsOfMyPets();
        fetchMySavedSightings();
        setReloadPage(false);
	}, [isFocused, reloadPage]);

    const onRefresh = () => {
        fetchSightingsOfMyPets();
        fetchMySavedSightings();
    }

    const fetchSightingsOfMyPets = async () => {
        try {
                const url = `${API_URL}/get_my_report_sightings`;
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
                // filters out sightings that are linked to reports where is_active == False i.e pet has been found
                setSightingsOfMyPet(data[0]);
            } catch (error) {
                console.error(error);
            }
      };

      const fetchMySavedSightings = async () => {
        try {
                const url = `${API_URL}/retrieve_saved_sightings`;
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
                // filters out sightings that are linked to reports where is_active == False i.e pet has been found
                setMySavedSightings(data[0]);
            } catch (error) {
                console.error(error);
            }
      };

    const renderTabBar = (props) => (
		<TabBar {...props} 
			renderLabel={({ route, focused, color }) => (
				// <Text style={{ color: 'black', fontWeight: 'bold' }}>{route.title}</Text>
				<IconText iconName={route.icon} text={route.title} textColor={focused ? route.color : 'gray'} 
                    iconColor={focused ? route.color : 'gray'} iconSize={24} fontWeight='bold' />)} 
			style={{ backgroundColor: colors.background }}
			indicatorStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, height: 3, 
                borderRadius: 1.5, width: '15%', left: '17.5%' }} 
		/>
	);
      
    return (
        <Provider>
            <SafeAreaView style={{height: "100%"}}>
				{/* TABS */}
				<TabView renderTabBar={renderTabBar}
                    navigationState={{ index, routes }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            case 'sightingsOfMyPets':
                                return <SightingsList sightings={sightingsOfMyPets} onRefresh={onRefresh} emptyText={"There are no reported sightings of your pets."} />;
                            case 'mySavedSightings':
                                return <SightingsList sightings={mySavedSightings} onRefresh={onRefresh} emptyText={"You have no saved sightings."}/>;
                            default:
                                return null; 
                        }
                    }}
                    onIndexChange={setIndex}
                    initialLayout={{ width: WINDOW_WIDTH }}
                />
                <Portal>
                    <FAB.Group color='white' fabStyle={{ backgroundColor: Color.LIGHTER_NENO_BLUE, bottom: -33 }} icon={open ? "close" : "plus"} open={open} visible onStateChange={onStateChange}
                        actions={[
                            { icon: 'file-document', label: 'New Missing Report', onPress: () => navigate('New Missing Report'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
                            { icon: 'magnify', label: 'New Sighting', onPress: () => navigate('New Sighting'), color: Color.NENO_BLUE, style: { backgroundColor: Color.FAINT_NENO_BLUE } },
                        ]} />
                </Portal>
            </SafeAreaView>
        </Provider>
    )
}