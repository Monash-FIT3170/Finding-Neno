import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { Button } from 'react-native';
import { Box, Center, LinearGradient, Image, Heading} from "native-base";
import {Dimensions} from 'react-native';
  

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

    return (
        <Box alignItems="center" justifyContent="center">
            <Center>            
            <Box>
            <Box alignSelf="center" // bg="primary.500"
            _text={{
            alignSelf:"center",
            fontSize: "md",
            fontWeight: "medium",
            color: "warmGray.50",
            letterSpacing: "lg"
            }} bg={["blue.400"]}
            width={windowWidth}
            height={windowHeight/4}>
                <Box height={windowHeight/32}/>
                <Image alignSelf="center" size={windowWidth/4} borderRadius={100} 
                    source={{
                    uri: "https://wallpaperaccess.com/full/317501.jpg"
                    }} alt="Alternate Text" />
                    
                    <Heading
                    alignSelf="center"
                    size="lg"
                    fontWeight="600"
                    color="warmGray.50"
                    >
                    Sample Name
                    </Heading>

                    <Heading
                    alignSelf="center"
                    size="md"
                    fontWeight="300"
                    color="warmGray.50"
                    >
                    0412345678
                    </Heading>

                    <Heading
                    alignSelf="center"
                    size="md"
                    fontWeight="300"
                    color="warmGray.50"
                    >
                    sample@gmial.com
                    </Heading>
            </Box>
            </Box>
            
            <Button
                onPress={() => navigate('New Pet Page')} 
                title="Add New Pet" /> 
            
            </Center>
        </Box>
                            
    )
}