import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Builds the request URL for the OpenWeather API.
 * @param {string} endpoint - API endpoint (e.g. 'weather', 'forecast').
 * @param {Object} params - Query parameters to append.
 * @returns {string} Fully constructed URL string.
 */
const buildUrl = (endpoint, params) => {
  const query = new URLSearchParams({
    ...params,
    appid: process.env.OPENWEATHER_API_KEY,
    units: 'metric',
  }).toString();
  return `${BASE_URL}/${endpoint}?${query}`;
};

/**
 * Fetches current weather data for a city.
 * @param {string} city - Name of the city to look up.
 * @returns {Promise<Object>} Parsed weather data from the API.
 * @throws {Error} On network failure or non-2xx API response.
 */
const fetchCurrentWeather = async (city) => {
  try {
    const url = buildUrl('weather', { q: city });
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`API error ${status}: ${data.message || 'Unknown error'}`);
    }
    throw new Error(`Network error: ${error.message}`);
  }
};

/**
 * Fetches a 5-day weather forecast for a city.
 * @param {string} city - Name of the city to look up.
 * @returns {Promise<Object>} Parsed forecast data from the API.
 * @throws {Error} On network failure or non-2xx API response.
 */
const fetchForecast = async (city) => {
  try {
    const url = buildUrl('forecast', { q: city });
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`API error ${status}: ${data.message || 'Unknown error'}`);
    }
    throw new Error(`Network error: ${error.message}`);
  }
};

export { fetchCurrentWeather, fetchForecast, buildUrl };
