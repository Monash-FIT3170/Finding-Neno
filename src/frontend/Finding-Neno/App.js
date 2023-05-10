import { NativeBaseProvider, Box } from "native-base";

import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import MapPage from "./Pages/MapPage";
import NewPetPage from "./Pages/NewPetPage";
import ProfilePage from "./Pages/ProfilePage";
import ReportPage from "./Pages/ReportPage";
import SignupPage from "./Pages/SignupPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import SightingsPage from "./Pages/SightingsPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {/* To skip login/signup pages, replace initalRouteName="Login" to initalRouteName="Tab Navigator" */}
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} /> 
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} /> 
          <Stack.Screen 
            name="Tab Navigator" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />       
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

function TabNavigator(){
  return(
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashboardPage}/>
      <Tab.Screen name="Map" component={MapPage} />
      <Tab.Screen name="Report" component={ReportPage} />
      <Tab.Screen name="Sightings" component={SightingsPage}/>
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  )
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page" component={ProfilePage}/>
      <Stack.Screen name="New Pet Page" component={NewPetPage}/>
    </Stack.Navigator>
  )
}
