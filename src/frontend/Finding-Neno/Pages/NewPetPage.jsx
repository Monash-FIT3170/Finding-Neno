import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function NewPetPage() {
    const navigation = useNavigation();

    const [petName, setPetName] = useState('');
    const [petImage, setPetImage] = useState(null);
    const [petType, setPetType] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petGender, setPetGender] = useState('');

    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setPetImage(result.uri);
          }
        }
      };

    const handleSubmit = () => {
        alert(petName + ' ' + petType + ' ' + petBreed + ' ' + petGender);
    };


    return (

        <ScrollView>
        
        <View style={{ padding: 16 }}>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet name:</Text>
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
                placeholder="Enter pet name"
                value={petName}
                onChangeText={setPetName}
            />
        </View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet Image</Text>
        {petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} />}
        <Button title="Choose Photo" onPress={handleChoosePhoto} />
    
        <Text style={{  fontSize: 16 }}>Pet Type</Text>
        <Picker selectedValue={petType} onValueChange={setPetType} >
            <Picker.Item label="Dog" value="dog" />
            <Picker.Item label="Cat" value="cat" />
            <Picker.Item label="Rabbit" value="rabbit" />
            <Picker.Item label="Mouse" value="mouse" />
            <Picker.Item label="Snake" value="snake" />
            <Picker.Item label="Bird" value="bird" />
            <Picker.Item label="Other" value="other" />
        </Picker>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet breed:</Text>
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
                placeholder="Enter pet breed"
                value={petBreed}
                onChangeText={setPetBreed}
            />
        </View>


        <Text style={{fontSize: 16 }}>Pet Gender</Text>
        
            <Picker selectedValue={petGender} onValueChange={setPetGender}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
            </Picker>
        
          
    
          <Button title="Submit" onPress={handleSubmit} />
        </View>

        </ScrollView>
      );
    

}
