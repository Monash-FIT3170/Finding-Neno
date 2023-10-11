import React from 'react';
import store from "../store/store";
import { logout } from '../store/user';
import { Button } from 'react-native-paper';
import { Color } from './atomic/Theme';

const LogoutButton = ({ onPress }) => {
  const handleLogout = () => {
    onPress();
    // This updates state in App.js so no navigation is needed
    store.dispatch(logout());
  };

  return (
    <Button buttonColor={Color.NENO_BLUE} mode="contained" onPress={handleLogout}>
      Logout
    </Button>	
  );
};

export default LogoutButton;