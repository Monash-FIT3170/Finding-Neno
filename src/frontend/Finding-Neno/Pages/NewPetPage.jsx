import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function NewPetPage() {
    const navigation = useNavigation();

    const [petName, setPetName] = useState('');
    const [petImage, setPetImage] = useState(null);
    const [petBreed, setPetBreed] = useState('');
    const [petAge, setPetAge] = useState('');
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
          if (!result.cancelled) {
            setPetImage(result.uri);
          }
        }
      };

    const handleSubmit = () => {
        // code to submit the pet details
    };


    return (
        
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

        <Text>Pet Image</Text>
        {petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} />}
        <Button title="Choose Photo" onPress={handleChoosePhoto} />
    
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
          
    
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      );
    
    //return (<Text>New pet page</Text>)
}
