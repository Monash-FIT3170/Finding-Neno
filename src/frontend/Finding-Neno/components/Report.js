import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, TouchableHighlight, View } from 'react-native'
import { Dimensions } from 'react-native';
import ReportSightingModal from '../components/ReportSightingModal';
import * as ImagePicker from 'expo-image-picker';
import { HStack, Heading, Image, VStack, Text } from 'native-base';
import { Button } from 'react-native-paper';
import { Color } from './atomic/Theme';
import { ScaleText } from 'react-scale-text';
import { formatDateTimeDisplay } from '../Pages/shared';
import ImageView from 'react-native-image-viewing';



const Report = ({ report, userId }) => {
    // Pet Data
    const lastSeen = new Date(report[1]);
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

    // Create the formatted string
    const formattedDate = formatDateTimeDisplay(lastSeen);

    // Set font size of pet name depending on length of name
    const [petNameFontSize, setPetNameFontSize] = useState(30);
    useEffect(() => {
        // Check the length of the pet's name and set the font size accordingly
        if (petName.length > 8) {
            setPetNameFontSize(23);
        }
        else if (petName.length > 12) {
            setPetNameFontSize(18);
        }
        else {
            setPetNameFontSize(30);
        }
    }, [petName]);

    const [enlargeImage, setEnlargeImage] = useState(false);
    const [smallImageLoading, setSmallImageLoading] = useState(false);
    const [largeImageLoading, setLargeImageLoading] = useState(false);
    const [suburbIsLoaded, setSuburbIsLoaded] = useState(false);

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
            setSuburb("Location unavailable");
        }
        setSuburbIsLoaded(true);
    };

    return (
        suburbIsLoaded &&

        <View style={{ maxWidth: "90%", marginTop: '5%', backgroundColor: 'white', borderRadius: 30, shadowOpacity: 0.15, shadowOffset: {height: 8} }}>
            
            {/* <Modal visible={enlargeImage} onClose={closeImageModal}> */}

                        {/* {   
                            largeImageLoading && <ActivityIndicator size='large' style={{ top: '50%', left: '50%', position: 'absolute' }}/>
                        } */}
                        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue'}}>
                            <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%' }} alt={`Enlarged image of missing pet ${petName}`} />
                        </View> */}
                {/* <ImageViewer imageUrls={[{url: petImage}]} onCancel={closeImageModal} enableSwipeDown/>
            </Modal> */}
            <ImageView images={[{uri: petImage}]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor='gray'/>

            {/* Info */}
            <View style={{ marginHorizontal: '4%' }}>
                <HStack maxWidth="100%" alignItems={'center'}>
                    <View style={{ width: "49%", aspectRatio: 1 }} >
                        {
                            smallImageLoading && <ActivityIndicator style={{ top: '50%', left: '50%', position: 'absolute' }} />
                        }
                        <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD" style={{ borderRadius: 20, shadowOpacity: 0.2, shadowOffset: {width: 2, height: 2} }}>
                            <Image onLoadStart={() => setSmallImageLoading(true)} onLoadEnd={() => setSmallImageLoading(false)} source={{ uri: petImage }} style={{ maxHeight: '100%', aspectRatio: 1, borderRadius: 20 }} alt={`Image of missing pet ${petName}`} />
                        </TouchableHighlight>
                    </View>

                    <View style={{ maxWidth: "49%", paddingLeft: 10, justifyContent: 'center' }} height={200} bg="#F9FDFF">
                        <View>
                            <Heading fontSize={petNameFontSize} paddingTop={2}>{petName}</Heading>
                        </View>

                        <VStack>
                            <HStack>
                                <VStack>
                                    <Heading size="sm" paddingTop={2}>Species</Heading>
                                    <Text>{petSpecies}</Text>
                                </VStack>

                                <VStack paddingLeft={8}>
                                    <Heading size="sm" paddingTop={2}>Breed</Heading>
                                    <Text>{petBreed}</Text>
                                </VStack>
                            </HStack>

                            <View>
                                <Heading size="sm" paddingTop={2}>Last seen</Heading>
                                <Text>{formattedDate}</Text>
                                <Heading size="sm" maxWidth='100%' paddingTop={2}>{suburb}</Heading>
                            </View>

                        </VStack>
                    </View>
                </HStack>

                {
                    reportDesc &&
                    <VStack marginBottom={3}>
                        <Heading size="sm">Additional Description</Heading>
                        <Text>{reportDesc}</Text>
                    </VStack>
                }

                {/* Buttons */}
                <HStack maxWidth={'100%'} justifyContent={"space-between"} marginBottom={3}>
                    {
                        // Controls what the owner of the report sees. If user is owner of the report, they
                        // won't be displayed with the option to report a sighting.
                        authorId != userId ?
                            <Button style={{ width: '69%' }} buttonColor={Color.NENO_BLUE} compact={true} icon="eye" mode="contained"
                                onPress={() => setShowModal(true)}>Report a Sighting</Button>

                            : ""
                    }
                    <Button style={{ width: authorId == userId ? '100%' : '29%' }} buttonColor={Color.NENO_BLUE} compact={true} icon="export-variant" mode="contained">Share</Button>
                </HStack>
            </View>
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

