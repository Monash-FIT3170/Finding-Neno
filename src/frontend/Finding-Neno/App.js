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
import { Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import { IP, PORT } from "@env";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  console.log("APP")
  console.log(IP)
  console.log(PORT)
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {/* To skip login/signup pages, replace initalRouteName="Login" to initalRouteName="Tab Navigator" */}
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} 
          initialParams={{ IP, PORT }}    
          options={{
            headerShown: false
          }}/>
          <Stack.Screen name="Signup" component={SignupPage} 
          initialParams={{ IP, PORT }}  /> 
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} 
          initialParams={{ IP, PORT }}  />
          <Stack.Screen name="PasswordReset" component={PasswordResetPage} 
          initialParams={{ IP, PORT }}  /> 
          <Stack.Screen 
            name="Tab Navigator" 
            component={TabNavigator}
            initialParams={{ IP, PORT }}  
            options={{ headerShown: false }}
          />      
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );  
}
function TabNavigator({ route }) {
  const { headers } = route.params;
  
  return (
<Tab.Navigator initialRouteName="Dashboard">
  <Tab.Screen
    name="Dashboard"
    component={DashboardPage}
    initialParams={{ headers }}
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      ),
    }}
  />
  <Tab.Screen
    name="Report"
    component={ReportStackNavigator}
    initialParams={{ headers }}
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
    initialParams={{ headers }}
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

function ReportStackNavigator({route}) {
  const { headers } = route.params;
  return (
    <Stack.Navigator initialRouteName="ReportPage">
      <Stack.Screen name="Report Page" component={ReportPage} initialParams={{headers}}/>
      <Stack.Screen name="New Report Page" component={NewReportPage} initialParams={{headers}}/>
    </Stack.Navigator>
  )
}

function ProfileStackNavigator({route}) {
  const { headers } = route.params;
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
      <Stack.Screen name="Profile Page" component={ProfilePage} initialParams={{headers}}/>
      <Stack.Screen name="New Pet Page" component={NewPetPage}/>
    </Stack.Navigator>
  )
}
