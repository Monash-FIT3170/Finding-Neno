import {useNavigation} from '@react-navigation/native';
import { Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView} from "native-base";
import {Dimensions} from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import store from '../store/store';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
	const IP = useSelector((state) => state.IP);
	const PORT = useSelector((state) => state.PORT);
  const USER_ID = useSelector((state) => state.userId);
  const ACCESS_TOKEN = useSelector((state) => state.accessToken);

  const windowWidth = Dimensions.get('window').width; 
  const navigation = useNavigation();
  const toast = useToast();
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(!modalVisible);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    toast.show({
      description: "Owner has been alerted of your sighting!",
      placement: "top"
    })
  };
    // TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
    const [reports, setReports] = useState([]);

    useEffect(() => {
      if (isFocused) {
        fetchAllReports();
      }
    }, [isFocused]);
  
    const fetchAllReports = async () => {
      try {
        const response = await fetch(`${IP}:${PORT}/get_missing_reports`);
        const data = await response.json();
        setReports(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
   // TODO: replace mock data with real data
  const image = "https://wallpaperaccess.com/full/317501.jpg";
//
//   const mocks = [{ownerName: 'Sashenka', petName:'Piggy', species: 'Dog', breed: 'Shiba', isActive: true, lastLocation: 'Clayton, Victoria', lastDateTime: '12th May, 12:45pm', petImage: "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq"},
//                   {ownerName: 'Sash', petName:'Bunny', species: 'Rabbit', breed: 'RabbitBreed', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm', petImage: "https://cf.ltkcdn.net/small-mammals/small-mammal-names/images/orig/322037-1600x1066-white-rabbit.jpg"},
//                   {ownerName: 'Ana', petName:'Noni', species: 'Cat', breed: 'House cat', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm', petImage:"https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTk2NzY3MjA5ODc0MjY5ODI2/top-10-cutest-cat-photos-of-all-time.jpg"},
//                   {ownerName: 'Alina', petName:'Liza', species: 'Dog', breed: 'Yorkshire Terrier', isActive: true, lastLocation: 'Berwick, Victoria', lastDateTime: '11th May, 11:00pm', petImage: "https://www.shutterstock.com/image-photo/cute-dog-photography-yorkshire-terrier-260nw-1792147286.jpg"},
//                   {ownerName: 'Jason', petName:'Yoyo', species: 'Bird', breed: 'Parrot', isActive: true, lastLocation: 'Glen Waverley, Victoria', lastDateTime: '11th May, 1:00pm', petImage: "https://www.thesprucepets.com/thmb/iMtikD4KQeIl73kPe134Hu2TOH4=/4933x0/filters:no_upscale():strip_icc()/blue-budgie-511936470-dff4c0952d4a45ec80f9ac7f406cc71f.jpg"}
//               ]
//   const description = "cute and fluffy"

    const petImage = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq"

    return (
        <ScrollView style={{backgroundColor: 'white'}}>

          {/* REPORT SIGHTING MODAL */}
          <Modal isOpen={modalVisible} onClose={setModalVisible} >
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Confirm sighting</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Text>
                Please confirm that you have made a sighting of this pet before we alert the owner.
              </Text>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button bgColor={Color.NENO_BLUE} onPress={() => handleConfirm()}>
                Confirm 
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


            {/* {reports.map(({missing_report_id, owner_name, pet_name, pet_animal, pet_breed, location_latitude, location_longitude, date_time, description}) => ( */}
              {reports && reports.map((report, index) => (
               <View key={index} alignContent="center" paddingBottom={30}>
               <Box bg="#F5F5F5" borderRadius={15} padding={5} >
                 <HStack alignItems="center">
                     <Image 
                         alignSelf="center" size={36} borderRadius={18} 
                         source={{
                           uri: image
                         }} 
                         alt="User Image" 
                     /> 
                     <Box width={2}></Box>
                     <VStack>
                     <Heading size = "sm">
                       {report[10]}
                     </Heading>
                     {/* <Text style={{ color: 'black' }} fontSize="xs">{isHidden ? userPhoneHidden : userPhone}</Text> */}
                     </VStack>
                     <Box width={70}></Box>
                     {/* <Button onPress={toggleVisibility}>
                     <Text>Show/Hide</Text>
                     </Button> */}
                 </HStack>
           
                 <Box height={5}></Box>
                 <Image 
                         alignSelf="center" width={windowWidth} height={125} borderRadius={5}
                         source={{
                           uri: petImage
                         }} 
                         alt="Pet Image" 
                     /> 
                 <Box height={2}></Box>
                 <HStack>
                   <Heading size = "md">
                   {report[6]}
                   </Heading>
                 </HStack>
                 <HStack justifyContent="flex-start" space={10}>
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Pet Type
                     </Heading>
                     <Text fontSize="sm">
                     {report[7]}
                     </Text>
                   </VStack>
           
                   <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Breed
                     </Heading>
                     <Text fontSize="sm">
                     {report[7]}
                     </Text>
                   </VStack>
                 </HStack>
                 
                 <VStack>
                     <Heading size = "sm" color="#B8B8B8">
                       Description
                     </Heading>
                     <Text fontSize="sm">
                     {report[2]}
                     </Text>
                 </VStack>
           
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Seen Time
                     </Heading>
                     <Text fontSize="sm">
                     {report[1]}
                     </Text>
                 </HStack>
                 
                 <HStack justifyContent="space-between">
                 <Heading size = "sm">
                       Last Known Location
                     </Heading>
                     <Text fontSize="sm">
                       Longitude: 
                     {report[3]}
                     , 
                     Latitude:
                     {report[4]}
                     </Text>
                     
                 </HStack>
                 <VStack>
                 <Button mt="2" bgColor={Color.NENO_BLUE} onPress={() => handlePress()}>
                    Report a sighting
                  </Button>
                 </VStack>
                 
                 
               </Box>
               </View>
            ))}
        </ScrollView>
    );
}

export default DashboardPage;