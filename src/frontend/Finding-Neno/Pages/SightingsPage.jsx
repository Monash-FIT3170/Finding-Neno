import { Text, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { ScrollView } from "native-base";
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import Sighting from '../components/Sighting';
import { Color } from "../components/atomic/Theme";

export default function SightingsPage({navigation: {navigate}}) {

    const windowWidth = Dimensions.get('window').width; 
    const isFocused = useIsFocused();
    const [sightingOfMyPetCards, setSightingOfMyPetCards] = useState('');
    const [savedSightingCards, setSavedSightingCards] = useState('');

	const {API_URL} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [reloadPage, setReloadPage] = useState(false);
    const [routes] = useState([
		{ key: 'sightingsOfMyPets', title: 'Sightings Of Your Pets' },
		{ key: 'mySavedSightings', title: 'Saved Sightings' },
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

    const generateSavedSightingsCards = (data) => {
		return (
			data?.map((sighting, index) => (
				<Sighting userId={USER_ID} sighting={sighting} key={index} setReloadParent={setReloadPage}/>
			))
		)
	}

    const generateSightingsOfMyPets = (data) => {
		return (
			data?.map((sighting, index) => (
				<Sighting userId={USER_ID} sighting={sighting} key={index} setReloadParent={setReloadPage}/>
			))
		)
	}

    const SavedSightingsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{savedSightingCards}
		</ScrollView>
	)

    const SightingsOfMyPetsView = () => (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{sightingOfMyPetCards}
		</ScrollView>
	)

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
                setSightingOfMyPetCards(generateSightingsOfMyPets(data[0]));
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
                setSavedSightingCards(generateSavedSightingsCards(data[0]));
            } catch (error) {
                console.error(error);
            }
      };
      
    return (
        <SafeAreaView style={{height: "100%"}}>
			<TabView
				navigationState={{ index, routes }}
				renderScene={({ route }) => {
					switch (route.key) {
						case 'sightingsOfMyPets':
							return sightingOfMyPetCards.length 
                                ? SightingsOfMyPetsView() 
                                : <Text style={{fontSize: 16, alignSelf: 'center', paddingTop: '10%'}}>
                                    No sightings of your lost pets yet!
                                </Text>;
						case 'mySavedSightings':
							return savedSightingCards.length 
                                ? SavedSightingsView() 
                                : <Text style={{fontSize: 16, alignSelf: 'center', paddingTop: '10%'}}>
                                    No saved sightings yet!
                                </Text>;
						default:
							return null; 
					}
				}}
				onIndexChange={setIndex}
				initialLayout={{ width: windowWidth }}
				renderTabBar={props => <TabBar {...props} style={{backgroundColor: Color.NENO_BLUE}}/>}
			/>

		</SafeAreaView>
    )
}