import { View, Text, StyleSheet } from "react-native";

function Header({ title }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    header: {
        // paddingBottom: 20,
        fontSize: 24,
        color: 'white',
    },
});

export default Header;