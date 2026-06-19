import { formatCurrentWeather, formatForecast, iconToEmoji } from '../src/formatter.js';

const mockCurrentData = {
  name: 'London',
  main: { temp: 15, feels_like: 13, humidity: 80 },
  weather: [{ description: 'light rain', icon: '10d' }],
  wind: { speed: 5.2 },
};

const mockForecastData = {
  city: { name: 'London' },
  list: Array.from({ length: 8 }, (_, i) => ({
    dt: 1700000000 + i * 10800,
    main: { temp: 14 + i },
    weather: [{ description: 'clear sky', icon: '01d' }],
  })),
};

describe('iconToEmoji', () => {
  test('maps known icon codes', () => {
    expect(iconToEmoji('01d')).toBe('☀️');
    expect(iconToEmoji('01n')).toBe('🌙');
    expect(iconToEmoji('10d')).toBe('🌦️');
  });

  test('returns fallback for unknown codes', () => {
    expect(iconToEmoji('99x')).toBe('🌡️');
  });
});

describe('formatCurrentWeather', () => {
  test('includes city name', () => {
    const output = formatCurrentWeather(mockCurrentData);
    expect(output).toContain('London');
  });

  test('includes temperature', () => {
    const output = formatCurrentWeather(mockCurrentData);
    expect(output).toContain('15');
  });

  test('includes humidity', () => {
    const output = formatCurrentWeather(mockCurrentData);
    expect(output).toContain('80%');
  });

  test('includes wind speed', () => {
    const output = formatCurrentWeather(mockCurrentData);
    expect(output).toContain('5.2');
  });
});

describe('formatForecast', () => {
  test('includes city name in header', () => {
    const output = formatForecast(mockForecastData);
    expect(output).toContain('London');
  });

  test('renders one entry per 8 list items', () => {
    const output = formatForecast(mockForecastData);
    // 8 items, filter every 8th → 1 entry
    const lines = output.split('\n').filter((l) => l.includes('clear sky'));
    expect(lines).toHaveLength(1);
  });
});
