import React, {useEffect, useState} from 'react';
import { View } from 'react-native'
import { Dimensions } from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Report = ({ report, userId }) => {
  // Pet Data
  const windowWidth = Dimensions.get('window').width;

  const lastSeen = report[1];
  const reportDesc = report[2];
  const locationLongitude = report[3];
  const locationLatitude = report[4];
  const locationString = report[5];
  const authorId = report[15]
  
  const petName = report[7][0].toUpperCase() +report[7].substring(1);
  const petSpecies = report[8][0].toUpperCase() +report[8].substring(1);;
  const petBreed = report[9][0].toUpperCase() +report[9].substring(1);;
  const petImage = report[10];
  const distance = report[16] != null ? Math.round(parseFloat(report[16] * 100)) / 100 : null;

  const [showModal, setShowModal] = useState(false);

	const closeModal = () => {
		setShowModal(false);
	}

	const handleOpenSightingModal = (report) => {
		// console.log('hancling open sighting modal');
		setShowModal(true);
	};
	// console.log("SHOW MODAL")
	// console.log(showModal)

    
  return (
    <View justifyContent="center" alignItems="center" padding={4}>
      <Box width={windowWidth - 20} height={400} bg="#F9FDFF" borderRadius={15}>
        <Heading size="xl" paddingLeft={5} paddingTop={2}>
          {petName}
        </Heading>
        <Text paddingLeft={5}>
          Last seen {lastSeen}
        </Text>

      <Heading size = "sm" paddingLeft={5} paddingTop={2}>
        {/* Insert "Suburb, State" here */}
        {locationString}
      </Heading>

        <Text paddingLeft={5}>
          {reportDesc}
        </Text>

				<HStack>
					<VStack>
						<Heading size="sm" paddingLeft={5} paddingTop={2}>
							Species
						</Heading>
						<Text paddingLeft={5}>
							{petSpecies}
						</Text>
					</VStack>

					<VStack>
						<Heading size="sm" paddingLeft={5} paddingTop={2}>
							Breed
						</Heading>
						<Text paddingLeft={5}>
							{petBreed}
						</Text>
					</VStack>

					<>
						{
							distance != null &&
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



        <Box width={windowWidth - 40} height={180} paddingLeft={5} paddingTop={5} paddingBottom={1}>
          <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} alt='pet' />


          <HStack width={'100%'} height={10} marginTop={2} spacing={0}>

            {authorId != userId ?
              <>
                <ReportSightingModal
                  report={report}
                  userId={userId}
                  closeModal={closeModal}
                  showModal={showModal}
                />
                <Button width={'70%'} borderBottomLeftRadius={10} borderTopRightRadius={0} borderBottomRightRadius={0}
                  marginRight={'2%'}
                  onPress={() => setShowModal(true)}>
                  Report a Sighting
                </Button>
              </> : ""
            }

            <Button width={authorId == userId ? '100%' : '28%'} borderBottomLeftRadius={authorId == userId ? 10 : 0} borderTopLeftRadius={authorId == userId ? 5 : 0} borderBottomRightRadius={10}>
              Share
            </Button>

          </HStack>
        </Box>

      </Box>
    </View>
  );
};

export default Report;

