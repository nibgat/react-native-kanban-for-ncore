import {
    StyleSheet
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1
    },
    firstColumnItemContainer: {
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100%"
    },
    firstColumnItemTitle: {
        textAlign: "center"
    },
    firstColumnItemContent: {
        textAlign: "center" 
    },
    item: {
        height: "100%"
    }
});
export default styles;
