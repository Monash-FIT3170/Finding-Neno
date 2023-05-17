import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Text, ScrollView, View, TouchableHighlight} from 'react-native';
import icon from'../assets/icon.png';

export default function DashboardPage() {
    const navigation = useNavigation();
    
    const mocks = [{ownerName: 'Sashenka', petName:'Piggy', species: 'Dog', breed: 'Shiba', isActive: true, lastLocation: 'Clayton, Victoria', lastDateTime: '12th May, 12:45pm'},
                    {ownerName: 'Sash', petName:'Bunny', species: 'Rabbit', breed: 'RabbitBreed', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm'},
                    {ownerName: 'Ana', petName:'Noni', species: 'Cat', breed: 'House cat', isActive: true, lastLocation: 'Melbourne, Victoria', lastDateTime: '15th May, 1:45pm'},
                    {ownerName: 'Alina', petName:'Liza', species: 'Dog', breed: 'Yorkshire Terrier', isActive: true, lastLocation: 'Berwick, Victoria', lastDateTime: '11th May, 11:00pm'},
                    {ownerName: 'Jason', petName:'Yoyo', species: 'Bird', breed: 'Parrot', isActive: true, lastLocation: 'Glen Waverley, Victoria', lastDateTime: '11th May, 1:00pm'}
                ]

    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            {mocks.map(({ownerName, petName, species, breed, isActive, lastLocation, lastDateTime}) => (
                <View style={{paddingBottom: 50}}>
                    <View style={{
                // backgroundColor: '#B8B8B8',
                backgroundColor: '#edede9',
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}>
                <View style={{ paddingTop: 10, paddingLeft: 20, paddingBottom: 5, backgroundColor: '#ced4da'}}>
                {/* TODO: put owner profile pic here */}
                    <Text style={{ fontSize: 30}}>{ownerName}</Text>
                </View>
                
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              
                  
                <View style={{width: '35%', height: '100%'}}>
                  {/* {petImage && <Image source={{ uri: petImage }} style={{ width: '100%', height: '100%', borderTopLeftRadius: 20 }} />} */}
                </View>

                <View style={{flex: 1, marginLeft: '5%', padding: '2%'}}>
                  <Text style={{ fontSize: 30, paddingBottom: 10 }}>{petName}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                    <View style={{flexDirection: 'column', alignItems: 'left'}}>
                      <Text style={{ fontSize: 12, color: "#6c757d" }}>Species:</Text>
                      <Text style={{ fontSize: 20, textTransform: 'capitalize' }}>{species}</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'left', marginLeft: '15%'}}>
                      <Text style={{ fontSize: 12, color: "#6c757d" }}>Breed:</Text>
                      <Text style={{ fontSize: 20 }}>{breed}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: "#6c757d", marginBottom: '1%' }}>Last seen location:</Text>
                  <Text style={{ fontSize: 14 }}>{lastLocation}</Text>
                  <Text style={{ fontSize: 12, color: "#6c757d", marginBottom: '1%' }}>Last seen time:</Text>
                  <Text style={{ fontSize: 14 }}>{lastDateTime}</Text>
                </View>
                
              </View>
            </View>

                </View>
            ))}
            


        </ScrollView>
    );
}