import { useNavigation } from "@react-navigation/native";
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Link, Modal, View} from "native-base";
import { Dimensions, SafeAreaView } from "react-native";
import { Color } from "../components/atomic/Theme";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PetCard from "../components/PetCard";
import { Checkbox } from "native-base";
import { DeleteIcon } from "native-base";
import DeleteUserModal from "../components/DeleteUserModal";
import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";
import pet, { selectPet } from "../store/pet";
import LogoutButton from '../components/LogoutButton';
import { logout } from '../store/user';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linking } from 'react-native';
import { PaperProvider } from "react-native-paper";

export default function ProfilePage({ navigation: { navigate } }) {
  const navigation = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { API_URL } = useSelector((state) => state.api);
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const myPet = {
    name: "",
    image_url: "",
    animal: "",
    breed: "",
    description: "",
    owner_id: USER_ID,
  };
  dispatch(selectPet(myPet));

	const [pets, setPets] = useState([]);
	const [user, setUser] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

	useEffect(() => {
		if (isFocused) {
			fetchOwnerPets();
			fetchProfileInfo();
      setEditMode(false);
		}
	}, [isFocused]);

	const fetchOwnerPets = async () => {
		try {
			const url = `${API_URL}/get_owner_pets?owner_id=${USER_ID}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID
				}
			});

			if (!response.ok) {
				throw new Error('Request failed with status ' + response.status);
			}
			const pets = await response.json();
			setPets(pets);
			//const petTuples = data.map( (pet) => [pet["name"], pet["id"]]);

			//setDropdownOptions(petTuples)
		} catch (error) {
			console.log("error in profile page")
			console.log(error);
		}
	}

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error('Could not open the URL:', url);
      }
    } catch (error) {
      console.error('An error occurred while opening the URL:', error);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

	// Retrieve Profile Information
	const fetchProfileInfo = async () => {
		try {
			const url = `${API_URL}/retrieve_profile?user_id=${USER_ID}`;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID
				}
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error('Request failed with status ' + response.status);
			}
			const profile_info = result[0];
			const name = profile_info[0];
			const email_address = profile_info[1];
			const phone_number = profile_info[2];
			setUser({ name: name, email: email_address, phone: phone_number });
		} catch (error) {
			console.log("error in profile page")
			console.log(error);
		}
	}

  const deletePet = async (petId) => {
    try {
      const url = `${API_URL}/delete_pet?pet_id=${petId}`;
      const response = await fetch(url, {
        method: "DELETE",
        // Send request to delete pet.
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'User-ID': USER_ID
        },
      });

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

    } catch (error) {
      console.log("Error in profile page");
      console.log(error);
    }
  };

  const deleteSelectedPets = async () => {
    try {

      console.log("selectedPets: ", selectedPets);
  
      for (const pet of selectedPets) {
        await deletePet(pet.id);
      }

      await fetchOwnerPets();
  
      // Clear the selectedPets array
      setSelectedPets([]);
      setEditMode(false);
  
      console.log("All selected pets, reports, and sightings deleted successfully");
    } catch (error) {
      console.error("Error in deleteSelectedPets:", error);
    }
  };
  

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const name = user.name;
  const email = user.email;
  const phone = user.phone;

  const petCards = () => {
    if (pets.length > 0) {
      return (
        <VStack>
          {pets.map((pet, index) => (
            <Box
              key={index}
              width={editMode ? "72%" : "80%"}
              paddingHorizontal={editMode ? 3 : 0}
              marginBottom={editMode ? 4 : 0}
              position="relative" // To enable absolute positioning of the edit icon
            >
              <HStack width="100%">
                {editMode && (
                  <VStack
                    alignItems="center"
                    justifyContent="center"
                    width={3}
                    marginEnd={10}
                  >
                    <Checkbox
                      isChecked={selectedPets.includes(pet)}
                      onChange={(isChecked) => {
                        if (isChecked) {
                          // If the checkbox is checked, add the pet to the selectedPets array
                          setSelectedPets((prevSelectedPets) => [
                            ...prevSelectedPets,
                            pet,
                          ]);
                        } else {
                          // If the checkbox is unchecked, remove the pet from the selectedPets array
                          setSelectedPets((prevSelectedPets) =>
                            prevSelectedPets.filter((selectedPet) => selectedPet !== pet)
                          );
                        }
                      }}
                      aria-label={`Select ${pet.name}`}
                      marginEnd={20}
                    ></Checkbox>
                  </VStack>
                )}
                <VStack width="100%">
                  {/* Pet Card Content */}
                  <PetCard
                    color={Color.NENO_BLUE}
                    pet={pet}
                    onClick={() => {
                      dispatch(selectPet(pet));
                      navigate("Edit Pet Page");
                    }}
                    onUpdate={fetchOwnerPets}
					editMode={editMode} 
                  />
                </VStack>
              </HStack>
              {editMode && (
                <Button
                  position="absolute"
                  bottom={5}
                  right={2}
                  size="sm"
                  bg="transparent"
                  onPress={() => {
                    // navigate to edit pet page
                    dispatch(selectPet(pet));
                    navigate("Edit Pet Page");
                  }}
                >
                  <Image
                    size={19.5}
                    alt="Edit"
                    source={require("../assets/edit-icon.webp")}
                  />
                </Button>
              )}
            </Box>
          ))}
        </VStack>
      );
    } else {
      return <></>;
    }
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <PaperProvider>
      <SafeAreaView style={{ height: "100%" }}>
      <ScrollView style={{backgroundColor: 'white' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
          {/* Your Page Header */}
          <Text
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.8)',
              position: 'absolute',
              top: 30,
              zIndex: 1,
            }}
          >
            PROFILE
          </Text>
          {/* Cog Icon */}
          {/* Button */}
          <Button
              style={{
                width: 50,
                height: 50,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                borderRadius: 50,
                top: 17,
                right: 10,
                position: 'absolute',
                zIndex: 1,
              }}
              onPress={() => {
                toggleDropdown();
              }}
            >
              <Ionicons
                name="settings-outline"
                size={25}
                color='rgba(255, 255, 255, 0.8)'
              />
            </Button>


            {isDropdownOpen && (
              <Box
                style={{
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: 70,
                  right: 20,
                  width: 150,
                  borderRadius: 5,
                  zIndex: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3, // For Android
                }}
              >
                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    toggleDropdown();
                    setSelectedPets([]);
                    if (pets.length > 0)
                      setEditMode(true);
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    // set notifications
                  }}
                >
                  <Text>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    openLink('https://docs.google.com/document/d/1JnLxuZf_ELNUQptn7H71IjDpMYgeFg43LLitybX1MZ8/edit?usp=sharing');
                  }}
                >
                  <Text>Terms of Use</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    openLink('https://docs.google.com/document/d/1deTDNJJdMBqrisotJRy35lA9JQfQgItkFpE1_erhNss/edit?usp=sharing')
                  }}
                >
                  <Text>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    setDeleteModalVisible(true)
                  }}
                >
                  <Text>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    handleLogout();
                  }}
                >
                  <Text>Logout</Text>
                </TouchableOpacity>
              </Box>
            )}
            
        <LinearGradient
          colors={['#FF5733', '#FFA500']} // Gradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: windowWidth,
            height: windowHeight / 3.2, // Adjust this to control the gradient height
          }}
        >

          {/* Wrapping View with Shadow */}
          <View
            style={{
              shadowColor: "#A9A9A9",
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >

            {/* Circular foreground */}
            <Box
              style={{
                backgroundColor: "#FFFFFF",
                height: windowWidth *1.8,
                width: windowWidth *1.8,
                marginTop: windowWidth * 1.8,
                borderRadius: windowWidth,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

                {/* Profile Name */}
                <Text
                  style={{
                    fontSize: 20,
                    color: 'rgba(0, 0, 0, 0.8)',
                    position: 'absolute',
                    top: 50,
                  }}
                >
                  {name}
                </Text>

                {/* Profile email */}
                <Text
                  style={{
                    fontSize: 15,
                    color: 'rgba(0, 0, 0, 0.4)',
                    position: 'absolute',
                    top: 80,
                  }}
                >
                  {email}
                </Text>

                {/* Profile phone number */}
                <Text
                  style={{
                    fontSize: 15,
                    color: 'rgba(0, 0, 0, 0.4)',
                    position: 'absolute',
                    top: 100,
                  }}
                >
                  {phone}
                </Text>
            </Box>

          </View>

        </LinearGradient>

        {isLogoutModalVisible && (
          <LogoutModal
            logoutModalVisible={isLogoutModalVisible}
            setLogoutModalVisible={setIsLogoutModalVisible}
          />
        )}

          <DeleteUserModal visible={deleteModalVisible} setVisible={setDeleteModalVisible} />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HStack mt="6" justifyContent="flex-start" alignItems="center" marginBottom={2}>
            < HStack style={{marginRight:editMode ? 60 : windowWidth / 1.8, alignItems: 'center'}}>
            <Heading
              fontSize="sm"
              color="coolGray.600"
              _dark={{ color: "warmGray.200" }}
              marginLeft={10}
            >
              PETS
            </Heading>

            <TouchableOpacity
              style={{
                width: 18,
                height: 18,
                backgroundColor: 'warmGray.200',
                borderRadius: 50,
                marginLeft: 10,
                marginBottom: 6,
                marginRight: 15,
              }}
              onPress={() => {
                navigate("New Pet Page");
              }}
            >
              <Text style={{ color: 'black', fontSize: 18 }}>+</Text>
            </TouchableOpacity>
            </HStack>
          

          {editMode ? (
            <HStack alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  if (selectedPets.length > 0) {
                    deleteSelectedPets();
                  }
                }}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  marginTop: 0,
                  marginRight: 10,
                }}
                activeOpacity={0.7}
              >
                <DeleteIcon color="#FF0000" />
              </TouchableOpacity>

              <Text marginLeft={-2}>{selectedPets.length}</Text>
              <Button
                size="sm"
                onPress={() => {
                  deleteSelectedPets();
                }}
                variant="link"
                marginLeft={5}
              >
                Done
              </Button>
            </HStack>
          ) : (
              <></>
            )}
        </HStack>
        </View>


          {petCards()}

          </View>

      </ScrollView>
    </SafeAreaView>
    </PaperProvider>
  );
}


function LogoutModal({ logoutModalVisible, setLogoutModalVisible }) {
	return <Modal isOpen={logoutModalVisible} onClose={() => setLogoutModalVisible(false)} size={"md"}>
		<Modal.Content >
			<Modal.CloseButton />
			<Modal.Header>Log Out?</Modal.Header>
			<Modal.Body>
				<Text>Are you sure you want to log out?</Text>
			</Modal.Body>

			<Modal.Footer>
				<Button.Group space={2}>
					<Button variant="ghost" colorScheme="blueGray" onPress={() => setLogoutModalVisible(false)} >
						Cancel
					</Button>
					<LogoutButton onPress={() => setLogoutModalVisible(false)} />
				</Button.Group>
			</Modal.Footer>
		</Modal.Content>
	</Modal>
}