import React, { useState } from 'react';
import { View } from 'react-native'
import { Dimensions } from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Report = ({ userId, sighting }) => {
	// Pet Data
	const windowWidth = Dimensions.get('window').width;

	const id = sighting[0];
	const missingReportId = sighting[1];
	const authorId = sighting[2];
	const dateTime = sighting[3];
	const locationLongitude = sighting[4];
	const locationLatitude = sighting[5];
	const sightingImage = sighting[6];
	const sightingDesc = sighting[7];
	const sightingAnimal = sighting[8][0].toUpperCase() + sighting[8].substring(1);
	const sightingBreed = sighting[9] ? sighting[9][0].toUpperCase() + sighting[9].substring(1) : null;
	const ownerId = sighting[11];
	const ownerName = sighting[11];
	const ownerEmail = sighting[12];
	const sightingPhoneNumber = sighting[13];
	const distance = sighting[14] ? Math.round(parseFloat(sighting[14] * 100)) / 100 : null;


	return (
		<View justifyContent="center" alignItems="center" padding={4}>
			{/* TODO: unhard code the heights, widths etc later */}
			<Box width={windowWidth - 20} height={sightingImage ? 400 : 250} bg="#F9FDFF" borderRadius={15} paddingLeft={5} paddingTop={2}>
				<Heading size="lg" paddingTop={3}>
					Glen Waverley, 3150
				</Heading>

				<Heading size="sm" paddingTop={2}>
					{dateTime}
				</Heading>

				<Text paddingTop={2}>
					{sightingDesc}
				</Text>

				<HStack space={8}>
					<VStack>
						<Heading size="sm" paddingTop={2}>
							Specie
						</Heading>
						<Text >
							{sightingAnimal}
						</Text>
					</VStack>

					<>
						{
							sightingBreed &&
							<VStack>
								<Heading size="sm" paddingTop={2}>
									Breed
								</Heading>
								<Text>
									{sightingBreed}
								</Text>
							</VStack>
						}
					</>

					<>
						{
							distance &&
							<VStack>
								<Heading size="sm" paddingLeft={5} paddingTop={2}>
									Distance
								</Heading>
								<Text paddingLeft={5}>
									{distance} km
								</Text>
							</VStack>
						}
					</>
				</HStack>

				<Box width={windowWidth - 40} height={180} paddingTop={5} paddingBottom={1} paddingRight={5}>
					{sightingImage && <Image source={{ uri: sightingImage }} style={{ width: '100%', height: '100%', borderRadius: 10, marginBottom: 8 }} alt="pet" />}

					<Button width={'100%'} borderRadius={10} paddingTop={3}>
						Share
					</Button>

				</Box>

			</Box>
		</View>
	);
};

export default Report;

