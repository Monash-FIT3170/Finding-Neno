import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

import { Color } from "../components/atomic/Theme";
import { useState } from "react";
import { IP, PORT } from "@env";

export default function ReportPage() {
    const navigation = useNavigation();

    const [missingPet, setMissingPet] = useState('')
    const [lastSeen, setLastSeen] = useState('')
    const [lastLocation, setLastLocation] = useState('')
};
