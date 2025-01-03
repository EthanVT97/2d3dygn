import axios from 'axios';

const API_URL = 'https://myanmar-betting-api.onrender.com';

async function testAPI() {
    try {
        console.log('Testing API connection...');
        console.log(`URL: ${API_URL}`);
        
        const response = await axios.get(API_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('\nResponse Status:', response.status);
        console.log('Response Headers:', response.headers);
        console.log('Response Data:', response.data);
        
        // Also test the /api/matches endpoint
        console.log('\nTesting /api/matches endpoint...');
        const matchesResponse = await axios.get(`${API_URL}/api/matches`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('\nMatches Response Status:', matchesResponse.status);
        console.log('Matches Data:', matchesResponse.data);
        
    } catch (error) {
        console.error('\nError occurred:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response Status:', error.response.status);
            console.error('Response Headers:', error.response.headers);
            console.error('Response Data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
    }
}

testAPI();
