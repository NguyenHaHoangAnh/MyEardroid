const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
}));

// Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Ensure this directory exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Endpoint to receive URL from frontend
// app.post('/predict', async(req, res) => {
//     const { url } = req.body;
//     console.log('[link from fe]', url);

//     try {
//         // Call your machine learning model here to make the prediction
//         const prediction = await predict(url);

//         // Return the prediction result to the frontend
//         console.log('[prediction]', prediction);
//         return res.json(prediction);
//     } catch (error) {
//         console.log(error);
//     }
// });

app.post('/predict', upload.single('file'), async(req, res) => {
    // const url = path.join(__dirname, req.file.path);
    // console.log('[from node]', url);

    const file = req.file;
    console.log('[Uploaded file]', file);
    
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    
    // return res.json(file);
    const url = file.path;

    try {
        // Call your machine learning model here to make the prediction
        const prediction = await predict(url);

        // Return the prediction result to the frontend
        console.log('[prediction]', prediction);
        return res.json(prediction);
    } catch (error) {
        console.log(error);
    }
});

//check
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// Function to make the prediction using the machine learning model
function predict(url) {
    return new Promise((resolve, reject) => {
        // Command to activate the virtual environment
        const activateCommand = '.\\model\\venv\\Scripts\\activate';
    
        // Command to run your Python script
        const pythonCommand = 'python .\\model\\main.py';
    
        console.log('[from node]', url);
    
        // Activate the virtual environment and run Python script
        exec(`${activateCommand} && ${pythonCommand} ${url}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            
            console.log('[stdout]', stdout);

            let result = stdout.split('\n');
            result = result.filter((res) => (res !== ''));
            let prediction = result.at(-1).toString();
            prediction = prediction.replace('\r', '');
            console.log('[from python]', prediction);

            resolve(prediction);
        });
    });
}