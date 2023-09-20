import Report from './Report';
import { ScrollView } from "native-base";
import { RefreshControl } from 'react-native';
import { memo } from "react";

function ReportsComponent({reports, onRefresh}) {
    console.log(reports)
    return (
		<ScrollView width='100%' style={{ backgroundColor: '#EDEDED' }} contentContainerStyle={{ alignItems: 'center' }} refreshControl={<RefreshControl onRefresh={onRefresh} />}>
			{
                reports?.map((report, index) => (
                    <Report report={report} key={index} />
                ))
            }
		</ScrollView>
    )
}

export default memo(ReportsComponent);

