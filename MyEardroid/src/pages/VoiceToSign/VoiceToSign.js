import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, PermissionsAndroid, Image } from 'react-native';
import { globalStyles } from '../../globalStyles';
import Voice from '@react-native-voice/voice';
import CustomButton from '../../components/CustomButton';
import images from '../../assets/images';

function VoiceToSign() {
    const [started, setStarted] = useState(false);
    const [results, setResults] = useState();
    const [researchResult, setResearchResult] = useState([]);

    useEffect(() => {
        // Voice.onSpeechStart = startSpeechToText;
        // Voice.onSpeechEnd = stopSpeechToText;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

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

                const getService = await Voice.getSpeechRecognitionServices();
                console.log('[voice service]', getService);
            }
        }
        androidPermissionChecking();

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, []);

    const startSpeechToText = async () => {
        setStarted(true);
        console.log('start...');
        try {
            await Voice.start('vi-VN');
        } catch (error) {
            console.log('start error', error);
        }
    };

    const stopSpeechToText = async () => {
        setStarted(false);
        console.log('stop');
        try {
            await Voice.stop();
        } catch (error) {
            console.log('stop error', error);
        }
    };

    const onSpeechResults = (result) => {
        const text = result.value[0].toString();
        setResults((prev) => {
            if (prev) {
                return `${prev}. ${text}`;
            } else {
                return text;
            }
        });
        console.log('[on result]', text);
    };

    const onSpeechError = (error) => {
        console.log(error);
    };

    const removeAccent = (char) => {
        const c = char.toLowerCase();
        const huyen = 'àầằèềìòồờùừỳ';
        const sac = 'áấắéếíóốớúứý';
        const hoi = 'ảẩẳẻểỉỏổởủửỷ';
        const nga = 'ãẫẵẽễĩõỗỡũữỹ';
        const nang = 'ạậặẹệịọộợụựỵ';
        const res = 'aâăeêioôơuưy';
        const length = res.length;
        if (huyen.includes(c) || sac.includes(c) || hoi.includes(c) || nga.includes(c) || nang.includes(c)) {
            for (let i = 0; i < length; i++) {
                if (huyen[i] === c) {
                    return [res[i], 'u0300'];
                } else if (sac[i] === c) {
                    return [res[i], 'u0301'];
                } else if (hoi[i] === c) {
                    return [res[i], 'u0309'];
                } else if (nga[i] === c) {
                    return [res[i], 'u0303'];
                } else if (nang[i] === c) {
                    return [res[i], 'u0323'];
                }
            }
        }
        return [char];
    }
    
    const textToSign = (str) => {
        const regex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        str = str.replace(regex, '');
        const words = str.split(' ');
        const res = [];
        words.forEach((word) => {
            const word_array = [];
            word = word.split('');
            word.forEach((char) => {
                const c = removeAccent(char.toLowerCase());
                word_array.push(...c);
            });
            res.push(word_array);
        });
        
        return res;
    }

    const handleResearch = (results) => {
        if (results) {
            const res = textToSign(results);
            console.log('[sign]', res);
            setResearchResult(res);
        }
    }

    const handleDelete = () => {
        setResults();
        setResearchResult([]);
    }

    return (
        <View style={[globalStyles.container, styles.container]}>
            <View style={styles.contentContainer}>
                <ScrollView>
                    {/* <Text style={styles.contentText}>{results && results}</Text> */}
                    <TextInput 
                        style={styles.contentText}
                        placeholder='Ấn vào mic để nói'
                        multiline
                        value={results}
                        editable={false}
                        // onChangeText={(value) => setResults(value)}
                    />
                </ScrollView>
            </View>
            <View style={[globalStyles.flexRow, { columnGap: 20, }]}>
                <CustomButton onPress={() => handleResearch(results)} style={styles.actionBtn}>
                    <Image style={styles.btnIcon} source={images.research} />
                    <Text style={styles.btnText}>Tra cứu</Text>
                </CustomButton>
                <CustomButton onPress={handleDelete} style={styles.actionBtn}>
                    <Image style={styles.btnIcon} source={images.delete} />
                    <Text style={styles.btnText}>Xóa</Text>
                </CustomButton>
            </View>
            <View>
                <ScrollView horizontal>
                    {results && (researchResult.length > 0) && researchResult.map((res, index) => (
                        <View key={index} style={styles.resultContainer}>
                            <View style={styles.resultWordContainer}>
                                <Text style={styles.resultWordText}>{results.split(' ').at(index)}</Text>
                            </View>
                            <View style={globalStyles.flexRow}>
                                {res.map((res, index) => (
                                    <View key={index} style={styles.resultImgContainer}>
                                        {res && <Image source={images[res]} />}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <CustomButton
                style={styles.micBtn}
                onPress={started ? stopSpeechToText : startSpeechToText} 
            >
                <Image 
                    style={styles.micImg}
                    source={started ? images.mic_off : images.mic}
                />
            </CustomButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        rowGap: 20,
        position: 'relative',
    },
    contentContainer: {
        padding: 20,
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: '#3a86f4',
        borderRadius: 10,
    },
    contentText: {
        fontSize: 20,
        color: 'black',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#3a86f4',
    },
    btnIcon: {
        marginRight: 10,
        width: 30,
        height: 30,
    },
    btnText: {
        fontSize: 20,
        color: 'white',
    },
    micBtn: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
        borderWidth: 1,
        borderColor: '#3a86f4',
        borderRadius: 9999,
    },
    micImg: {
        width: 40,
        height: 40,
    },
    resultContainer: {
        marginTop: 40,
        marginRight: 20,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#3a86f4',
    },
    resultWordContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#3a86f4',
    },
    resultWordText: {
        color: 'white',
        fontSize: 20,
    },
    resultImgContainer: {
        padding: 10,
    },
})

export default VoiceToSign;