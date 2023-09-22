import Report from './Report';
import { FlatList } from 'native-base';
import { memo, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

function ReportsList({reports, onRefresh, columns}) {
    const [refreshing, setRefreshing] = useState(false);
    const onListRefresh = () => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }

    return (
        <View style={{ alignItems: 'center' }}>
            <FlatList width='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} 
                contentContainerStyle={{ alignItems: 'center', paddingVertical: '3%' }}
                data={reports}
                renderItem={({item}) => <Report report={item} />}
                keyExtractor={item => `${item[0]}`}
                onRefresh={onListRefresh}
                refreshing={refreshing}
                ListFooterComponent={<Text style={{ paddingVertical: '5%', fontSize: 15, fontWeight: '700' }}>Last updated at {new Date().toLocaleTimeString()}</Text>}
            />
            <Text>Last updated: {new Date().getTime()}</Text>
        </View>
    )
}

export default memo(ReportsList);

