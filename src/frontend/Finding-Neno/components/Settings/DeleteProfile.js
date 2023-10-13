import React from 'react';
import { Heading, Box, HStack, Text, Button} from 'native-base';
import { Dimensions, View} from 'react-native';

function DeleteProfile() {
  const { OS, WINDOW_WIDTH, WINDOW_HEIGHT} = useSelector((state) => state.device);

    return (
      <View>
        <Box h={150} backgroundColor={"#FFFFFF"} borderRadius={10}>
        <Box padding={3}>
        <HStack justifyContent="space-between" marginBottom={3}>
        <Heading
          fontSize="md"
          color="coolGray.600"
          _dark={{ color: "warmGray.200" }}
          pr={WINDOW_WIDTH / 3.5}
        >
        Delete Profile
        </Heading>
        </HStack>   

        <Text fontSize="xs" color={"#BCBCBC"} marginBottom={2}>
          This will permentaly delete your account, and all data associated with it. This action cannot be undone.
        </Text> 

        <Button background={"#FF0800"} >
          <Text color={"#FFFFFF"} fontSize="md">Delete Profile</Text>
        </Button>
        </Box>  
        </Box>

      </View>
    );
  }
  
  export default DeleteProfile;