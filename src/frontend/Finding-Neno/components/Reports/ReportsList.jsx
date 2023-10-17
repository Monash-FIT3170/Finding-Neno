import Report from './Report';
import { FlatList } from 'native-base';
import { memo, useState } from 'react';
import { Text } from 'react-native-paper';
import { formatDateTimeDisplay } from '../../Pages/shared';

function ReportsList({reports, onRefresh, columns, userId}) {
    const [refreshing, setRefreshing] = useState(false);
    const onListRefresh = () => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }

    return (
        <FlatList width='100%' height='100%' numColumns={columns} style={{ backgroundColor: 'transparent' }} 
            data={reports}
            renderItem={({item}) => <Report report={item} userId={userId} />}
            keyExtractor={item => `${item[0]}`}
            onRefresh={onListRefresh}
            refreshing={refreshing}
            ListEmptyComponent={<Text style={{ paddingTop: 30, fontSize: 15, fontWeight: '700', alignSelf: 'center'}}>There are no reports of missing pets.</Text>}
            ListFooterComponent={<Text style={{ paddingVertical: 30, fontSize: 15, fontWeight: '700', alignSelf: 'center'}}>Last updated {formatDateTimeDisplay(new Date())}</Text>}
        />
    )
}

export default memo(ReportsList);

