import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, PermissionsAndroid, Vibration } from 'react-native';
import { Buffer } from 'buffer';
import { globalStyles } from '../../globalStyles';
import images from '../../assets/images';
import CustomButton from '../../components/CustomButton';
import AudioRecord from 'react-native-audio-record';
import axios from 'axios';
import RNFS from 'react-native-fs';

function SoundDetection() {
    const [powerOn, setPowerOn] = useState(false);
    const [audio, setAudio] = useState({ 
        url: '', 
        recording: false, 
    });
    // const [audios, setAudios] = useState([]);
    const [result, setResult] = useState('');

    useEffect(() => {
    const androidPermissionChecking = async () => {
        if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );
            if (!granted) {
                console.log('Permission denied');
            }
        }
        console.log('[hasPermission]', hasPermission);
        }
    }
    androidPermissionChecking();

    }, []);

    async function startRecording() {
        try {
            console.log('Start recording...');
            // setAudioIndex(prev => (prev + 1));

            const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: `test.wav` // default 'audio.wav'
            };
            
            AudioRecord.init(options);
            AudioRecord.on('data', data => {
            // base64-encoded audio data chunks
            const chunk = Buffer.from(data, 'base64');
            // console.log('[chunk size]', chunk.byteLength);
            });
            setAudio({ url: '', recording: true, loaded: false });
            
            AudioRecord.start();
        } catch (error) {
            
        }
    }
    
    async function stopRecording() {
        try {
            if (!audio.recording) return;
            console.log('Stop recording');
            let audioFile = await AudioRecord.stop();
            console.log('[audio path]', audioFile);
            // const url = audioFile;

            const url = `${RNFS.DocumentDirectoryPath}/test.wav`;
            // console.log('[url]', url);

            let record = { url, recording: false, loaded: false }
            setAudio(record);
            getResult(url);

            // setAudios(prev => [...prev, record]);
        } catch (error) {
            
        }
    }

    function getResult(url) {
    const file = {
        uri: `file://${url}`,
        type: 'audio/wav',
        name: `test.wav`,
    };
    
    // playRecording(file.uri);
    console.log('[from node]', file.uri);

    const formData = new FormData();
    formData.append('file', file);
    // console.log('[form data]', formData);

    axios
        .post('http://192.168.1.8:3001/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            console.log('[result]', response.data);
            setResult(response.data);
        })
        .catch(error => {
            // console.error('Axios error:', error);
        });

    // axios
    //   .post('http://192.168.1.8:3001/predict', { url })
    //   .then(response => {
    //     console.log('[result]', response.data);
    //     setResult(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Axios error:', error);
    //   });
    }
    
    const getResultText = (result) => {
        if (result !== '[1]' && result !== '[2]' && result !== '[3]') return '';
        return new Map([
            ['[1]', 'Thông báo sân bay'],
            ['[2]', 'Còi xe ưu tiên'],
            ['[3]', 'Còi báo cháy'],
        ]).get(result);
    }

    const togglePower = () => {
        setPowerOn(!powerOn);
        setResult('');
    }

    useEffect(() => {
        if (powerOn) {
            const intervalId = setInterval(startRecording, 10000);

            return () => clearInterval(intervalId);
        }
    }, [powerOn]);

    useEffect(() => {
        if (audio.recording) {
            const timeId = setTimeout(stopRecording, 4000);

            return () => clearTimeout(timeId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audio]);

    useEffect(() => {
        if ((result === '[1]' || result === '[2]' || result === '[3]') && powerOn) {
            Vibration.vibrate([1000, 2000, 1000], true); // wait 1s, vibrate 2s, wait 1s
        } else {
            Vibration.cancel();
        }
    }, [result, powerOn]);

    return (
        <View style={globalStyles.container}>
            <View style={[globalStyles.itemsCenter, globalStyles.justifyCenter, globalStyles.flex1]}>
                {(result === '[1]' || result === '[2]' || result === '[3]') && powerOn ? (
                    <Image source={images[result]} style={styles.resultImage} />
                ) : (
                    <View style={styles.resultImage}></View>
                )}
                <Text style={styles.resultText}>{powerOn && getResultText(result)}</Text>
            </View>
            <View style={[globalStyles.itemsCenter, styles.power]}>
                <CustomButton onPress={togglePower}>
                    <Image 
                        source={powerOn ? images.mic_circle_outline : images.mic_off_circle_outline}
                        style={[styles.powerBtn, powerOn && styles.powerBtnActive]} 
                    />
                </CustomButton>
                <Text style={globalStyles.text}>
                    {powerOn ? 'Bật' : 'Tắt'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    resultImage: {
        width: 200,
        height: 200,
        objectFit: 'contain',
    },
    resultText: {
        marginTop: 20,
        fontSize: 24,
    },
    power: {
        marginBottom: 80,
    },
    powerBtn: {
        width: 140,
        height: 140,
    },
    powerBtnActive: {
        ...globalStyles.primaryColor,
    },
})

export default SoundDetection;