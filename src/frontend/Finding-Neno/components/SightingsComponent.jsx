import Sighting from './Sighting';
import { ScrollView } from "native-base";
import { RefreshControl } from 'react-native';
import { memo } from "react";

function SightingsComponent({sightings, onRefresh}) {
    return (
		<ScrollView style={{ backgroundColor: '#EDEDED' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{
                sightings?.map((sighting, index) => (
                    <Sighting sighting={sighting} key={index} />
                ))
            }
		</ScrollView>
    )
}

export default memo(SightingsComponent);