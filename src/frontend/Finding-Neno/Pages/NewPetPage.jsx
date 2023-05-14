import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAvoidingView } from 'react-native';
import { IP, PORT } from "@env";

export default function NewPetPage( {route} ) {
    /**
     * This page is used to create a new pet or edit an existing pet.
     * It takes in the pet object as a parameter, if the pet object is empty, it will create a new pet.
     * Otherwise, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
     * 
     */

    const navigation = useNavigation();

    const { pet, ownder_id, access_token } = route.params;
    

    const isPet = Object.keys(pet).length > 0;
      

    const [petName, setPetName] = useState(pet ? pet.name : '');
    const [petImage, setPetImage] = useState(pet ? pet.image_url : null);
    const [petType, setPetType] = useState(pet ? pet.animal : '');
    const [petBreed, setPetBreed] = useState(pet ? pet.breed : '');
    const [petDescription, setPetDescription] = useState(pet ? pet.description : '');
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const handleChoosePhoto = async () => {
        /**
         * This function is used to choose a photo from the user's photo library.
         * It will call the ImagePicker API to open the photo library and allow the user to choose a photo.
         * It will then set the petImage state to the chosen photo.
         */
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setPetImage(result.assets[0].uri);
          }
        }
    };

    const handlePreview = () => {
      setIsPreviewExpanded(!isPreviewExpanded);
    };      

    const handleTakePhoto = async () => {
        /**
         * This function is used to take a photo from the user's camera.
         * It will call the ImagePicker API to open the camera and allow the user to take a photo.
         * It will then set the petImage state to the taken photo.
         */
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
          let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setPetImage(result.assets[0].uri);
          }
        }
      };
      
      

    const handleSubmit = () => {
        /**
         * This function is used to submit the pet information to the backend.
         * It will call the POST method '/insert_pet' to create a new pet.
         * Or, it will call the PUT method '/update_pet' to update an existing pet.
         */
        let url;
        let method;
        // check if this is a new pet or an existing pet
        if (isPet) {
          url = `${IP.toString()}:${PORT.toString()}/update_pet`;
          method = 'PUT';
        } else {
          url = `${IP.toString()}:${PORT.toString()}/insert_pet`;
          method = 'POST';
        }
        // create the pet object
        const pet = {
            name: petName,
            animal: petType,
            breed: petBreed,
            description: petDescription,
            image_url: petImage.toString(),
            owner_id: ownder_id      
        };
        // call the backend API
        fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pet),
        })
        .then((res) => {
            if (res.status == 201) {
              alert("Inserted pet successfully");
            }
            else {
                alert("Error");
            }
          })
          .catch((error) => alert(error));
    };

    const isFormValid = () => {
        /**
         * This function is used to check if the form is valid.
         * It will check if the pet name, pet image, pet type, and pet description are not empty.
         */
        return petName && petImage && petType && petDescription;
      }

    return (
        /**
         * This page is used to create a new pet or edit an existing pet.
         * It takes in the pet object as a parameter, if the pet object is empty, it will have the form to insert a new pet.
         * Otherwise, it will have the form to edit the existing pet.
         */
        <ScrollView>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={250}>
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
                defaultValue={petName}
                onChangeText={setPetName}
                returnKeyType='done'
            />
        </View>

        <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet Image</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} />}
        </View>

        <Button title="Choose Existing Photo" onPress={handleChoosePhoto} />

        <Button title="Take Photo" onPress={handleTakePhoto} />
    
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
                returnKeyType='done'
            />
        </View>


        <Text style={{ marginBottom: 8, fontSize: 16 }}>Pet Description:</Text>
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
                placeholder="Enter pet description"
                value={petDescription}
                onChangeText={setPetDescription}
                returnKeyType='done'
            />
        </View>


        <Button title="Preview" onPress={handlePreview} />

        {isPreviewExpanded && (
          <View style={{ marginTop: 0, backgroundColor: '#f2f2f2', padding: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16 }}>Preview:</Text>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 16 }}>Pet name: {petName}</Text>
            <Text style={{ fontSize: 16 }}>Pet type: {petType}</Text>
            <Text style={{ fontSize: 16 }}>Pet breed: {petBreed}</Text>
            <Text style={{ fontSize: 16 }}>Pet description: {petDescription}</Text>
            {petImage && <Image source={{ uri: petImage }} style={{ width: 200, height: 200 }} />}
          </View>
          <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid()}/>
       
        </View>
        )}

        </View>
        
        </KeyboardAvoidingView>
        </ScrollView>
        
      );
}

