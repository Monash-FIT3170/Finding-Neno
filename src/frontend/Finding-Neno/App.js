import { NativeBaseProvider, Box } from "native-base";

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Text } from 'react-native';

import { Provider, connect, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import { login, logout } from "./store/user";


import DashboardPage from "./Pages/DashboardPage";
import EditPetPage from "./Pages/EditPetPage";
import LoginPage from "./Pages/LoginPage";
import MapPage from "./Pages/MapPage";
import NewPetPage from "./Pages/NewPetPage";
import ProfilePage from "./Pages/ProfilePage";
import ReportPage from "./Pages/ReportPage";
import SignupPage from "./Pages/SignupPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import PasswordResetPage from "./Pages/PasswordResetPage";
import SightingsPage from "./Pages/SightingsPage";
import NewSightingPage from "./Pages/NewSightingPage";
import NewReportPage from "./Pages/NewReportPage";
import { Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NativeBaseProvider>
			<Provider store={store}>
				<NavigationContainer>
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

	return (<Stack.Navigator>
		{isLoggedIn ? (<Stack.Screen
			name="Tab Navigator"
			component={TabNavigator}
			initialParams={{ API_URL }}
			options={{ headerShown: false }}
		/>) : (<><Stack.Screen name="Login" component={LoginPage}
			initialParams={{ API_URL }}
			options={{
				headerShown: false
			}} />
			<Stack.Screen name="Signup" component={SignupPage}
				initialParams={{ API_URL }} />
			<Stack.Screen name="ForgotPassword" component={ForgotPasswordPage}
				initialParams={{ API_URL }} />
			<Stack.Screen name="PasswordReset" component={PasswordResetPage}
				initialParams={{ API_URL }} />
		</>)

		}
	</Stack.Navigator>)
}

function TabNavigator() {
	return (
		<Tab.Navigator initialRouteName="Dashboard">
			<Tab.Screen
				name="Dashboard"
				component={DashboardStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" color={color} size={size} />
					),
					headerShown: false
				}}
			/>
			<Tab.Screen
				name="Map"
				component={MapPage}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="location" color={color} size={size} />
					),
				}}
			/>
			{/* <Tab.Screen
				name="Sightings"
				component={SightingsStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="search" color={color} size={size} />
					),
					headerShown: false
				}}
			/> */}
			<Tab.Screen
				name="Report"
				component={ReportStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="document-text" color={color} size={size} />
					),
					headerShown: false
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" color={color} size={size} />
					),
					headerShown: false
				}}
			/>
		</Tab.Navigator>
	);
}

// function SightingsStackNavigator() {
// 	return (
// 		<Stack.Navigator initialRouteName="SightingsPage">
// 			{/* <Stack.Screen name="Sightings Page" component={SightingsPage} /> */}
// 			<Stack.Screen name="New Sighting Page" component={NewSightingPage} />
// 		</Stack.Navigator>
// 	)
// }

function DashboardStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="DashboardPage">
			<Stack.Screen name="Dashboard Page" component={DashboardPage} />
			<Stack.Screen name="New Sighting Page" component={NewSightingPage} />
		</Stack.Navigator>
	)
}

function ReportStackNavigator() {
	return (
		<Stack.Navigator initialRouteName="ReportPage">
			<Stack.Screen name="Report Page" component={ReportPage} />
			<Stack.Screen name="New Report Page" component={NewReportPage} />
		</Stack.Navigator>
	)
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page" component={ProfilePage} />
      <Stack.Screen name="New Pet Page" component={NewPetPage} />
      <Stack.Screen name="Edit Pet Page" component={EditPetPage} />
    </Stack.Navigator>
  )
}
