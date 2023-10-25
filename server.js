const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv'); // Import the dotenv library

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;  // Your OpenAI API key

// Handle the POST request to /process_transcription
app.post('http://localhost:3000/process_transcription', async (req, res) => {
    const transcribedText = req.body.transcription;

    try {
        // Make a request to the OpenAI API to generate a response
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: transcribedText,
            max_tokens: 50, // Adjust max tokens as needed
        }, {
            headers: {
                Authorization: `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data;

        // Extract the response from OpenAI
        const generatedResponse = responseData.choices[0].text;

        // Send the generated response back to the client
        res.json({ message: generatedResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate a response' });
    }
});
app.get('/', (req, res) => {
    res.send('Welcome to MyMindshere'); // Customize this message as needed
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


