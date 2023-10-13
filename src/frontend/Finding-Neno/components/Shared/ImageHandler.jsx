import * as ImagePicker from 'expo-image-picker';
import ImageView from 'react-native-image-viewing';
import { Button } from 'react-native-paper';
import { FormControl, HStack, Image, VStack, View, Text } from 'native-base';
import { ActivityIndicator, TouchableHighlight, useColorScheme } from 'react-native';
import { useState } from 'react';
import { Color } from '../atomic/Theme';
import { useTheme } from '@react-navigation/native';

const ImageHandler = ({ image, setImage, setIsButtonDisabled, isRequired, error }) => {

    const scheme = useColorScheme();
    const { colors } = useTheme();

    const [isUploading, setIsUploading] = useState(false);

    const [enlargeImage, setEnlargeImage] = useState(false);
    const closeImageModal = () => {
        setEnlargeImage(false);
    }

    const handleTakePhoto = async () => {
        /**
         * This function is used to take a photo from the user's camera.
         * It will call the ImagePicker API to open the camera and allow the user to take a photo.
         * It will then set the petImage state to the taken photo.
         */
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });
            if (!result.canceled) {
                // Upload to Imgur
                let base64Img = result.assets[0].base64;
                uploadImage(base64Img, setImage);
            }
            else {
                setIsUploading(false);
                setIsButtonDisabled(false);
            }
        }
    };

    const handleChoosePhoto = async () => {
        /**
         * This function is used to choose a photo from the user's photo library.
         * It will call the ImagePicker API to open the photo library and allow the user to choose a photo.
         * It will then set the petImage state to the chosen photo.
         */
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });
            if (!result.canceled) {
                if (result.assets[0].uri.startsWith("http")) {
                    // Image is a URL, so leave it as is
                    setImage(result.assets[0].uri);
                } else {
                    // Image is a local file path, so upload to Imgur
                    let base64Img = result.assets[0].base64;
                    uploadImage(base64Img, setImage);
                }
            }
            else {
                setIsUploading(false);
                setIsButtonDisabled(false);
            }
        }
    };

    const handleRemovePhoto = () => {
        setImage(null);
    };

    const uploadImage = async (base64Img, setImage) => {
        setIsButtonDisabled(true);
        setIsUploading(true);
        // Uploads an image to Imgur and sets the petImage state to the uploaded image URL
        // const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";

        // Set loading image while the chosen image is being uploaded
        // setImage(LOADING_IMAGE);

        const formData = new FormData();
        formData.append("image", base64Img);

        await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                "Authorization": "Client-ID 736cd8c6daf1a6e",
            },
            body: formData,
        })
        .then(res => res.json())
        .then(res => {
            if (res.success === true) {
                console.log(`Image successfully uploaded: ${res.data.link}}`);
                setImage(res.data.link.toString());
            } else {
                toast.show({
                    title: "Image Upload Failed",
                    description: "Image failed to upload. Please try again.",
                    placement: "top",
					alignItems: "center"
                })
                console.log("Image failed to upload")
                // console.log("Image failed to upload - setting default image");
                // setImage(DEFAULT_IMAGE);
            }
        })
        .catch(err => {
            toast.show({
                description: "Image failed to upload. Please try again.",
                placement: "top"
            })
            console.log("Image failed to upload:", err);
            // setImage(DEFAULT_IMAGE);
        });


        setIsUploading(false);
        setIsButtonDisabled(false);
    }

    return (                        
        <FormControl isRequired={isRequired} isInvalid={error}>

            <ImageView images={[{uri: image}]} visible={enlargeImage} onRequestClose={closeImageModal} presentationStyle='overFullScreen' backgroundColor={colors.background}/>

            <VStack space={2}>
                <FormControl.Label><Text fontWeight={500} color={scheme === 'dark'? 'white' : 'black'}>Photo</Text></FormControl.Label>
                    {
                        isUploading ? <ActivityIndicator /> :
                            image && 
                            <View borderRadius={"10%"} alignItems={"center"}>
                                <TouchableHighlight onPress={() => setEnlargeImage(true)} underlayColor="#DDDDDD" style={{ borderRadius: 20 }}>
                                    <Image source={{ uri: image }} style={{ width: "100%", aspectRatio: "1", borderRadius: 10 }} alt='pet sighting image' />
                                </TouchableHighlight>
                            </View>
                    }
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <Button style={{ width: "48%" }} buttonColor={Color.NENO_BLUE} compact={true} icon="camera" mode="contained" onPress={handleTakePhoto}>
                        Take Photo
                    </Button>
                    <Button style={{ width: "48%" }} buttonColor={Color.NENO_BLUE} compact={true} icon="image" mode="contained" onPress={handleChoosePhoto}>
                        Choose Photo
                    </Button>
                </HStack>

                {
                    image ?
                        <View alignItems={"center"}>
                            <Button style={{ borderColor: Color.NENO_BLUE, width: "50%" }} textColor={Color.NENO_BLUE} icon="trash-can-outline" mode="outlined" onPress={handleRemovePhoto} >
                                Remove Photo
                            </Button>
                        </View> : ""
                }
            </VStack>    
        </FormControl>
    )
}

export default ImageHandler;