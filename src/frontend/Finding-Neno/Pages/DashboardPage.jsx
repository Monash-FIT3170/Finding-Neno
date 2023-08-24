import {useNavigation} from '@react-navigation/native';
import { Menu, Box, Modal, Center, Image, useToast, ScrollView, View, Heading, VStack, HStack, FormControl, Input, Link, Button, Text, Alert, Pressable, Icon, KeyboardAvoidingView} from "native-base";
import {Dimensions} from 'react-native';
import { Color } from "../components/atomic/Theme";
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


import store from '../store/store';
import { validDateTime, validateCoordinates } from "./validation"
import { useSelector, useDispatch } from "react-redux";
import Report from '../components/Report';

const DashboardPage = () => {
	const {IP, PORT} = useSelector((state) => state.api)
  const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

  const windowWidth = Dimensions.get('window').width; 
  const navigation = useNavigation();
  const toast = useToast();
  const isFocused = useIsFocused();

  // TODO: change report structure to be an array of dictionaries? Refer to mock data that is commented out for desired structure
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sightingDateTime, setSightingDateTime] = useState(new Date());
  const [sightingData, setSightingData] = useState({authorId: USER_ID});
  const [reportSightingBtnDisabled, setReportSightingBtnDisabled] = useState(false);
  const [sightingFormErrors, setSightingFormErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const DEFAULT_IMAGE = "https://qph.cf2.quoracdn.net/main-qimg-46470f9ae6267a83abd8cc753f9ee819-lq";
  const LOADING_IMAGE = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRwMHI0cmlnOGU3Mm4xbzZwcTJwY2Nrb2hlZ3YwNmtleHo4Zm15MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L05HgB2h6qICDs5Sms/giphy.gif";
  const [sightingImage, setSightingImage] = useState(DEFAULT_IMAGE);

  const formatDatetime = (datetime) => {
		const hours = datetime.getHours().toString().padStart(2, '0');
		const minutes = datetime.getMinutes().toString().padStart(2, '0');
		const day = datetime.getDate().toString().padStart(2, '0');
		const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
		const year = datetime.getFullYear().toString();

		return `${hours}:${minutes} ${day}/${month}/${year}`
	}

  const resetForm = (report) => {
    // clears the form to default values
    setSightingData({ ...sightingData, 
      missing_report_id: report[0], 
      animal: report[7], 
      breed: report[8],
      image_url: DEFAULT_IMAGE, 
      dateTime: formatDatetime(new Date()),
      dateTimeOfCreation: formatDatetime(new Date()),
      lastLocation: '',
      description: ''
    });
    setSightingImage(null);
    setSightingDateTime(new Date());
    setSightingFormErrors({});
    setReportSightingBtnDisabled(false)
  }

  const handleOpenSightingModal = (report) => {
    setModalVisible(!modalVisible);
    resetForm(report);
  };

    useEffect(() => {
      if (isFocused) {
        fetchAllReports();
      }
    }, [isFocused]);

    // TODO: replace this image with the actual image from DB ? 
    const image = "https://wallpaperaccess.com/full/317501.jpg";

    // validation
    const validateDetails = (formData) => {
      // Validates details. If details are valid, send formData object to onCreateReportPress.
      foundErrors = {};
  
      if (!formData.lastLocation || formData.lastLocation == "") {
        foundErrors = { ...foundErrors, lastLocation: 'Last known location is required e.g. 24.212, -54.122' }
      } else if (!validateCoordinates(formData.lastLocation)) {
        foundErrors = { ...foundErrors, lastLocation: 'Location coordinates is invalid e.g. 24.212, -54.122' }
      }
  
      if (formData.description.length > 500) {
        foundErrors = { ...foundErrors, description: 'Must not exceed 500 characters' }
      }
  
      setSightingFormErrors(foundErrors);
      return Object.keys(foundErrors).length === 0;
    }

    const uploadImage = (base64Img, setSightingImage) => {
      // Set loading image while the chosen image is being uploaded
      setSightingImage(LOADING_IMAGE);

      const formData = new FormData();
      formData.append("image", base64Img);

      fetch("https://api.imgur.com/3/image", {
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
            setSightingImage(res.data.link);
          } else {
            console.log("Image failed to upload - setting default image");
            setSightingImage(DEFAULT_IMAGE);
          }
        })
        .catch(err => {
          console.log("Image failed to upload:", err);
          setSightingImage(DEFAULT_IMAGE);
        });
    }

    const handleChoosePhoto = async () => {
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
            setSightingImage(result.assets[0].uri);
            setSightingData({ ...sightingData, image_url: result.assets[0].uri })
          } else {
            // Image is a local file path, so upload to Imgur
            let base64Img = result.assets[0].base64;

            uploadImage(base64Img, setSightingImage);
          }
        }
      }
  };

  const handleTakePhoto = async () => {
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
        uploadImage(base64Img, setSightingImage);
      }
    }
  };

  // date picker 
  var maximumDate;
	const openPicker = () => {
		maximumDate = new Date();
		setShowPicker(true);
	};

  const closePicker = () => {
		setShowPicker(false);
	}

  const handleDatetimeConfirm = (datetime) => {
		setSightingDateTime(datetime);
		setSightingData({ ...sightingData, dateTime: formatDatetime(datetime) });
		closePicker();
	}

    // API calls 
    const fetchAllReports = async () => {
      try {
        const url = `${IP}:${PORT}/get_missing_reports`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setReports(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    const handleSubmitSighting = async () => {
      let isValid = validateDetails(sightingData);

      if (isValid) {
        setReportSightingBtnDisabled(true);
        const url = `${IP}:${PORT}/insert_new_sighting`;

        setSightingData({ ...sightingData, image_url: sightingImage })

        await fetch(url, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(sightingData),
        })
        .then((res) => {
          if (res.status == 201) {
            toast.show({
              description: "Your sighting has been added, and the owner has been alerted",
              placement: "top"
            })
            setReportSightingBtnDisabled(false);
            setModalVisible(false);
          }
        })
        .catch((error) => alert(error));
      }
    }

    return (
      <View>
    <View>
      <View justifyContent="center" alignItems="flex-start" bg={'blue.300'} padding={4}>
        <Menu shadow={2} w="360"  trigger={(triggerProps) => (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <View style={{ alignItems: 'flex-start' }}>
              <Heading> ➕  New Post </Heading>
            </View>
          </Pressable>
        )}>
          <Menu.Item onPress={() => navigation.navigate('Report', { screen: 'New Report Page' })}>Report</Menu.Item>
          <Menu.Item>Sighting</Menu.Item>
        </Menu>
      </View>
    </View>

        <ScrollView style={{backgroundColor: '#EDEDED'}}>

          {/* REPORT SIGHTING MODAL */}
          <Modal avoidKeyboard isOpen={modalVisible} onClose={setModalVisible} >
        <Modal.Content >
          <Modal.CloseButton />
          <Modal.Header>Sighting details</Modal.Header>
          <Modal.Body>
          <FormControl.Label>Photo</FormControl.Label>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {sightingImage && <Image source={{ uri: sightingImage }} style={{ width: 100, height: 100 }} alt='pet sighting image'/>}
            </View>

            <Button variant="ghost" onPress={handleChoosePhoto}>
                Choose From Library
            </Button>
            <Button variant="ghost" onPress={handleTakePhoto}>
                Take Photo
            </Button>
            <ScrollView>
              {/* form details */}
              <FormControl >
                <FormControl.Label>Date and Time of Sighting</FormControl.Label>
                    <Button onPress={openPicker}>{`${sightingDateTime.getHours().toString().padStart(2, '0')}:${sightingDateTime.getMinutes().toString().padStart(2, '0')} ${sightingDateTime.toDateString()}`}</Button>
                        <DateTimePickerModal date={sightingDateTime} isVisible={showPicker} mode="datetime" locale="en_GB" maximumDate={new Date()} themeVariant="light" display="inline"
                        onConfirm={(datetime) => handleDatetimeConfirm(datetime)} onCancel={closePicker} />
              </FormControl>

              <FormControl isInvalid={'lastLocation' in sightingFormErrors}>
                  <FormControl.Label>Location of Sighting</FormControl.Label>
                  <Input value={sightingData.lastLocation} onChangeText={value => setSightingData({ ...sightingData, lastLocation: value })} placeholder="long (-180 to 180), lat (-90 to 90)" />
                  {'lastLocation' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.lastLocation}</FormControl.ErrorMessage>}
              </FormControl>

              <FormControl isInvalid={'description' in sightingFormErrors}>
                  <FormControl.Label>Description (Additional Info)</FormControl.Label>
                  <Input value={sightingData.description} onChangeText={value => setSightingData({ ...sightingData, description: value })} />
                  {'description' in sightingFormErrors && <FormControl.ErrorMessage>{sightingFormErrors.description}</FormControl.ErrorMessage>}
              </FormControl>

            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button bgColor={Color.NENO_BLUE} 
                disabled={reportSightingBtnDisabled} opacity={!reportSightingBtnDisabled ? 1 : 0.6}
                onPress={() => handleSubmitSighting()}
              >
                Report sighting 
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      

          {/* REPORTS */}
              {reports && reports.map((report, index) => (
                <Report report={report} key={index}/>
                
            ))}
        </ScrollView>
        </View>
    );
}

export default DashboardPage;