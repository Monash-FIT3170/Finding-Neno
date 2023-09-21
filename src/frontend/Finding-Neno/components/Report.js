import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableHighlight, View } from 'react-native'
import { Dimensions } from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { HStack, Heading, Image, Modal, VStack, Text } from 'native-base';
import { Button } from 'react-native-paper';
import { Color } from './atomic/Theme';


const Report = ({ report, userId }) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width;

    const lastSeen = report[1];
    const reportDesc = report[2];
    const locationLongitude = report[3];
    const locationLatitude = report[4];
    const authorId = report[14]

    const petName = report[6][0].toUpperCase() + report[6].substring(1);
    const petSpecies = report[7][0].toUpperCase() + report[7].substring(1);;
    const petBreed = report[8][0].toUpperCase() + report[8].substring(1);;
    const petImage = report[9];

    const [showModal, setShowModal] = useState(false);
    const [suburb, setSuburb] = useState("");

    const [enlargeImage, setEnlargeImage] = useState(false);
    const [smallImageLoading, setSmallImageLoading] = useState(false);
    const [largeImageLoading, setLargeImageLoading] = useState(false);

    const closeImageModal = () => {
        setEnlargeImage(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        getSuburb();
    }, [])

    // Retrieve suburb info from OpenStreetMap API by reverse geocoding
    const getSuburb = async () => {
        var suburb = null;
        try {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${locationLatitude}&lon=${locationLongitude}&format=json`;

            const response = await fetch(apiUrl);

            const result = await response.json();

            suburb = `${result.address.suburb ? result.address.suburb : (result.address.city ? result.address.city : "")}`
            state = `${result.address.state ? result.address.state : ""}`;

        } catch (error) {
            console.error('Error fetching data:', error);
        }

        if (suburb != null) {
            setSuburb(`${suburb}${suburb && state ? "," : ""} ${state}`);
        }
        else {
            setSuburb("Location information unavailable");
        }
    };

    return (
        <View style={{maxWidth: "90%", marginTop: "2%", backgroundColor: 'white', borderRadius: 30}}>
            <Modal width='100%' alignItems='center' justifyItems='center' isOpen={enlargeImage} onClose={closeImageModal} marginY={5}>
                <Modal.CloseButton />
                {/* {   
                    largeImageLoading && <ActivityIndicator size='large' style={{ top: '50%', left: '50%', position: 'absolute' }}/>
                } */}
                <Image source={{ uri: petImage }} style={{ maxHeight: '50%', maxWidth: '50%', aspectRatio: 1 }} alt={`Enlarged image of missing pet ${petName}`} />
            </Modal>
            {/* Info */}
            
            <HStack maxWidth="100%" alignItems={'center'}>
                <View style={{margin: 15, marginRight: 0, marginBottom: 0, width: "45%", aspectRatio: 1}} >
                        {   
                            smallImageLoading && <ActivityIndicator style={{ top: '50%', left: '50%', position: 'absolute' }}/>
                        }
                        <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD" style={{ borderRadius: 20, padding: 5 }}>
                            <Image onLoadStart={() => setSmallImageLoading(true)} onLoadEnd={() => setSmallImageLoading(false)} source={{ uri: petImage }} style={{ maxHeight: '100%', aspectRatio: 1, borderRadius: 20 }} alt={`Image of missing pet ${petName}`}  />
                        </TouchableHighlight>
                </View>

                <View style={{ maxWidth: " 50%" }} height={200} bg="#F9FDFF">
                    <Heading size="xl" paddingLeft={5} paddingTop={2}>{petName}</Heading>

                    <VStack>
                        <HStack>
                            <VStack>
                                <Heading size="sm" paddingLeft={5} paddingTop={2}>Species</Heading>
                                <Text paddingLeft={5}>{petSpecies}</Text>
                            </VStack>

                            <VStack>
                                <Heading size="sm" paddingLeft={5} paddingTop={2}>Breed</Heading>
                                <Text paddingLeft={5}>{petBreed}</Text>
                            </VStack>

                            
                        </HStack>

                        <Heading size="sm" paddingLeft={5} paddingTop={2}>Last seen</Heading>
                        <Text paddingLeft={5}>{lastSeen}</Text>
                        <Heading size="sm" paddingLeft={5} paddingTop={2}>{suburb}</Heading>

                    </VStack>
                </View>
            </HStack>

            <VStack>
                <Text paddingLeft={5}>{reportDesc}</Text>
            </VStack>

            {/* Buttons */}
            <HStack maxWidth={'100%'} justifyContent={"space-between"} margin={3} marginTop={0}>
                {
                    // Controls what the owner of the report sees. If user is owner of the report, they
                    // won't be displayed with the option to report a sighting.
                    authorId != userId ?
                        <Button style={{ width: '70%' }} buttonColor={Color.NENO_BLUE} compact={true} icon="eye" mode="contained" 
                            onPress={() => setShowModal(true)}>Report a Sighting</Button>
                            
                     : ""
                }
                <Button style={{ width: authorId == userId ? '100%' : '29%' }} buttonColor={Color.NENO_BLUE} compact={true} icon="export-variant" mode="contained">Share</Button>
            </HStack>

            {/* Modal for reporting a sighting */}
            {
                authorId != userId ?
                    <ReportSightingModal
                        report={report}
                        userId={userId}
                        closeModal={closeModal}
                        showModal={showModal}
                    /> : ""
            }
        </View>
    );
};

export default Report;

