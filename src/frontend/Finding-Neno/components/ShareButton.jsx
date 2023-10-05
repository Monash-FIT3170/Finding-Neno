import { Share } from "react-native";
import { Button } from "react-native-paper";
import { Color } from "./atomic/Theme";

const ShareButton = ({ title, message, dialogTitle, url, width }) => {
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
        <Button onPress={onShare} style={{ width: width }} labelStyle={{ fontWeight: 'bold' }} textColor={Color.NENO_BLUE} 
            buttonColor='white' compact={true} icon="export-variant" mode="elevated">Share</Button>

    )
}

export default ShareButton;