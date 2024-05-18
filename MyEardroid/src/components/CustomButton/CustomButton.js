import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CustomButton({
    title,
    children,
    onPress,
    style,
}) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            {title &&
                <Text style={styles.text}>{title}</Text>
            }
            {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
});

export default CustomButton;