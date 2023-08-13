import { NativeBaseProvider, Box } from "native-base";

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider, connect, useSelector, useDispatch } from "react-redux";
import store from "./store/store";
import { login } from "./store/user";


import DashboardPage from "./Pages/DashboardPage";
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

async function loadStorage() {
  const userId = await AsyncStorage.getItem("USER_ID");
  const accessToken = await AsyncStorage.getItem("ACCESS_TOKEN");

  if (!userId || !accessToken) {
    return false;
  }
  const payload = {
    USER_ID: userId,
    ACCESS_TOKEN: accessToken,
  }
  store.dispatch(login(payload));

  return true;
}

// set FORCE_RELOGIN = true for debugging if you want to relogin everytime app is launched
const FORCE_RELOGIN = false;

export default function App() {
  console.log(store.getState());
  const IP = store.getState().IP;
  const PORT = store.getState().PORT;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    loadStorage().then((loggedIn) => {
      if (FORCE_RELOGIN) {
        AsyncStorage.setItem("USER_ID", "")
        AsyncStorage.setItem("ACCESS_TOKEN", "")
      } else {
        setIsLoggedIn(loggedIn);
      }
    });
  }, [])

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <NavigationContainer>
          {/* To skip login/signup pages, replace initalRouteName="Login" to initalRouteName="Tab Navigator" */}
          <Stack.Navigator initialRouteName={isLoggedIn ? "Tab Navigator" : "Login"}>
            <Stack.Screen name="Login" component={LoginPage}
              initialParams={{ IP, PORT }}
              options={{
                headerShown: false
              }} />
            <Stack.Screen name="Signup" component={SignupPage}
              initialParams={{ IP, PORT }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage}
              initialParams={{ IP, PORT }} />
            <Stack.Screen name="PasswordReset" component={PasswordResetPage}
              initialParams={{ IP, PORT }} />
            <Stack.Screen
              name="Tab Navigator"
              component={TabNavigator}
              initialParams={{ IP, PORT }}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  );
}
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen
        name="Dashboard"
        component={DashboardPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
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
      <Tab.Screen
        name="Sightings"
        component={SightingsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
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

function SightingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="SightingsPage">
      <Stack.Screen name="Sightings Page" component={SightingsPage} />
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
    </Stack.Navigator>
  )
}
