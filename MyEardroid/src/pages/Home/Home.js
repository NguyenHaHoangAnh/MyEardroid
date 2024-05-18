import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { globalStyles } from '../../globalStyles';
import images from '../../assets/images';
import CustomButton from '../../components/CustomButton';
import config from '../../config';

function Home({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <View style={styles.container}>
                <CustomButton style={styles.btnContainer} onPress={() => navigation.navigate(config.routes.soundDetection)}>
                    <ImageBackground source={images.background} style={styles.btnBackground}>
                        <Image source={images.soundDetection} style={styles.btnImage} />
                        <Text style={styles.btnText}>Âm thanh thông báo</Text>
                    </ImageBackground>
                </CustomButton>
                <CustomButton style={styles.btnContainer} onPress={() => navigation.navigate(config.routes.voiceToSign)}>
                    <ImageBackground source={images.background} style={styles.btnBackground}>
                        <Image source={images.voiceToSign} style={styles.btnImage} />
                        <Text style={styles.btnText}>Giọng nói sang ký hiệu</Text>
                    </ImageBackground>
                </CustomButton>
                <CustomButton style={styles.btnContainer} onPress={() => navigation.navigate(config.routes.textToSign)}>
                    <ImageBackground source={images.background} style={styles.btnBackground}>
                        <Image source={images.textToSign} style={styles.btnImage} />
                        <Text style={styles.btnText}>Văn bản sang ký hiệu</Text>
                    </ImageBackground>
                </CustomButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
        height: '100%',
    },
    btnContainer: {
        width: '100%',
    },
    btnBackground: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
    },
    btnImage: {
        width: 100,
        height: 100,
    },
    btnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
})

export default Home;