import { NativeBaseProvider, Box, StatusBar } from "native-base";

import { NavigationContainer, useNavigation, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Text, useColorScheme } from 'react-native';

import { Provider, connect, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import { login, logout } from "./store/user";


import DashboardPage from "./Pages/DashboardPage";
import EditPetPage from "./Pages/EditPetPage";
import LoginPage from "./Pages/LoginPage";
import MapPage from "./Pages/MapPage";
import NewPetPage from "./Pages/NewPetPage";
import ProfilePage from "./Pages/ProfilePage";
import ReportsPage from "./Pages/ReportsPage";
import SignupPage from "./Pages/SignupPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import SightingsPage from "./Pages/SightingsPage";
import NewSightingPage from "./Pages/NewSightingPage";
import NewReportPage from "./Pages/NewReportPage";
import SettingsPage from "./Pages/SettingsPage";
import { Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import { Color } from "./components/atomic/Theme";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FindingNenoLightTheme = {
	dark: false,
	colors: {
		...DefaultTheme.colors,
		background: 'white',
		primary: Color.NENO_BLUE,
		secondary: Color.LIGHTER_NENO_BLUE,
		tertiary: Color.FAINT_NENO_BLUE,
		cardColor: 'white',
		card: 'white',
		text: 'black',
		border: 'lightgray',
		settingBackground: '#f5f5f5',
	},
}

const FindingNenoDarkTheme = {
	dark: true,
	colors: {
		...DarkTheme.colors,
		background: '#151517',
		primary: Color.NENO_BLUE,
		secondary: Color.LIGHTER_NENO_BLUE,
		tertiary: Color.FAINT_NENO_BLUE,
		cardColor: '#202124',
		card: '#151517',
		text: 'white',
		border: 'black',
		settingBackground: '#5f5f5f',
	},
}

export default function App() {
	const scheme = useColorScheme();
	return (
		<NativeBaseProvider>
			<Provider store={store}>
				<NavigationContainer theme={scheme === 'dark' ? FindingNenoDarkTheme : FindingNenoLightTheme}>
					<StatusBar style='auto'/>
					<MainNavigator />
				</NavigationContainer>
			</Provider>
		</NativeBaseProvider>
	);
}

async function tryLocalCredentialLogin(API_URL) {
	const userId = await AsyncStorage.getItem("USER_ID");
	const accessToken = await AsyncStorage.getItem("ACCESS_TOKEN");

	if (userId && accessToken) {
		const payload = {
			USER_ID: userId,
			ACCESS_TOKEN: accessToken,
		}

    const url = `${API_URL}/verify_token`;
    const verifyTokenRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-ID': userId
      },
    });
    if (verifyTokenRes.status == 200) {
      store.dispatch(login(payload));
    } else {
      store.dispatch(logout());
    }
	} else {
		store.dispatch(logout());
	}
}

// set FORCE_RELOGIN = true for debugging if you want to relogin every time app is launched
const FORCE_RELOGIN = false;

function MainNavigator() {
	console.log(store.getState());
	let { API_URL } = useSelector((state) => state.api);

	useEffect(() => {
		if (FORCE_RELOGIN) {
			store.dispatch(logout())
		} else {
			tryLocalCredentialLogin(API_URL);
		}
	}, [API_URL])

	const isLoggedIn = useSelector(() => store.getState().user.LOGGED_IN)

	if (isLoggedIn === undefined) {
		// Don't display anything while storage is loading
		return null;
	}

	return (<Stack.Navigator screenOptions={{ headerShown: false }}>
		{isLoggedIn ? (<Stack.Screen
			name="Tab Navigator"
			component={TabNavigator}
			initialParams={{ API_URL }}
		/>) : (<><Stack.Screen name="Login" component={LoginPage}
			initialParams={{ API_URL }} />
			<Stack.Screen name="Signup" component={SignupPage}
				initialParams={{ API_URL }} options={{ title: "" }}/>
			<Stack.Screen name="ForgotPassword" component={ForgotPasswordPage}
				initialParams={{ API_URL }} />
			<Stack.Screen name="PasswordReset" component={PasswordResetPage}
				initialParams={{ API_URL }} />
		</>)

		}
	</Stack.Navigator>)
}

function TabNavigator() {
	const { colors } = useTheme();
	return (
		<Tab.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor: colors.background} }}>
			<Tab.Screen
				name="Dashboard"
				component={DashboardStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Map"
				component={MapStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="location" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="My Reports"
				component={ReportStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="document-text" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Sightings"
				component={SightingsStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}

function DashboardStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="DashboardPage">
			<Stack.Screen name="Dashboard Page" component={DashboardPage} options={{ title: "Dashboard", headerShown: false, }}/>
			<Stack.Screen name="New Missing Report" component={NewReportPage} options={{ title: "" }}/>
			<Stack.Screen name="New Sighting" component={NewSightingPage} options={{ title: "" }}/>
			<Stack.Screen name="New Pet" component={NewPetPage} options={{ title: "" }} />
		</Stack.Navigator>
	)
}

function MapStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="MapPage">
			<Stack.Screen name="Map Page" component={MapPage} options={{ title: "Map", headerShown: false, }} />
			<Stack.Screen name="New Missing Report" component={NewReportPage} options={{ title: "" }}/>
			<Stack.Screen name="New Sighting" component={NewSightingPage} options={{ title: "" }}/>
			<Stack.Screen name="New Pet" component={NewPetPage} options={{ title: "" }} />
		</Stack.Navigator>
	)
}

function ReportStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="ReportsPage">
			<Stack.Screen name="Reports Page" component={ReportsPage} options={{ title: "My Reports", headerShown: false, }} />
			<Stack.Screen name="New Missing Report" component={NewReportPage} options={{ title: "" }}/>
			<Stack.Screen name="New Sighting" component={NewSightingPage} options={{ title: "" }}/>
			<Stack.Screen name="New Pet" component={NewPetPage} options={{ title: "" }} />
		</Stack.Navigator>
	)
}

function SightingsStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="SightingsPage">
			<Stack.Screen name="Sightings Page"  component={SightingsPage} options={{ title: "Sightings", headerShown: false, }} />
			<Stack.Screen name="New Missing Report" component={NewReportPage} options={{ title: "" }}/>
			<Stack.Screen name="New Sighting" component={NewSightingPage} options={{ title: "" }}/>
			<Stack.Screen name="New Pet" component={NewPetPage} options={{ title: "" }} />
		</Stack.Navigator>
	)
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page"  component={ProfilePage} options={{ title: "Profile", headerShown: false, }} />
      <Stack.Screen name="New Pet" component={NewPetPage} options={{ title: "" }} />
      <Stack.Screen name="Edit Pet" component={EditPetPage} options={{ title: "" }} />
	  <Stack.Screen name="Settings Page" component={SettingsPage} options={{ title: "Settings" }}/>
    </Stack.Navigator>
  )
}
