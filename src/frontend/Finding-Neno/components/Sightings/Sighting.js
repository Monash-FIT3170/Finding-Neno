import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, TouchableHighlight, View, Linking } from 'react-native'
import { Dimensions } from 'react-native';
import { Box, HStack, Heading, Image, VStack, Text, Icon } from 'native-base';
import { Button } from "react-native-paper";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { useIsFocused, useTheme } from '@react-navigation/native';
import { formatDateTimeDisplay } from '../../Pages/shared';
import ImageView from 'react-native-image-viewing';
import ShareButton from '../Shared/ShareButton';
import IconText from '../Shared/IconText';
import { Color } from '../atomic/Theme';

const Sighting = ({ userId, sighting, refresh }) => {
  // Pet Data
  const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);

  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);
  const { API_URL } = useSelector((state) => state.api)
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  const id = sighting[0];
  const missingReportId = sighting[1];
  const authorId = sighting[2];
  const dateTime = formatDateTimeDisplay(new Date(sighting[3]));
  const locationLongitude = sighting[4];
  const locationLatitude = sighting[5];
  const locationString = sighting[6];
  const sightingImage = sighting[7];
  const sightingDesc = sighting[8];
  const sightingAnimal = sighting[9][0].toUpperCase() + sighting[9].substring(1);
  const sightingBreed = sighting[10].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const ownerName = sighting[11];
  const ownerEmail = sighting[12];
  const sightingPhoneNumber = sighting[13];
  const savedByUser = sighting[14];
  const petName = sighting[15];

  const [enlargeImage, setEnlargeImage] = useState(false);
  const [smallImageLoading, setSmallImageLoading] = useState(false);

  const [sightingSaved, setSightingSaved] = useState(savedByUser == USER_ID); // true if the sighting is saved by this user
  const [saveSightingEndpoint, setSaveSightingEndpoint] = useState('save_sighting');

  const closeImageModal = () => {
    setEnlargeImage(false);
  }

  const message =
    `Check this pet sighting. \n\nSpecies: ${sightingAnimal} ${sightingBreed ? "\nBreed: " + sightingBreed : ""} \nSeen ${dateTime} around ${locationString} ${sightingImage ? "\nImage: " + sightingImage : ""} ${sightingDesc ? "\nDescription: " + sightingDesc : ""} \n\nSee more on the Finding Neno app.`

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
    <View style={{ width: "100%"}} bg="#F9FDFF">
      <VStack alignItems='left'>
        <View>
          <Heading color={colors.text} maxWidth='90%' size="md" marginBottom={2}>{locationString}</Heading>
        </View>
        <HStack marginTop='2%' justifyContent='space-between'>
          <VStack backgroundColor='green'>
            <Heading color={colors.text} size="sm">Species</Heading>
            {
              sightingAnimal == 'Other' ?
                <Text color={colors.text}>{sightingAnimal}</Text> :
                <View style={{ width: '100%' }}>
                  <IconText iconName={sightingAnimal.toLowerCase()} text={sightingAnimal}
                    iconColor={Color.NENO_BLUE} textColor={colors.text} iconSize={19} fontWeight='normal' />
                </View>
            }
          </VStack>

          {
            sightingBreed &&
            <VStack width='30%' marginX={5}>
              <Heading color={colors.text} size="sm">Breed</Heading>
              <Text color={colors.text}>{sightingBreed}</Text>
            </VStack>
          }
        </HStack>

        <View >
          <Heading color={colors.text} size="sm" marginTop={3}>Last seen</Heading>
          <Text color={colors.text}>{dateTime}</Text>
        </View>

      </VStack>
      {
        sightingDesc &&
        <VStack marginTop='3%'>
          <Heading size="sm" color={colors.text}>Description</Heading>
          <Text color={colors.text}>{sightingDesc}</Text>
        </VStack>
      }
    </View>
  )

  const sightingWithImage = (
    <View>
      <ImageView images={[{ uri: sightingImage }]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor={colors.background} />
      <HStack width="100%" >
        {
          sightingImage &&
          <View style={{ width: "49%", aspectRatio: 1 }} >
            {
              smallImageLoading && <ActivityIndicator style={{ top: '50%', left: '50%', position: 'absolute' }} />
            }
            <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD"
              style={{ borderRadius: 10, backgroundColor: 'white' }}>
              <Image onLoadStart={() => setSmallImageLoading(true)} onLoadEnd={() => setSmallImageLoading(false)}
                source={{ uri: sightingImage }} style={{ maxHeight: '100%', aspectRatio: 1, borderRadius: 10 }} alt={`Image of missing pet sighting`} />
            </TouchableHighlight>
          </View>
        }

        <View style={{ width: "48%", marginHorizontal: 20}} bg="#F9FDFF">
          <View>
            <Heading color={colors.text} maxWidth='70%' size="md" marginBottom={3}>{locationString}</Heading>
          </View>

          <VStack>
            <HStack marginTop='2%' justifyContent='space-between'>
              <VStack>
                <Heading color={colors.text} size="sm">Species</Heading>
                {
                  sightingAnimal == 'Other' ?
                    <Text color={colors.text}>{sightingAnimal}</Text> :
                    <IconText iconName={sightingAnimal.toLowerCase()} text={sightingAnimal}
                      iconColor={Color.NENO_BLUE} textColor={colors.text} iconSize={19} fontWeight='normal' />
                }
              </VStack>

              {
                sightingBreed &&
                <VStack width='50%' marginX={2}>
                  <Heading color={colors.text} size="sm">Breed</Heading>
                  <Text color={colors.text}>{sightingBreed}</Text>
                </VStack>
              }
            </HStack>

            <View >
              <Heading color={colors.text} size="sm" paddingTop='1%' marginTop={3}>Seen at</Heading>
              <Text color={colors.text}>{dateTime}</Text>
            </View>
          </VStack>
        </View>
      </HStack>
      {
        sightingDesc &&
        <VStack marginTop='3%'>
          <Heading color={colors.text} size="sm">Description</Heading>
          <Text color={colors.text}>{sightingDesc}</Text>
        </VStack>
      }
    </View>
  )

  const openPhoneApp = () => {
    let phoneUrl = `tel:${sightingPhoneNumber}`
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (!supported) {
          console.log('Phone number is not available');
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch(err => console.log(err));
  };


  return (
    <Animated.View style={{ backgroundColor: colors.cardColor, opacity: fadeAnim, borderBottomWidth: 6, borderColor: colors.border}}>

      {/* Info */}
      <View style={{ margin: '4%', marginBottom: 4 }}>
        {
          sightingImage ? sightingWithImage : imagelessSighting
        }

        <View style={{ maxWidth: '100%', marginTop: '4%', marginBottom: '3%', flexDirection: "row", justifyContent: 'space-between' }}>
          <ShareButton title={"Pet Sighting - Finding Neno"} message={message} textColor={colors.background} dialogTitle={"Share this pet sighting"} width={'78%'}/>

          <Button style={{ width: '20%', borderRadius:10 }} buttonColor={Color.LIGHTER_NENO_BLUE} compact={true}  onPress={openPhoneApp}>
            <Icon as={<MaterialIcons name="call" />} size={6} color="white" />
          </Button>
        </View>

        <Ionicons name={savedByUser == USER_ID ? "bookmark" : "bookmark-outline"} size={24} style={{ padding: 3, position: "absolute", top: 0, right: 0, color: colors.text}} onPress={handlePressSaveBtn} />
      </View>
    </Animated.View>
  );
};

export default Sighting;

