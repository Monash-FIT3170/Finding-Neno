import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Text } from 'react-native';
import store from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dimensions } from 'react-native';
import {Dimensions} from 'react-native';

import { useSelector, useDispatch } from "react-redux";


export default function MapPage() {
	const {IP, PORT} = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    return (<Text>Map page</Text>)
}