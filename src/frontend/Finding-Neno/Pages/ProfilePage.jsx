import { useNavigation } from "@react-navigation/native";
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Link, Modal} from "native-base";
import { Dimensions } from "react-native";
import { Color } from "../components/atomic/Theme";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PetCard from "../components/PetCard";
import { Checkbox } from "native-base";
import { DeleteIcon } from "native-base";

import { useSelector, useDispatch } from "react-redux";
import store from "../store/store";
import pet, { selectPet } from "../store/pet";
import LogoutButton from '../components/LogoutButton';
import { logout } from '../store/user';

export default function ProfilePage({ navigation: { navigate } }) {
  const navigation = useNavigation();

  const { IP, PORT } = useSelector((state) => state.api);
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
	const [logoutModalVisible, setLogoutModalVisible] = useState(false);

	useEffect(() => {
		if (isFocused) {
			fetchOwnerPets();
			fetchProfileInfo();
      setEditMode(false);
		}
	}, [isFocused]);

	const fetchOwnerPets = async () => {
		try {
			const url = `${IP}:${PORT}/get_owner_pets?owner_id=${USER_ID}`;
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

	// Retrieve Profile Information
	const fetchProfileInfo = async () => {
		try {
			const url = `${IP}:${PORT}/retrieve_profile?user_id=${USER_ID}`;
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
      const url = `${IP}:${PORT}/delete_pet?pet_id=${petId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
					'User-ID': USER_ID,
        },
      });

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      if (response.status === 201) {
        await fetchOwnerPets(); // refresh the pet list
        console.log("Pet deleted successfully");
      } else if (response.status === 204) {
        console.log("Pet deleted successfully");
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.log("Error in profile page");
      console.log(error);
    }
  };

  const deleteSelectedPets = () => {
    // for each pet in selectedPets, get petID and delete it
    selectedPets.forEach((petId) => {
      deletePet(petId);
    });

    // After deletion, clear the selectedPets array
    setSelectedPets([]);
    setEditMode(false);
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
                      isChecked={selectedPets.includes(pet.id)}
                      onChange={(isChecked) => {
                        if (isChecked) {
                          // If the checkbox is checked, add the pet to the selectedPets array
                          setSelectedPets((prevSelectedPets) => [
                            ...prevSelectedPets,
                            pet.id,
                          ]);
                        } else {
                          // If the checkbox is unchecked, remove the pet from the selectedPets array
                          setSelectedPets((prevSelectedPets) =>
                            prevSelectedPets.filter((id) => id !== pet.id)
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

  return (
    <ScrollView>
      <Box alignItems="center" justifyContent="center">
        <Box
          alignSelf="center"
          _text={{
            alignSelf: "center",
            justifyContent: "center",
            fontSize: "lg",
            fontWeight: "medium",
            color: "warmGray.50",
            letterSpacing: "lg",
          }}
          bg={Color.NENO_BLUE}
          width={windowWidth}
          height={windowHeight / 8}
        >
          <Box height={3} />
          <HStack>
            <Box width={8} />
            <Box
              bg="#FFFFFF"
              height={76}
              width={76}
              borderRadius={38}
              alignSelf="center"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                alignSelf="center"
                size={70}
                borderRadius={35}
                source={{
                  uri: "https://wallpaperaccess.com/full/317501.jpg",
                }}
                alt="Alternate Text"
              />
            </Box>
            <Box width={9} />
            <Heading
              alignSelf="center"
              size="lg"
              fontWeight="600"
              color="warmGray.200"
              _dark={{ color: "coolGray.600" }}
            >
              {name}
            </Heading>
          </HStack>
        </Box>

        <VStack>
          <HStack mt="6" justifyContent="space-between">
            <Heading
              fontSize="sm"
              color="coolGray.600"
              _dark={{ color: "warmGray.200" }}
              pr={windowWidth / 3.5}
            >
              USER DETAILS
            </Heading>
            <Text pl={windowWidth / 3.5}></Text>
          </HStack>

          <Box h="2"></Box>

          <Box bg="gray.200" px="2" py="1" borderRadius="md">
            <HStack mt="2" justifyContent="space-between">
              <Heading
                fontSize="sm"
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
              >
                Email
              </Heading>
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
              >
                {email}
              </Text>
            </HStack>
          </Box>

          <Box h="2"></Box>

          <Box bg="gray.200" px="2" py="1" borderRadius="md">
            <HStack mt="2" justifyContent="space-between">
              <Heading
                fontSize="sm"
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
              >
                Phone
              </Heading>
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
              >
                {phone}
              </Text>
            </HStack>
          </Box>
					<Box h="2"></Box>

					<Button onPress={() => setLogoutModalVisible(true)} backgroundColor={"#FA8072"}>
						Logout
					</Button>

					<LogoutModal logoutModalVisible={logoutModalVisible} setLogoutModalVisible={setLogoutModalVisible} />

        </VStack>

        <Box height={1} />

        <VStack>
          <HStack mt="6" justifyContent="space-between" alignItems="center">
            <Heading
              fontSize="sm"
              color="coolGray.600"
              _dark={{ color: "warmGray.200" }}
              pr={windowWidth / 3.5}
            >
              PETS
            </Heading>

            {editMode ? (
              <HStack alignItems="center">
                <Button
                  size="sm"
                  marginTop={4}
                  onPress={deleteSelectedPets}
                  bg="transparent" // Make the button transparent
                >
                  <DeleteIcon color="#FF0000" />{" "}
                  {/* Change the color of DeleteIcon */}
                </Button>
                <Text marginLeft={-2}>{selectedPets.length}</Text>
                <Button
                  size="sm"
                  onPress={() => {
                    deleteSelectedPets();
                  }}
                  variant="link"
                  paddingLeft={6}
                >
                  Done
                </Button>
              </HStack>
            ) : (
              <Button
                pl={windowWidth / 3}
                variant="link"
                onPress={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </HStack>

          <Button
            onPress={() => {
              navigate("New Pet Page");
            }}
            width={windowWidth - 80}
            height="40px"
          >
            Add New Pet
          </Button>
          <Box h="4"></Box>
        </VStack>

        {petCards()}      </Box>


    </ScrollView>
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