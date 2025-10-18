require('dotenv').config();

const express = require('express');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 3500;

const USER_EMAIL = process.env.USER_EMAIL;
const USER_NAME = process.env.USER_NAME;
const USER_STACK = process.env.USER_STACK;
const CAT_FACTS_API_URL = process.env.CAT_FACTS_API_URL;
const API_TIMEOUT = 5000; // 5-second timeout for external API

const getDynamicTimestamp = () => {
    return new Date().toISOString();
};

const fetchCatFact = async () => {
    try {
        console.log('Attempting to fetch cat fact...');
        
        const response = await axios.get(CAT_FACTS_API_URL, {
            timeout: API_TIMEOUT, 
        });

        if (response.data && response.data.fact) {
            return response.data.fact;
        }

        throw new Error('Cat Facts API returned an invalid data structure.');

    } catch (error) {
        console.error('External API Failure:', error.message);
        
        return { 
            error: true, 
            message: `External API dependency failed: ${error.message}`
        };
    }
};
app.get('/me', async (req, res) => {
    
    const factOrError = await fetchCatFact();

    if (factOrError.error) {
        return res.status(503).json({
            status: "error",
            message: "Cannot fulfill request. External Cat Facts API is currently unavailable or timed out.",
            details: factOrError.message
        });
    }

    const responseData = {
        "status": "success",
        "user": {
            "email": USER_EMAIL,
            "name": USER_NAME,
            "stack": USER_STACK
        },
        "timestamp": getDynamicTimestamp(),
        "fact": factOrError 
    };

    res.status(200).json(responseData);
});

// Optional: A basic root route
app.get('/', (req, res) => {
    res.send(`Backend Wizards Stage 0 Task. Access the /me endpoint on port ${PORT}.`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Endpoint is at http://localhost:${PORT}/me`);
});