import { Share } from "react-native";
import { Button } from "react-native-paper";
import { Color } from "../atomic/Theme";

const ShareButton = ({ title, message, dialogTitle, textColor, url, width }) => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: title,
                message: message,
                    // url: "https://finding-neno.app" // TODO: add this when we have a website
                options: {
                    // Android only:
                    dialogTitle: dialogTitle,
                    // iOS only:
                    subject: "hle",
                }
            });
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Button onPress={onShare} style={{ width: width, borderRadius:10 }} labelStyle={{ fontWeight: 'bold'}} textColor={'white'} 
            buttonColor={Color.LIGHTER_NENO_BLUE} compact={true} icon="export-variant" mode="contained">Share</Button>

    )
}

export default ShareButton;