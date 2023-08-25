import React from 'react';
import { Button } from 'native-base';
import store from "../store/store";
import { logout } from '../store/user';

const LogoutButton = ({ onPress }) => {
  const handleLogout = () => {
    onPress();
    // This updates state in App.js so no navigation is needed
    store.dispatch(logout());
  };

  return (
    <Button onPress={handleLogout} backgroundColor={"#FA8072"}>
      Logout
    </Button>
  );
};

export default LogoutButton;