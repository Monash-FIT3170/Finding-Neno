import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { 
  NativeBaseProvider, 
  Box } from "native-base";

import LoginPage from './components/Login/LoginPage'

export default function App() {
  return (
    <NativeBaseProvider>
      {/* remove this css later */}
      <Box flex={1} alignItems="center" justifyContent="center">
        {/* keeping this here for now */}
        <LoginPage onPress={() => alert('testing onpress')}/>
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
