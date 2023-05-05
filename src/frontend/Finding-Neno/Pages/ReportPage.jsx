import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView } from 'react-native';
import Dropdown from './Dropdown';

import { Color } from "../components/atomic/Theme";
import { useState } from "react";
import { IP, PORT } from "@env";

const ReportPage = () => {
    const navigation = useNavigation();

    const [missingPet, setMissingPet] = useState('')
    const options = ['Option 1', 'Add Pet'];
    const handleSelectOption = (option) => setMissingPet(option);

    const [lastSeen, setLastSeen] = useState('')
    const [lastLocation, setLastLocation] = useState('')


    return (
        <ScrollView>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={250}>
        <View style={{ padding: 16 }}></View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Choose Pet:</Text>
        <View>
        <Dropdown
            options={options}
            selectedOption={missingPet}
            onSelect={handleSelectOption}
        />
        </View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Last seen:</Text>
        <View
            style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#ddd',
                padding: 8,
                marginBottom: 16,
            }}>
            <TextInput
                style={{ fontSize: 16 }}
                placeholder="Enter last seen time"
                value={lastSeen}
                onChangeText={setLastSeen}
            />
        </View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Last Known Location:</Text>
        <View
            style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#ddd',
                padding: 8,
                marginBottom: 16,
            }}>
            <TextInput
                style={{ fontSize: 16 }}
                placeholder="Enter last known location"
                value={lastLocation}
                onChangeText={setLastLocation}
            />
        </View>

        </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default ReportPage;