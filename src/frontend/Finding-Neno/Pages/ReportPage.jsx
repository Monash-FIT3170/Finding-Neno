import React, { useState } from 'react';
import {View, Text, TextInput, ScrollView,} from 'react-native';
import { Button} from "native-base";
import { Color } from "../components/atomic/Theme";
import Dropdown from './Dropdown';

const ReportPage = () => {
  const [missingPet, setMissingPet] = useState('');
  const options = ['Option 1', 'Option 2', 'Add new Pet'];
  const handleSelectOption = (option) => setMissingPet(option);

  const [lastSeen, setLastSeen] = useState('');
  const [lastLocation, setLastLocation] = useState('');

  const [dropdownHeight, setDropdownHeight] = useState(150);


  return (
    <ScrollView>
        <View style={{ padding: 16 }}>

            <Text style={{ marginBottom: 8, fontSize: 16 }}>Choose Pet:</Text>
            <View style={{ marginBottom: 8, height: dropdownHeight }}>
                <Dropdown
                    options={options}
                    selectedOption={missingPet}
                    onSelect={handleSelectOption}
                    onLayout={(event) => setDropdownHeight(event.nativeEvent.layout.height)}
                    placeholder="Select a pet"
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

            <Button mt="2" bgColor={Color.NENO_BLUE} >
                Submit Report
            </Button>
        </View>
    </ScrollView>
  );
};

export default ReportPage;