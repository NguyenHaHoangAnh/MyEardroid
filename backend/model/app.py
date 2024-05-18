# import uuid
from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

# from main import features_extractor, predict

app = Flask(__name__)

@app.route('/') 
def home():
    return "Hello, world!"

@app.route('/predict', methods=['POST'])

def predict_sound():
    # print(request.files)
    print("Hello")
    file = request.files['file']
    print(file)
    print(file.filename)
    # print(type(file))
    

    return jsonify({"prediction": "Hello"})
    # filename = "sound_" + str(uuid.uuid4()) + ".wav"
    # file.save(filename)
    # test_data = features_extractor(filename)
    # test_features = test_data.reshape(1, -1, 80)
    # print("Reshaped Array Size", test_features.shape)
    # prediction = predict(test_features)
    # os.remove(filename)
    # return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(port=5000)