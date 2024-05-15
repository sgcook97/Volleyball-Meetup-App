import axios from 'axios';

const NOMINATIM_API_URL = process.env.NOMINATIM_API_URL as string;

export async function fetchLocation() {
    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            
        });
    
        return response.data; // Return weather data
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error; // Rethrow the error for handling elsewhere
    }
}