# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import numpy as np
from flask import Flask, request, render_template
import pickle
import resampy
import librosa
import librosa.display
import sys


app = Flask(__name__)

MODEL_PATH = 'D:/Hochanhmetmoi/Tuong_tac_nguoi_may/BTL/backend/model/model_pickle'
model = pickle.load(open(MODEL_PATH, 'rb'))

def features_extractor(file_name):
    # if file_name:
    #     print("File Name", file_name)
    audio, sample_rate = librosa.load(file_name)
    mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=80)
    mfccs_scaled_features = np.mean(mfccs_features.T, axis=0)

    return mfccs_scaled_features

def predict(test_features):
    test_features_reshaped = np.reshape(test_features, (test_features.shape[0], 80, 1))
    test_pred = model.predict(test_features_reshaped)

    # print(np.argmax(test_pred, axis=1))
    return np.argmax(test_pred, axis=1)

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    input = sys.argv[1]

    # test_data = features_extractor("D:/Hochanhmetmoi/Tuong_tac_nguoi_may/BTL/reactNativeTestSpeechToText/backend/model/ambulance.wav")
    # print(input)
    test_data = features_extractor(input)
    test_features = test_data.reshape(1, -1, 80)
    # print("Reshaped Array Size", test_features.shape)
    result = predict(test_features)

    # if result:
    print(result)

