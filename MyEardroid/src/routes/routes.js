import { Image, View, StyleSheet } from 'react-native';
import config from '../config';

import Header from '../components/Header';
import images from '../assets/images';

import Home from '../pages/Home';
import SoundDetection from '../pages/SoundDetection';
import VoiceToSign from '../pages/VoiceToSign';
import TextToSign from '../pages/TextToSign';

const defaultHeader = (title) => {
    return ({
        headerTitle: () => (<Header title={title} />),
        headerStyle: {
            backgroundColor: 'red',
            height: 200,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerBackground: () => (
            <View style={styles.container}>
                <Image source={images.background} style={styles.image}/>
                <View style={styles.containerBefore}></View>
            </View>
        ),
        cardStyle: {
            backgroundColor: 'white',
        },
    })
}

export const routes = [
    { name: config.routes.home, component: Home, options: defaultHeader('My ear droid') },
    { name: config.routes.soundDetection, component: SoundDetection, options: defaultHeader('Âm thanh thông báo')},
    { name: config.routes.voiceToSign, component: VoiceToSign, options: defaultHeader('Giọng nói sang ký hiệu')},
    { name: config.routes.textToSign, component: TextToSign, options: defaultHeader('Văn bản sang ký hiệu')},
];

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    containerBefore: {
        position: 'absolute',
        bottom: -10,
        width: '100%',
        height: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
