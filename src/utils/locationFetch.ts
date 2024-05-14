import axios from 'axios';

const nominatim_api_url = process.env.NOMINATIM_API_URL as string;

export async function fetchLocation() {
    try {
        const response = await axios.get(nominatim_api_url, {
            
        });
    
        return response.data; // Return weather data
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error; // Rethrow the error for handling elsewhere
    }
}