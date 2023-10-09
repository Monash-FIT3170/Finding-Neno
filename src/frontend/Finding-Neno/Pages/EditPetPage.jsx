import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPet } from "../store/pet.js";

import {
  Box,
  Center,
  Heading,
  VStack,
  useToast,
  FormControl,
  Input,
  Button,
  Select,
  Alert,
  Text,
  KeyboardAvoidingView,
} from "native-base";
import { View, Image, FlatList } from "react-native";
import { Color } from "../components/atomic/Theme";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import store from "../store/store";

import { petTypeOptions } from "./shared";

const EditPetPage = ({ navigation: { navigate }, route }) => {
  /**
   * This page is used to edit an existing pet.
   * It takes in the pet object as a parameter, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
   */

  const { API_URL } = useSelector((state) => state.api);
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
  const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);

  const pet = useSelector((state) => state.pet);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState("Update Pet");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const toast = useToast();

  const [petId, setPetId] = useState(pet.id);
  const [petName, setPetName] = useState(pet.name);
  const [petImage, setPetImage] = useState(pet.image_url);
  const [petType, setPetType] = useState(pet.animal);
  const [petBreed, setPetBreed] = useState(pet.breed);
  const [petDescription, setPetDescription] = useState(pet.description);

  const formData = {
    petName: petName,
    petImage: petImage,
    petType: petType,
    petBreed: petBreed,
    petDescription: petDescription,
  };

  const LOADING_IMAGE =
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRwMHI0cmlnOGU3Mm4xbzZwcTJwY2Nrb2hlZ3YwNmtleHo4Zm15MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L05HgB2h6qICDs5Sms/giphy.gif";

  const onEditPetPress = () => {
    setIsButtonDisabled(true);
    setButtonText("Updating Pet...");
    /**
     * This function is used to submit the pet information to the backend.
     * It will call the PUT method '/update_pet' to update an existing pet.
     */
    let url;
    let method;

    url = `${API_URL}/update_pet`;
    method = "PUT";

    let isValid = validateDetails(formData);

    if (isValid) {
      const pet = {
        id: petId,
        name: formData.petName,
        animal: formData.petType,
        breed: formData.petBreed,
        description: formData.petDescription,
        image_url: petImage.toString(),
        owner_id: USER_ID,
      };

      // call the backend API
      fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pet),
      })
        .then((res) => {
          if (res.status == 201) {
            // Show success
            // Clear fields?

            toast.show({
              description: "Your pet has been updated!",
              placement: "top",
            });
            dispatch(selectPet(pet));
            navigate("Profile Page");
          } else {
            alert("Error updating pet");
          }
        })
        .catch((error) => alert(error));
    }

    setButtonText("Update Pet");
    setIsButtonDisabled(false);
  };

  const validateDetails = (formData) => {
    // Validates details.
    const foundErrors = {};

    if (!formData.petName || formData.petName === "") {
      foundErrors.petName = "Pet name is required";
    } else if (formData.petName.length > 25) {
      foundErrors.petName = "Must not exceed 25 characters";
    }

    if (!formData.petType || formData.petType === "") {
      foundErrors.petType = "Please select a pet type";
    }

    if (!formData.petBreed || formData.petBreed === "") {
      foundErrors.petBreed = "Pet breed is required";
    } else if (formData.petBreed.length > 25) {
      foundErrors.petBreed = "Must not exceed 25 characters";
    }

    if (formData.petDescription.length > 100) {
      foundErrors.petDescription = "Must not exceed 100 characters";
    }

    // Check that image is not the LOADING_IMAGE and not empty
    if (petImage === LOADING_IMAGE || !petImage) {
      foundErrors.petImage = "Please make sure a photo has been loaded";
    }

    setErrors(foundErrors);

    // Return true if no errors (foundErrors is empty), false if errors found
    return Object.keys(foundErrors).length === 0;
  };

  const uploadImage = (base64Img, setPetImage) => {
    // Uploads an image to Imgur and sets the petImage state to the uploaded image URL
    const DEFAULT_IMAGE =
      "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";

    // Set loading image while the chosen image is being uploaded
    setPetImage(LOADING_IMAGE);

    const formData = new FormData();
    formData.append("image", base64Img);

    fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: "Client-ID 736cd8c6daf1a6e",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          console.log(`Image successfully uploaded: ${res.data.link}}`);
          setPetImage(res.data.link);
        } else {
          console.log("Image failed to upload - setting default image");
          setPetImage(DEFAULT_IMAGE);
        }
      })
      .catch((err) => {
        console.log("Image failed to upload:", err);
        setPetImage(DEFAULT_IMAGE);
      });
  };

  const handleChoosePhoto = async () => {
    /**
     * This function is used to choose a photo from the user's photo library.
     * It will call the ImagePicker API to open the photo library and allow the user to choose a photo.
     * It will then set the petImage state to the chosen photo.
     */
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        if (result.assets[0].uri.startsWith("http")) {
          // Image is a URL, so leave it as is
          setPetImage(result.assets[0].uri);
        } else {
          // Image is a local file path, so upload to Imgur
          let base64Img = result.assets[0].base64;
          uploadImage(base64Img, setPetImage);
        }
      }
    }
  };

  const handleTakePhoto = async () => {
    /**
     * This function is used to take a photo from the user's camera.
     * It will call the ImagePicker API to open the camera and allow the user to take a photo.
     * It will then set the petImage state to the taken photo.
     */
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        // Upload to Imgur
        let base64Img = result.assets[0].base64;
        uploadImage(base64Img, setPetImage);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <FlatList
        data={[{ key: "form" }]}
        renderItem={() => (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Center w="100%">
              <Box safeArea p="2" py="8" w="90%" maxW="290">
                <VStack>
                  <Heading
                    size="lg"
                    fontWeight="600"
                    color="coolGray.800"
                    _dark={{ color: "warmGray.50" }}
                  >
                    Update your Pet
                  </Heading>
                  <VStack space={3} mt="5">
                    <FormControl isInvalid={"petName" in errors}>
                      <FormControl.Label>Pet Name</FormControl.Label>
                      <Input
                        onChangeText={(value) => setPetName(value)}
                        value={petName} // Set the input value to the current petName
                      />
                      {"petName" in errors && (
                        <FormControl.ErrorMessage>
                          {errors.petName}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petImage" in errors}>
                      <FormControl.Label>Photo</FormControl.Label>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {petImage && (
                          <Image
                            source={{ uri: petImage }}
                            style={{ width: 200, height: 200 }}
                          />
                        )}
                      </View>
                      <Button variant="ghost" onPress={handleChoosePhoto}>
                        Choose From Library
                      </Button>
                      <Button variant="ghost" onPress={handleTakePhoto}>
                        Take Photo
                      </Button>
                      {"petImage" in errors && (
                        <FormControl.ErrorMessage>
                          {errors.petImage}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petType" in errors}>
                      <FormControl.Label>Choose Pet Type</FormControl.Label>
                      <Select
                        placeholder="Select a pet type"
                        selectedValue={petType}
                        onValueChange={(value) => setPetType(value)} // Update petType state
                      >
                        <Select.Item
                          label="Select a pet"
                          value=""
                          disabled
                          hidden
                        />
                        {petTypeOptions.map((option, index) => (
                          <Select.Item
                            key={index}
                            label={option.label}
                            value={option.value}
                          />
                        ))}
                      </Select>
                      {"petType" in errors && (
                        <FormControl.ErrorMessage>
                          {errors.petType}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petBreed" in errors}>
                      <FormControl.Label>Pet Breed</FormControl.Label>
                      <Input
                        onChangeText={(value) => setPetBreed(value)}
                        value={petBreed} // Set the input value to the current petBreed
                        placeholder="Enter pet breed"
                      />
                      {"petBreed" in errors && (
                        <FormControl.ErrorMessage>
                          {errors.petBreed}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petDescription" in errors}>
                      <FormControl.Label>Pet Description</FormControl.Label>
                      <Input
                        onChangeText={(value) => setPetDescription(value)}
                        value={petDescription} // Set the input value to the current petDescription
                        placeholder="Please describe more about your pet"
                      />
                      {"petDescription" in errors && (
                        <FormControl.ErrorMessage>
                          {errors.petDescription}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <Button
                      mt="2"
                      bgColor={Color.NENO_BLUE}
                      disabled={isButtonDisabled}
                      opacity={!isButtonDisabled ? 1 : 0.6}
                      onPress={onEditPetPress}
                    >
                      {buttonText}
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            </Center>
          </Box>
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default EditPetPage;
