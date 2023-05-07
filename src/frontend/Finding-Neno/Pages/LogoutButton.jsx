import React from 'react';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Clear any user authentication data here.
    // For example, remove any stored access or refresh tokens from storage,
    // or clear stored account information.
    // This will log the user out of the application.
    // Since there is no API to call, we just navigate them back to the login screen for now.

    // Navigate the user back to the Login screen.
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginPage' }],
    });
  };

  return (
    <Button onPress={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;