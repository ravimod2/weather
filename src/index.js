#!/usr/bin/env node
import 'dotenv/config';
import { program } from 'commander';
import { fetchCurrentWeather, fetchForecast } from './api.js';
import { formatCurrentWeather, formatForecast, formatFooter } from './formatter.js';

/**
 * Handles the 'current' CLI command — fetches and prints current weather.
 * @param {string} city - Name of the city to look up.
 * @returns {Promise<void>}
 */
const runCurrent = async (city) => {
  try {
    const data = await fetchCurrentWeather(city);
    console.log(formatCurrentWeather(data));
    console.log(formatFooter());
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

/**
 * Handles the 'forecast' CLI command — fetches and prints 5-day forecast.
 * @param {string} city - Name of the city to look up.
 * @returns {Promise<void>}
 */
const runForecast = async (city) => {
  try {
    const data = await fetchForecast(city);
    console.log(formatForecast(data));
    console.log(formatFooter());
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

program
  .name('weather')
  .description('CLI tool to fetch weather data from OpenWeather API')
  .version('1.0.0');

program.command('current <city>').description('Show current weather for a city').action(runCurrent);
program.command('forecast <city>').description('Show 5-day forecast for a city').action(runForecast);

/* istanbul ignore next */
if (!process.env.JEST_WORKER_ID) program.parse();

export { runCurrent, runForecast };
