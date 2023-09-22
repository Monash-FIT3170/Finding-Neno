import Report from './Report';
import { FlatList, ScrollView } from 'native-base';
import { RefreshControl } from 'react-native';
import { memo, useState } from 'react';

function ReportsList({reports, onRefresh, columns}) {
    const [refreshing, setRefreshing] = useState(false);
    const onListRefresh = () => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }

    return (
        <FlatList paddingY='3%' width='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ alignItems: 'center' }}
            data={reports}
            renderItem={({item}) => <Report report={item} />}
            keyExtractor={item => `${item[0]}`}
            onRefresh={onListRefresh}
            refreshing={refreshing}
        />
    )
}

export default memo(ReportsList);

