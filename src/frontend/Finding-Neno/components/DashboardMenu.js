import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Menu } from 'native-base';


function DashboardMenu({ navigation }) {
    return (
      <View>
        <View justifyContent="center" alignItems="center" padding={4} height="">
          <Menu shadow={2} w="190" trigger={(triggerProps) => (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Text> New Post </Text>
            </Pressable>
          )}>
            <Menu.Item>
              <Text style={{ textAlign: 'left' }} onPress={() => navigation.navigate('Report', { screen: 'New Report Page' })}>Report</Text>
            </Menu.Item>
            <Menu.Item>
              <Text style={{ textAlign: 'left' }}>Sighting</Text>
            </Menu.Item>
          </Menu>
        </View>
      </View>
    );
  }
  
  export default DashboardMenu;