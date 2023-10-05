import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, TouchableHighlight, View } from 'react-native'
import { Dimensions } from 'react-native';
import { Box, HStack, Heading, Image, VStack, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';
import { formatDateTimeDisplay } from '../Pages/shared';
import ImageView from 'react-native-image-viewing';
import ShareButton from './ShareButton';
import IconText from './IconText';
import { Color } from './atomic/Theme';

const Sighting = ({ userId, sighting, refresh }) => {
    // Pet Data
    const windowWidth = Dimensions.get('window').width;

    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
    const { API_URL } = useSelector((state) => state.api)
    const isFocused = useIsFocused();

    const id = sighting[0];
    const missingReportId = sighting[1];
    const authorId = sighting[2];
    const dateTime = formatDateTimeDisplay(new Date(sighting[3]));
    const locationLongitude = sighting[4];
    const locationLatitude = sighting[5];
    const suburb = 'Suburb';
    const sightingImage = sighting[6];
    const sightingDesc = sighting[7];
    const sightingAnimal = sighting[8][0].toUpperCase() + sighting[8].substring(1);
    const sightingBreed = sighting[9];
    const ownerName = sighting[10];
    const ownerEmail = sighting[11];
    const sightingPhoneNumber = sighting[12];
    const savedByUser = sighting[13];

    const [enlargeImage, setEnlargeImage] = useState(false);
    const [smallImageLoading, setSmallImageLoading] = useState(false);

    const [sightingSaved, setSightingSaved] = useState(savedByUser == USER_ID); // true if the sighting is saved by this user
    const [saveSightingEndpoint, setSaveSightingEndpoint] = useState('save_sighting');

    const closeImageModal = () => {
        setEnlargeImage(false);
    }

    const message =
        `Check this pet sighting. \n\nSpecies: ${sightingAnimal} ${sightingBreed ? "\nBreed: " + sightingBreed : ""} \nSeen ${dateTime} around ${suburb} ${sightingImage ? "\nImage: " + sightingImage : ""} ${sightingDesc ? "\nDescription: " + sightingDesc : ""} \n\nSee more on the Finding Neno app.`

    useEffect(() => {
        if (savedByUser == USER_ID) {
            setSaveSightingEndpoint('unsave_sighting');
        } else {
            setSaveSightingEndpoint('save_sighting');
        }

    }, [savedByUser]);

    const handlePressSaveBtn = async () => {

        if (savedByUser == USER_ID) {
            setSaveSightingEndpoint('unsave_sighting');
        } else {
            setSaveSightingEndpoint('save_sighting');
        }

        const url = `${API_URL}/${saveSightingEndpoint}`;

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'User-ID': USER_ID
            },
            body: JSON.stringify({ sightingId: id }),
        })
            .then((res) => {
                if (res.status == 201) {
                    setSightingSaved(!sightingSaved);
                    refresh();
                }
            })
            .catch((error) => alert(error));
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fadeIn();
    }, [])

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    }

    const imagelessSighting = (
        <View style={{ width: "100%", alignItems: 'center', justifyContent: 'center', }} bg="#F9FDFF">
            <VStack alignItems='center' width='100%'>
                <View>
                    {/* TODO: Replace with a proper header */}
                    <Heading textAlign='center' >Sighting Header</Heading>
                </View>
                <HStack width='50%' marginTop='2%' alignItems='center' justifyContent='space-between'>
                    <VStack alignItems='center' marginX='2'>
                        <Heading size="sm" >Species</Heading>
                        {
                            sightingAnimal == 'Other' ?
                                <Text>{sightingAnimal}</Text> :
                                <IconText iconName={sightingAnimal.toLowerCase()} text={sightingAnimal}
                                    iconColor={Color.NENO_BLUE} textColor={'black'} iconSize={19} fontWeight='normal' />
                        }
                    </VStack>

                    {
                        sightingBreed &&
                        <VStack alignItems='center' marginX='2'>
                            <Heading size="sm">Breed</Heading>
                            <Text>{sightingBreed}</Text>
                        </VStack>
                    }
                </HStack>

                <View style={{ alignItems: 'center' }}>
                    <Heading size="sm" paddingTop='1%'>Last seen</Heading>
                    <Text>{dateTime}</Text>
                    <Heading size="sm" maxWidth='100%' paddingTop='1%'>{suburb}</Heading>
                </View>

            </VStack>
            {
                sightingDesc &&
                <VStack marginTop='3%'>
                    <Heading size="sm">Description</Heading>
                    <Text>{sightingDesc}</Text>
                </VStack>
            }
        </View>
    )

    const sightingWithImage = (
        <View>
            <ImageView images={[{ uri: sightingImage }]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor='gray' />
            <HStack width="100%" alignItems='center' justifyContent='space-between'>
                {
                    sightingImage &&
                    <View style={{ width: "49%", aspectRatio: 1 }} >
                        {
                            smallImageLoading && <ActivityIndicator style={{ top: '50%', left: '50%', position: 'absolute' }} />
                        }
                        <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD"
                            style={{ borderRadius: 20, backgroundColor: 'white', shadowOpacity: 0.2, shadowOffset: { width: 2, height: 2 }, }}>
                            <Image onLoadStart={() => setSmallImageLoading(true)} onLoadEnd={() => setSmallImageLoading(false)}
                                source={{ uri: sightingImage }} style={{ maxHeight: '100%', aspectRatio: 1, borderRadius: 20 }} alt={`Image of missing pet sighting`} />
                        </TouchableHighlight>
                    </View>
                }
                {/* <Ionicons name={savedByUser == USER_ID ? "bookmark" : "bookmark-outline"} size={24} onPress={handlePressSaveBtn} /> */}

                <View style={{ width: "48%", justifyContent: 'center', alignItems: 'center' }} bg="#F9FDFF">
                    <View>
                        <Heading textAlign='center' >Sighting Header</Heading>
                    </View>

                    <VStack>
                        <HStack marginTop='2%' justifyContent='space-between'>
                            <VStack alignItems='center' marginX='2'>
                                <Heading size="sm" >Species</Heading>
                                {
                                    sightingAnimal == 'Other' ?
                                        <Text>{sightingAnimal}</Text> :
                                        <IconText iconName={sightingAnimal.toLowerCase()} text={sightingAnimal}
                                            iconColor={Color.NENO_BLUE} textColor={'black'} iconSize={19} fontWeight='normal' />
                                }
                            </VStack>

                            {
                                sightingBreed &&
                                <VStack alignItems='center' marginX='2'>
                                    <Heading size="sm">Breed</Heading>
                                    <Text>{sightingBreed}</Text>
                                </VStack>
                            }
                        </HStack>

                        <View style={{ alignItems: 'center' }}>
                            <Heading size="sm" paddingTop='1%'>Last seen</Heading>
                            <Text>{dateTime}</Text>
                            <Heading size="sm" maxWidth='100%' paddingTop='1%'>{suburb}</Heading>
                        </View>
                    </VStack>
                </View>
            </HStack>
            {
                sightingDesc &&
                <VStack marginTop='3%'>
                    <Heading size="sm">Description</Heading>
                    <Text>{sightingDesc}</Text>
                </VStack>
            }
        </View>
    )


    return (
        <Animated.View style={{ backgroundColor: 'white', opacity: fadeAnim, width: 380, marginTop: 10, marginBottom: 10, borderRadius: 30, shadowOpacity: 0.15, shadowOffset: { height: 8 } }}>

            {/* Info */}
            <View style={{ margin: '4%', marginBottom: 4 }}>
                {
                    sightingImage ? sightingWithImage : imagelessSighting
                }

                <View style={{ maxWidth: '100%', marginTop: '4%', marginBottom: '3%' }}>
                    <ShareButton title={"Pet Sighting - Finding Neno"} message={message} dialogTitle={"Share this pet sighting"} width={'100%'} />
                </View>
            </View>
        </Animated.View>
    );
};

export default Sighting;