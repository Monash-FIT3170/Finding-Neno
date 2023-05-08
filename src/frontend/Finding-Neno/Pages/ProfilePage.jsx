import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Button } from 'react-native';
import { Box, Center, Image, Heading, HStack, VStack, Link, Text} from "native-base";
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from "../components/atomic/Theme";

  

const App = () => {
    return <Box bg={{
      linearGradient: {
        colors: ['lightBlue.300', 'violet.800'],
        start: [0, 0],
        end: [1, 0]
      }
    }} p="12" rounded="xl" _text={{
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'warmGray.50',
      textAlign: 'center'
    }}>
        This is a Box with Linear Gradient
      </Box>;
  };
  
  const config = {
    dependencies: {
      'linear-gradient': LinearGradient
    }
  };
  

export default function ProfilePage({ navigation: { navigate}}) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;
    const name = "Human Being";
    const email = "sample@student.monash.edu"
    const phone = "0412 345 678"

    return (
        <Box alignItems="center" justifyContent="center">
            <Center>        
            <Box>
              <Box 
                alignSelf="center"
                _text={{
                  alignSelf:"center",
                  justifyContent:"center",
                  fontSize: "lg",
                  fontWeight: "medium",
                  color: "warmGray.50",
                  letterSpacing: "lg"
                }} 
                bg={Color.NENO_BLUE}
                width={windowWidth}
                height={windowHeight/8}
              >
                <Box height={3}/>
                <HStack>
                <Box width={8}/>
                <Box
                  bg="#FFFFFF"
                  height={76}
                  width={76}
                  borderRadius={38}
                  alignSelf="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image 
                    alignSelf="center" size={70} borderRadius={35} 
                    source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                    }} alt="Alternate Text" 
                  />

                </Box>
                <Box width={9}/>
                <Heading
                    alignSelf="center"
                    size="lg"
                    fontWeight="600"
                    color="warmGray.50"
                    >
                    {name}
                </Heading>
                </HStack>
              </Box>
            </Box>

        <VStack>
          <HStack mt="6" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            USER DETAILS
          </Heading>
          <Text pl={windowWidth/3.5}>
          </Text>
          </HStack>
          
          <HStack mt="2" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
              Email
            </Heading>
            <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
              {email}
            </Text>
          </HStack>
          
          <HStack mt="2" justifyContent="space-between">
            <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
              Phone
            </Heading>
            <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
              {phone}
            </Text>
          </HStack>
        </VStack>
        
        <Box width={8}/>

        <VStack>
        <HStack mt="6" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            PETS     
          </Heading>
          <Text pl={windowWidth/2.2}>
          </Text>
          </HStack>

        </VStack>
            
            <Button
                onPress={() => navigate('New Pet Page')} 
                title="Add New Pet" /> 
            
            </Center>
        </Box>
                            
    )
}