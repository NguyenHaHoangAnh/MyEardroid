import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    // Flex
    flexRow: {
        flexDirection: 'row',
    },
    flexCol: {
        flexDirection: 'column',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    itemsCenter: {
        alignItems: 'center',
    },
    flex1: {
        flex: 1,
    },
    // Color
    primaryColor: {
        color: '#3a86f4',
    },
    // Container
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 30,
    },
    // Text
    text: {
        fontSize: 16,
    },
});