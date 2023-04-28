import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { useState } from "react";
import { NativeBaseProvider, Box } from "native-base";

import LoginPage from "./components/Login/LoginPage";
import SignupPage from "./components/Login/SignupPage";

export default function App() {
  const [isLogin, setIsLogin] = useState(true); // true to show login page, false to show signup page
  const switchPage = () => {
    setIsLogin(!isLogin);
  };

  const login = (formData) => {
    alert("login data: " + JSON.stringify(formData));
  };

  const signup = async (formData) => {
    const ipAddress = "http://192.168.0.108";
    const port = "5000";
    const url = `${ipAddress}:${port}/insert_user`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status == 201) {
        alert("inserted user successfully");
      }
    });
  };

  return (
    <NativeBaseProvider>
      {/* remove this css later */}
      <Box flex={1} alignItems="center" justifyContent="center">
        {/* keeping this here for now */}

        {isLogin ? (
          <LoginPage onLoginPress={login} onSwitchPress={switchPage} />
        ) : (
          <SignupPage onSignupPress={signup} onSwitchPress={switchPage} />
        )}
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
