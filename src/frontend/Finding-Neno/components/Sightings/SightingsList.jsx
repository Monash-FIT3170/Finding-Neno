import Sighting from './Sighting';
import { FlatList, HStack } from 'native-base';
import { memo, useState } from "react";
import { Button, Text } from 'react-native-paper';
import { formatDateTimeDisplay } from '../../Pages/shared';
import FilterModal from "../Shared/FilterModal"
import IconText from '../Shared/IconText';

function SightingsList({sightings, onRefresh, columns, emptyText, colors, setFilters}) {
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
            
            ListHeaderComponent={<ListHeader count={sightings.length} colors={colors} setFilters={setFilters} />}
            ListEmptyComponent={<Text style={{ paddingTop: 30, fontSize: 15, fontWeight: '700', alignSelf: 'center'}}>{emptyText}</Text>}
            ListFooterComponent={<Text style={{ paddingVertical: 30, fontSize: 15, fontWeight: '700' , alignSelf: 'center'}}>Last updated {formatDateTimeDisplay(new Date())}</Text>}
        />
    )
}

const ListHeader = ({count, colors}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <HStack alignItems='center' justifyContent='space-between' width='100%' paddingX={5} marginY={2}>
            <FilterModal showModal={showModal} setShowModal={setShowModal}/>

            <Text>{count} sightings</Text>

            <Button onPress={() => setShowModal(true)} mode='text' textColor={colors.primary} style={{borderColor: colors.primary}}><IconText iconName='filter' 
                iconColor={colors.primary} text='Filters' textColor={colors.primary} /></Button>
        </HStack>
    )
}


export default memo(SightingsList);