import Sighting from './Sighting';
import { FlatList } from 'native-base';
import { memo, useState } from "react";
import { Text } from 'react-native-paper';
import { formatDateTimeDisplay } from '../Pages/shared';

function SightingsList({sightings, onRefresh, columns}) {
    const [refreshing, setRefreshing] = useState(false);
    const onListRefresh = () => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }

    return (
        <FlatList paddingY='3%' width='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ alignItems: 'center' }}
            data={sightings}
            renderItem={({ item }) => <Sighting sighting={item} />}
            keyExtractor={item => `${item[0]}`}
            onRefresh={onListRefresh}
            refreshing={refreshing}
            ListEmptyComponent={<Text style={{ paddingVertical: '5%', fontSize: 15, fontWeight: '700' }}>There are no reported sightings.</Text>}
            ListFooterComponent={<Text style={{ paddingVertical: '5%', fontSize: 15, fontWeight: '700' }}>Last updated {formatDateTimeDisplay(new Date())}</Text>}
        />
    )
}

export default memo(SightingsList);