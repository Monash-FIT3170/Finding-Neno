import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, TouchableHighlight, View } from 'react-native'
import ReportSightingModal from './ReportSightingModal';
import { HStack, Heading, Image, VStack, Text } from 'native-base';
import { Button } from 'react-native-paper';
import { Color } from './atomic/Theme';
import { formatDateTimeDisplay } from '../Pages/shared';
import ImageView from 'react-native-image-viewing';
import IconText from './IconText';
import ShareButton from './ShareButton';
import { useTheme } from '@react-navigation/native';



const Report = ({ report, userId }) => {
    const { colors } = useTheme();

    // Pet Data
    const lastSeen = formatDateTimeDisplay(new Date(report[1]));
    const reportDesc = report[2];
    const locationLongitude = report[3];
    const locationLatitude = report[4];
    const locationString = report[5];
    const authorId = report[15]
    
    const petName = report[7][0].toUpperCase() +report[7].substring(1);
    const petSpecies = report[8][0].toUpperCase() +report[8].substring(1);
    const petBreed = report[9].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const petImage = report[10];

    const [showModal, setShowModal] = useState(false);
    const [suburb, setSuburb] = useState("");
    const [enlargeImage, setEnlargeImage] = useState(false);
    const [smallImageLoading, setSmallImageLoading] = useState(false);
    const [suburbIsLoaded, setSuburbIsLoaded] = useState(true);

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

    const message = 
    `Have you seen this missing pet? \n\nName: ${petName} \nSpecies: ${petSpecies} \nBreed: ${petBreed} \nLast seen ${lastSeen} around ${suburb} \nPet Image: ${petImage} ${reportDesc ? "Additional description: " + reportDesc : ""} \n\nIf you have seen this pet, please report your sighting on the Finding Neno app.`

    const closeImageModal = () => {
        setEnlargeImage(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeIn();
    }, [suburbIsLoaded])

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Animated.View style={{ backgroundColor: colors.cardColor, opacity: fadeAnim, borderBottomWidth: 6, borderColor: colors.border}}>
            <ImageView images={[{uri: petImage}]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor={colors.background}/>

            {/* Info */}
            <View style={{ margin: '4%', marginBottom: 4 }}>
                <HStack width="100%" >
                    <View style={{ width: "49%", aspectRatio: 1 }} >
                        {
                            smallImageLoading && <ActivityIndicator style={{ top: '50%', left: '50%', position: 'absolute' }} />
                        }
                        <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD"
                            style={{ borderRadius: 20, backgroundColor: 'white'}}>
                            <Image onLoadStart={() => setSmallImageLoading(true)} onLoadEnd={() => setSmallImageLoading(false)}
                                source={{ uri: petImage }} style={{ maxHeight: '100%', aspectRatio: 1, borderRadius: 10 }} alt={`Image of missing pet ${petName}`} />
                        </TouchableHighlight>
                    </View>

                    <View style={{ width: "48%", marginHorizontal: 20 }}>
                        <View>
                            <Heading color={colors.text} size="lg" marginBottom={3}>{petName} </Heading>
                        </View>

                        <VStack>
                            <HStack marginTop='2%' justifyContent='space-between'>
                                <VStack>
                                    <Heading color={colors.text} size="sm" >Species</Heading>
                                    {
                                        petSpecies == 'Other' ? 
                                        <Text color={colors.text}>{petSpecies}</Text> :
                                        <IconText iconName={petSpecies.toLowerCase()} text={petSpecies} 
                                            iconColor={ Color.NENO_BLUE } textColor={colors.text} iconSize={19} fontWeight='normal' />
                                    }
                                </VStack>

                                <VStack width='50%' marginX={0}>
                                    <Heading color={colors.text} size="sm">Breed</Heading>
                                    <Text color={colors.text}>{petBreed}</Text>
                                </VStack>
                            </HStack>

                            <View >
                                <Heading color={colors.text} size="sm" paddingTop='1%'marginTop={3}>Last seen</Heading>
                                <Text color={colors.text}>{lastSeen}</Text>
                                <Text color={colors.text}>{locationString}</Text>
                            </View>

                        </VStack>
                    </View>
                </HStack>

                {
                    reportDesc &&
                    <VStack marginTop='3%'>
                        <Heading color={colors.text} size="sm">Description</Heading>
                        <Text color={colors.text}>{reportDesc}</Text>
                    </VStack>
                }

                {/* Buttons */}
                <HStack maxWidth={'100%'} justifyContent={"space-between"} marginTop='4%' marginBottom='3%'>
                    {
                        // Controls what the owner of the report sees. If user is owner of the report, they
                        // won't be displayed with the option to report a sighting.
                        authorId != userId ?
                            <Button style={{ width: '69%', borderRadius: 10}} buttonColor={Color.NENO_BLUE} labelStyle={{ fontWeight: 'bold' }} textColor='white' compact={true} icon="magnify" mode="contained"
                                onPress={() => setShowModal(true)}>Add a Sighting</Button>

                            : ""
                    }
                    <ShareButton title={"Missing Pet - Finding Neno"} message={message} dialogTitle={"Share this missing pet report"} textColor={colors.background} width={authorId == userId ? '100%' : '29%'} />
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
        </Animated.View>
    );
};

export default Report;

