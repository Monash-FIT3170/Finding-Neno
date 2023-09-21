import Report from './Report';
import { FlatList, ScrollView } from "native-base";
import { RefreshControl } from 'react-native';
import { memo } from "react";

function ReportsList({reports, onRefresh, columns}) {
    return (
        <FlatList width='100%' numColumns={columns} style={{ backgroundColor: '#EDEDED' }} contentContainerStyle={{ alignItems: 'center' }}
            data={reports}
            renderItem={({item}) => <Report report={item} />}
            keyExtractor={item => `${item[0]}`}
            refreshControl={<RefreshControl onRefresh={onRefresh} />}
        />
    )
}

export default memo(ReportsList);

