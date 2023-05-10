import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Box, Image, Heading, HStack, VStack, Button, Text, ScrollView, Center} from "native-base";
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


export default function ProfilePage({ navigation: { navigate}}, this_user) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width; 
    const windowHeight = Dimensions.get('window').height;

    {/. Call a get user function ./}

    const name = "Human Being";
    const email = "sample@student.monash.edu";
    const phone = "0412 345 678";

    return (
      <ScrollView>
      <Box alignItems="center" justifyContent="center">        
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
              }} 
              alt="Alternate Text" 
            />
          </Box>
          <Box width={9}/>
          <Heading alignSelf="center" size="lg" fontWeight="600" color="warmGray.200" _dark={{color: "coolGray.600",}} >
            {name}
          </Heading>
        </HStack>
      </Box>


      <VStack>
        <HStack mt="6" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            USER DETAILS
          </Heading>
          <Text pl={windowWidth/3.5}>
          </Text>
        </HStack>

        <Box h="2"></Box>
          
        <Box bg = "gray.200" px="2" py="1" borderRadius="md"> 
        <HStack mt="2" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            Email
          </Heading>
          <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            {email}
          </Text>
        </HStack>
        </Box> 
        
        <Box h="2"></Box>

        <Box bg = "gray.200" px="2" py="1" borderRadius="md">   
        <HStack mt="2" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            Phone
          </Heading>
          <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}}>
            {phone}
          </Text>
        </HStack>
        </Box> 
        
      </VStack>
        
      <Box height={1}/>

      <VStack>
        <HStack mt="6" justifyContent="space-between">
          <Heading fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200",}} pr={windowWidth/3.5}>
            PETS     
          </Heading>
          <Text pl={windowWidth/2.2}>
          </Text>
        </HStack>
        
        <Box width={windowWidth - 20} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 20} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 20} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>
        <Box width={windowWidth - 20} height={100} bg={Color.NENO_BLUE}/>
        <Box height={1}/>

      </VStack>
      
      <Box h="4"></Box>

      <Button
        onPress={() => navigate('New Pet Page')} 
        width={windowWidth - 100}
        height="40px"
      >
        Add New Pet
      </Button> 
           
    </Box>
    </ScrollView>                        
    )
}