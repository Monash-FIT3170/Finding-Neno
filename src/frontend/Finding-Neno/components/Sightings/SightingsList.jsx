import Sighting from './Sighting';
import { FlatList } from 'native-base';
import { memo, useState } from "react";
import { Text } from 'react-native-paper';
import { formatDateTimeDisplay } from '../../Pages/shared';

function SightingsList({sightings, onRefresh, columns, emptyText}) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefreshList = () => {
        onRefresh();
    }

    return (
        <FlatList width='100%' height='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} 
            data={sightings}
            renderItem={({ item }) => <Sighting sighting={item} refresh={onRefreshList}/>}
            keyExtractor={item => `${item[0]}`}
            onRefresh={onRefreshList}
            refreshing={refreshing}
            
            ListEmptyComponent={<Text style={{ paddingTop: 30, fontSize: 15, fontWeight: '700', alignSelf: 'center'}}>{emptyText}</Text>}
            ListFooterComponent={<Text style={{ paddingVertical: 30, fontSize: 15, fontWeight: '700' , alignSelf: 'center'}}>Last updated {formatDateTimeDisplay(new Date())}</Text>}
        />
    )
}

export default memo(SightingsList);