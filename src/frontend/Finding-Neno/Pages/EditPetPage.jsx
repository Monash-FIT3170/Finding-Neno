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
  WarningOutlineIcon,
} from "native-base";
import { View, Image, FlatList, useColorScheme } from "react-native";
import { Color } from "../components/atomic/Theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import store from "../store/store";

import { petTypeOptions } from "./shared";
import { Subheading } from "react-native-paper";
import ImageHandler from "../components/ImageHandler.jsx";
import { Dropdown } from "react-native-element-dropdown";

const EditPetPage = ({ navigation: { navigate }, route }) => {
  /**
   * This page is used to edit an existing pet.
   * It takes in the pet object as a parameter, it will edit the existing pet, and call the PUT method '/update_pet' to update the pet.
   */

  const { API_URL } = useSelector((state) => state.api);
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
  const pet = useSelector((state) => state.pet);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState("Update Pet");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const toast = useToast();
  const scheme = useColorScheme();
  const { colors } = useTheme();

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

    if (formData.petDescription.length > 500) {
      foundErrors.petDescription = "Must not exceed 500 characters";
    }

    // Check that image is not the LOADING_IMAGE and not empty
    if (petImage === LOADING_IMAGE || !petImage) {
      foundErrors.petImage = "Please make sure a photo has been loaded";
    }

    setErrors(foundErrors);

    // Return true if no errors (foundErrors is empty), false if errors found
    return Object.keys(foundErrors).length === 0;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <FlatList
        data={[{ key: "form" }]}
        renderItem={() => (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Center w="100%">
              <Box safeArea p="2" py="8" w="300">
                <VStack>
                  <Heading
                    size="lg"
                    fontWeight="600"
                    color={colors.primary}
                  >
                    Update Pet Details
                  </Heading>
                  <Subheading style={{ color: colors.text }}>Update your pet's information.</Subheading>
                  <VStack space={3} mt="5">
                    <FormControl isInvalid={"petName" in errors} isRequired>
                      <FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Name</Text></FormControl.Label>
                      <Input _input={{selectionColor: colors.primary}} size='lg' color={colors.text}
                        onChangeText={(value) => setPetName(value.trim())}
                        value={petName} // Set the input value to the current petName
                      />
                      {"petName" in errors && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.petName}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    
                    <ImageHandler image={petImage} setImage={setPetImage} setIsButtonDisabled={setIsButtonDisabled}
                      isRequired={true} error={'petImage' in errors}/>

                    <FormControl isInvalid={"petType" in errors} isRequired>
                      <FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Type</Text></FormControl.Label>
                      <Dropdown data={petTypeOptions} placeholder='Select a pet type' 
                        style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 4}}
                        placeholderStyle={{color: 'darkgray', marginHorizontal: 13}}
                        itemTextStyle={{color: colors.text}}
                        itemContainerStyle={{backgroundColor: colors.background}}
                        containerStyle={{backgroundColor: colors.background}}
                        selectedTextStyle={{color: colors.text, marginHorizontal: 13}}
                        iconStyle={{marginRight: 10}}
                        activeColor={ scheme === 'dark' ? '#313338' : '#dbdbdb' }
                        onChange={(item) => setFormData({ ...formData, petType: item.value })}
                        labelField='label' valueField='value'
                        value={petType}
                      />
                      {"petType" in errors && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.petType}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petBreed" in errors} isRequired>
                      <FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Breed</Text></FormControl.Label>
                      <Input _input={{selectionColor: colors.primary}} size='lg' color={colors.text}
                        onChangeText={(value) => setPetBreed(value.trim())}
                        value={petBreed} // Set the input value to the current petBreed
                        placeholder="Enter pet breed"
                      />
                      {"petBreed" in errors && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          {errors.petBreed}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={"petDescription" in errors} isRequired>
                      <FormControl.Label><Text fontWeight={500} color={colors.text}>Pet Description</Text></FormControl.Label>
                      <Input _input={{selectionColor: colors.primary}} size='lg' color={colors.text}
                        onChangeText={(value) => setPetDescription(value.trim())}
                        value={petDescription} // Set the input value to the current petDescription
                        placeholder="Please describe more about your pet"
                      />
                      {"petDescription" in errors && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
