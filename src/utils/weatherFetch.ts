import { fetchWeatherApi } from 'openmeteo';

const open_meteo_api_url = process.env.OPEN_METEO_API_URL as string;

const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchWeather(latitude: number, longitude: number) {

    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "temperature_unit": "fahrenheit",
        "daily": [
            "temperature_2m_max",
            "precipitation_probability_mean",
        ],
    };

    try {
        const responses = await fetchWeatherApi(open_meteo_api_url, params);

        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const daily = response.daily()!;

        const weatherData = {

            hourly: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2mMax: daily.variables(0)!.valuesArray()!,
                precipitationChance: daily.variables(1)!.valuesArray()!,
            },
        
        };

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
