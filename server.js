// Load Environment Variables from .env file immediately
require('dotenv').config();

const express = require('express');
const axios = require('axios'); // For making HTTP requests to external API

const app = express();
const PORT = process.env.PORT || 3500;

// --- CONFIGURATION CONSTANTS (From Env Vars) ---
const USER_EMAIL = process.env.USER_EMAIL;
const USER_NAME = process.env.USER_NAME;
const USER_STACK = process.env.USER_STACK;
const CAT_FACTS_API_URL = process.env.CAT_FACTS_API_URL;
const API_TIMEOUT = 5000; // 5-second timeout for external API

// --- HELPER FUNCTION 1: Dynamic Timestamp ---
const getDynamicTimestamp = () => {
    // Returns the current UTC time in the required ISO 8601 format.
    return new Date().toISOString();
};

// --- HELPER FUNCTION 2: Cat Facts API Integration ---
const fetchCatFact = async () => {
    try {
        console.log('Attempting to fetch cat fact...');
        
        const response = await axios.get(CAT_FACTS_API_URL, {
            timeout: API_TIMEOUT, 
        });

        // Ensure the fact property exists in the response
        if (response.data && response.data.fact) {
            return response.data.fact;
        }

        // Handle case where API is up but returns unexpected structure
        throw new Error('Cat Facts API returned an invalid data structure.');

    } catch (error) {
        // Handle all failures (network error, timeout, non-200 status, etc.)
        console.error('External API Failure:', error.message);
        
        // Return a structured error object for the main handler to use
        return { 
            error: true, 
            message: `External API dependency failed: ${error.message}`
        };
    }
};

// --- CORE ENDPOINT: GET /me ---
app.get('/me', async (req, res) => {
    
    const factOrError = await fetchCatFact();

    // Check for External API Failure
    if (factOrError.error) {
        // Return a 503 Service Unavailable to indicate a critical dependency is down
        return res.status(503).json({
            status: "error",
            message: "Cannot fulfill request. External Cat Facts API is currently unavailable or timed out.",
            details: factOrError.message
        });
    }

    // Success Case: Construct the required JSON response
    const responseData = {
        "status": "success",
        "user": {
            "email": USER_EMAIL,
            "name": USER_NAME,
            "stack": USER_STACK
        },
        "timestamp": getDynamicTimestamp(),
        "fact": factOrError // This is the cat fact string
    };

    // Return 200 OK status. res.json() automatically sets Content-Type: application/json.
    res.status(200).json(responseData);
});

// Optional: A basic root route
app.get('/', (req, res) => {
    res.send(`Backend Wizards Stage 0 Task. Access the /me endpoint on port ${PORT}.`);
});


// --- SERVER STARTUP ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Endpoint is at http://localhost:${PORT}/me`);
});