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
import PasswordResetPage from "./Pages/PasswordResetPage";
import SightingsPage from "./Pages/SightingsPage";
import NewReportPage from "./Pages/NewReportPage";

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
          <Stack.Screen name="PasswordReset" component={PasswordResetPage} /> 
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
function TabNavigator({ route }) {
  const { user } = route.params;
  console.log("Tab Navigator: " + user);
  
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen
        name="Dashboard"
        component={DashboardPage}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Map"
        component={MapPage}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Report"
        component={ReportStackNavigator}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Sightings"
        component={SightingsPage}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function ReportStackNavigator({route}) {
  const { user } = route.params;
  return (
    <Stack.Navigator initialRouteName="ReportPage">
      <Stack.Screen name="Report Page" component={ReportPage} initialParams={{user}}/>
      <Stack.Screen name="New Report Page" component={NewReportPage} initialParams={{user}}/>
    </Stack.Navigator>
  )
}

function ProfileStackNavigator({route}) {
  const { user } = route.params;
  console.log("Profile Stack Navigator: " + user);
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page" component={ProfilePage} initialParams={{user}}/>
      <Stack.Screen name="New Pet Page" component={NewPetPage}/>
    </Stack.Navigator>
  )
}
