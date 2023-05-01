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
import SightingsPage from "./Pages/SightingsPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login Page">
          <Stack.Screen name="Login Page" component={LoginPage} />
          <Stack.Screen name="Sign Up Page" component={SignupPage} /> 
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
    <Tab.Navigator initialRouteName="DashboardPage">
      <Tab.Screen name="Dashboard Page" component={DashboardPage}/>
      <Tab.Screen name="Map Page" component={MapPage} />
      <Tab.Screen name="Report Page" component={ReportPage} />
      <Tab.Screen name="Sightings Page" component={SightingsPage}/>
      <Tab.Screen 
        name="ProfileStackNav" 
        component={ProfileStackNav} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  )
}

function ProfileStackNav() {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page" component={ProfilePage}/>
      <Stack.Screen name="New Pet Page" component={NewPetPage}/>
    </Stack.Navigator>
  )
}
