import React, {useState} from 'react';
import { View } from 'react-native'
import {Dimensions} from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';


const Report = ({report, userId}) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width; 

    const lastSeen = report[1];
    const reportDesc = report[2];
    const location = report[3];
    
    const petName = report[6][0].toUpperCase() +report[6].substring(1);
    const petSpecies = report[7];
    const petBreed = report[8];
    const petImage = report[9];

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
    <View justifyContent = "center" alignItems = "center" padding={4}>
    <Box width={windowWidth - 20} height={400} bg="#F9FDFF" borderRadius={15}>
      <Heading size = "xl" paddingLeft={5} paddingTop={2}>
      {petName}
      </Heading>
      <Text paddingLeft={5}>
        last seen {lastSeen}
      </Text>

      <Heading size = "sm" paddingLeft={5} paddingTop={2}>
        need to add location here
      </Heading>

      <HStack>
        <VStack>
          <Heading size = "sm" paddingLeft={5} paddingTop={2}>
            {petSpecies}
          </Heading>
          <Text paddingLeft={5}>
            Species
          </Text>
        </VStack>

        <VStack>
          <Heading size = "sm" paddingLeft={5} paddingTop={2}>
              {petBreed}
          </Heading>
          <Text paddingLeft={5}>
              Breed
          </Text>
        </VStack>
      </HStack>

      <Box width={windowWidth - 40} height={180} paddingLeft={5} paddingTop={5} paddingBottom={1}>
      <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20  }} alt='pet' />

      <HStack width={'100%'} height={10} marginTop = {2} spacing = {0}>
        <ReportSightingModal
					report={report}
					userId={userId}
					closeModal={closeModal}
          showModal={showModal}
				/>
        <Button width={'70%'} borderBottomLeftRadius={10} borderTopRightRadius={0}  borderBottomRightRadius={0} 
          marginRight = {'2%'}
                onPress={() => setShowModal(true)}>
          Report a Sighting
        </Button>

      
        <Button width={'28%'} borderBottomLeftRadius={0} borderTopLeftRadius={0}  borderBottomRightRadius={10}>
          Share
        </Button>
    
      </HStack>
      </Box>

    </Box>
    </View>
  );
};

export default Report;

