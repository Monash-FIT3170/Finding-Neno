import React, { useState } from 'react';
import { View, Text, TextInput,TouchableOpacity, Modal, Button, Image, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAvoidingView } from 'react-native';
import { IP, PORT } from "@env";

export default function NewPetPage({ navigation: { navigate}, route}) {
    /**
     * This page is used to create a new pet or edit an existing pet.
     * It takes in the pet object as a parameter, if the pet object is empty, it will create a new pet.
     * Otherwise, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
     * 
     */

    const navigation = useNavigation();
   
    console.log("parsms");
    console.log(route.params);
    console.log(route.params["accessToken"]);

    const access_token = route.params["accessToken"];
    const owner_id = route.params["ownerId"]
    const pet = route.params["pet"]

    // const {user } = route.params;
    // console.log(user);
    // const owner_id = user["ownerId"]

    // const { access_token, owner_id, pet } = route.params;
    // console.log('OWNEEEERRRRRR and access token')
    // console.log(access_token)
    
    //if the pet name is empty then it is a new pet, otherwise it is an existing pet
    const isExistingPet = pet.name != '';

    const [petName, setPetName] = useState(pet ? pet.name : '');
    const [petImage, setPetImage] = useState(pet ? pet.image_url : null);
    const [petType, setPetType] = useState(pet ? pet.animal : '');
    const [petBreed, setPetBreed] = useState(pet ? pet.breed : '');
    const [petDescription, setPetDescription] = useState(pet ? pet.description : '');
    const [modalVisible, setModalVisible] = useState(false);

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
        if (isExistingPet) {
          url = `${IP.toString()}:${PORT.toString()}/update_pet`;
          method = 'PUT';
        } else {
          url = `${IP.toString()}:${PORT.toString()}/insert_pet?owner_id=${owner_id}`;
          method = 'POST';
        }
        // create the pet object
        const pet = {
            name: petName,
            animal: petType,
            breed: petBreed,
            description: petDescription,
            image_url: petImage.toString(),
            owner_id: owner_id     
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

        <View style={{ flex: 1 }}> 
        <Button title="Preview" onPress={() => setModalVisible(true)} disabled={!isFormValid()}/> 
        <Modal animationType={'fade'} transparent={true} visible={modalVisible} onRequestClose={() => { Alert.alert('Modal has been closed.'); setModalVisible(false); }}> 
        <TouchableOpacity activeOpacity={1} onPressOut={() => setModalVisible(false)} style={{ flex: 1, backgroundColor: 'white', opacity: 0.8 }} />
        <View
          style={{
            height: '35%',
            marginTop: 'auto',
            backgroundColor:'#F2F2F7',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View style={{margin: '5%', paddingTop: '1%', height: 'auto', maxHeight: '65%'}}>

            <View style={{
                backgroundColor: '#B8B8B8',
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: '35%', height: '100%'}}>
                  {petImage && <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20 }} />}
                </View>

                <View style={{flex: 1, marginLeft: '5%', padding: '2%'}}>
                  <Text style={{ fontSize: 30, paddingBottom: 10 }}>{petName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                    <View style={{flexDirection: 'column', alignItems: 'left'}}>
                      <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Species:</Text>
                      <Text style={{ fontSize: 20, textTransform: 'capitalize' }}>{petType}</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'left', marginLeft: '15%'}}>
                      <Text style={{ fontSize: 12, color: "#F2F2F7" }}>Breed:</Text>
                      <Text style={{ fontSize: 20 }}>{petBreed}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: "#F2F2F7", marginBottom: '1%' }}>Details:</Text>
                  <Text style={{ fontSize: 14 }}>{petDescription}</Text>
                </View>
                
              </View>
            </View>
            <View style={{justifyContent: 'space-between', marginTop: '3%'}}>
              <Button title="Add Pet" onPress={handleSubmit}/>
            </View>
          </View> 
        </View>
        </Modal> 
        </View>
        </View>

        </KeyboardAvoidingView>
        </ScrollView>        
      );
}

