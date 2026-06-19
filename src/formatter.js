import chalk from 'chalk';

/**
 * Maps a weather condition code to a display emoji.
 * @param {string} icon - OpenWeather icon code (e.g. '01d', '09n').
 * @returns {string} Corresponding emoji character.
 */
const iconToEmoji = (icon) => {
  const map = {
    '01d': '☀️',  '01n': '🌙',
    '02d': '⛅',  '02n': '⛅',
    '03d': '☁️',  '03n': '☁️',
    '04d': '☁️',  '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️',  '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[icon] ?? '🌡️';
};

/**
 * Formats current weather data into a display string.
 * @param {Object} data - Raw weather object from OpenWeather API.
 * @param {string} data.name - City name.
 * @param {Object} data.main - Temperature and humidity fields.
 * @param {Array}  data.weather - Array of weather condition objects.
 * @param {Object} data.wind - Wind speed and direction.
 * @returns {string} Formatted, chalk-coloured output string.
 */
const formatCurrentWeather = (data) => {
  const { name, main, weather, wind } = data;
  const condition = weather[0];
  const emoji = iconToEmoji(condition.icon);

  return [
    chalk.bold.cyan(`\n${emoji}  Weather in ${name}`),
    chalk.white(`  Condition : ${condition.description}`),
    chalk.yellow(`  Temp      : ${main.temp}°C  (feels like ${main.feels_like}°C)`),
    chalk.blue(`  Humidity  : ${main.humidity}%`),
    chalk.green(`  Wind      : ${wind.speed} m/s`),
  ].join('\n');
};

/**
 * Formats a forecast list into a condensed multi-day summary.
 * @param {Object} data - Raw forecast object from OpenWeather API.
 * @param {string} data.city.name - City name.
 * @param {Array}  data.list - Array of 3-hour forecast entries.
 * @returns {string} Formatted, chalk-coloured forecast string.
 */
const formatForecast = (data) => {
  const { city, list } = data;

  const dailySummaries = list
    .filter((_, i) => i % 8 === 0)
    .map((entry) => {
      const date = new Date(entry.dt * 1000).toDateString();
      const emoji = iconToEmoji(entry.weather[0].icon);
      return chalk.white(
        `  ${emoji}  ${chalk.bold(date.padEnd(20))} ${String(entry.main.temp).padStart(5)}°C  ${entry.weather[0].description}`
      );
    });

  return [
    chalk.bold.cyan(`\n📅  5-Day Forecast for ${city.name}`),
    ...dailySummaries,
  ].join('\n');
};

export { formatCurrentWeather, formatForecast, iconToEmoji };
