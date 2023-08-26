import { useNavigation } from '@react-navigation/native';
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Link } from "native-base";
import { Dimensions } from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import PetCard from "../components/PetCard";

import { useSelector, useDispatch } from "react-redux";
import store from '../store/store';
import { selectPet } from '../store/pet';

export default function ProfilePage({ navigation: { navigate } }) {
	const navigation = useNavigation();

	const { IP, PORT } = useSelector((state) => state.api)
	const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

	const isFocused = useIsFocused();
	const dispatch = useDispatch();

	const myPet = {
		name: '',
		image_url: '',
		animal: '',
		breed: '',
		description: '',
		owner_id: USER_ID,
	};
	dispatch(selectPet(myPet));

	const [pets, setPets] = useState([]);
	const [user, setUser] = useState([]);
	const [refreseh, setRefresh] = useState(false);
	console.log(refreseh)

	useEffect(() => {
		if (isFocused) {
			fetchOwnerPets();
			fetchProfileInfo();
			setRefresh(!refreseh);
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
			setUser({name: name, email: email_address, phone: phone_number});
		} catch (error) {
			console.log("error in profile page")
			console.log(error);
		}
	}

	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;


	// TODO: Replace with actual data
	const name = user.name;
	const email = user.email;
	const phone = user.phone;

	//const myPet = {name: 'Fluffy', image_url: 'file:///var/mobile/Containers/Data/Application/0665E6EF-36E6-4CFB-B1A3-CEE4BEE897F3/Library/Caches/ExponentExperienceData/%2540anonymous%252FFinding-Neno-cdca0d8b-37fc-4634-a173-5d0d16008b8f/ImagePicker/C1B3D22E-AB20-4864-A113-3989CCDCC0A8.jpg', animal: 'bird', breed: 'Per', description: 'A fluffy cat', owner_id: 1};

	const petCards = () => {
		if (pets.length > 0) {
			return pets.map((pet, index) => (
				<PetCard
					key={index}
					color={Color.NENO_BLUE}
					height={150}
					pet={pet}
				/>
			));
		} else {
			return <></>
		}
	}

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
						letterSpacing: "lg"
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
								alignSelf="center" size={70} borderRadius={35}
								source={{
									uri: "https://wallpaperaccess.com/full/317501.jpg"
								}}
								alt="Alternate Text"
							/>
						</Box>
						<Box width={9} />
						<Heading alignSelf="center" size="lg" fontWeight="600" color="warmGray.200" _dark={{ color: "coolGray.600", }} >
							{name}
						</Heading>
					</HStack>
				</Box>


				<VStack>
					<HStack mt="6" justifyContent="space-between">
						<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }} pr={windowWidth / 3.5}>
							USER DETAILS
						</Heading>
						<Text pl={windowWidth / 3.5}>
						</Text>
					</HStack>

					<Box h="2"></Box>

					<Box bg="gray.200" px="2" py="1" borderRadius="md">
						<HStack mt="2" justifyContent="space-between">
							<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								Email
							</Heading>
							<Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								{email}
							</Text>
						</HStack>
					</Box>

					<Box h="2"></Box>

					<Box bg="gray.200" px="2" py="1" borderRadius="md">
						<HStack mt="2" justifyContent="space-between">
							<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								Phone
							</Heading>
							<Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }}>
								{phone}
							</Text>
						</HStack>
					</Box>

				</VStack>

				<Box height={1} />



				<VStack>
					<HStack mt="6" justifyContent="space-between" alignItems="center">
						<Heading fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200", }} pr={windowWidth / 3.5}>
							PETS
						</Heading>
						<Button pl={windowWidth / 3} variant="link">
							Edit
						</Button>
					</HStack>


					<Button
						onPress={() => {
							navigate('New Pet Page')
						}
						}
						width={windowWidth - 80}
						height="40px"
					>
						Add New Pet
					</Button>
					<Box h="4"></Box>
					{petCards()}



				</VStack>


			</Box>
		</ScrollView>
	)
}