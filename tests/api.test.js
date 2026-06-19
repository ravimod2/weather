import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
  default: { get: jest.fn() },
}));

const { default: axios } = await import('axios');
const { fetchCurrentWeather, fetchForecast, buildUrl } = await import('../src/api.js');

describe('buildUrl', () => {
  test('includes endpoint and query params', () => {
    process.env.OPENWEATHER_API_KEY = 'testkey';
    const url = buildUrl('weather', { q: 'London' });
    expect(url).toContain('weather');
    expect(url).toContain('q=London');
    expect(url).toContain('appid=testkey');
    expect(url).toContain('units=metric');
  });
});

describe('fetchCurrentWeather', () => {
  test('returns data on success', async () => {
    axios.get.mockResolvedValue({ data: { name: 'London', main: { temp: 15 } } });
    const result = await fetchCurrentWeather('London');
    expect(result.name).toBe('London');
  });

  test('throws formatted message on API error', async () => {
    axios.get.mockRejectedValue({
      response: { status: 404, data: { message: 'city not found' } },
    });
    await expect(fetchCurrentWeather('Nowhere')).rejects.toThrow('API error 404: city not found');
  });

  test('throws network error message when no response', async () => {
    axios.get.mockRejectedValue(new Error('ECONNREFUSED'));
    await expect(fetchCurrentWeather('London')).rejects.toThrow('Network error: ECONNREFUSED');
  });

  test('falls back to Unknown error when message is absent', async () => {
    axios.get.mockRejectedValue({ response: { status: 500, data: {} } });
    await expect(fetchCurrentWeather('London')).rejects.toThrow('API error 500: Unknown error');
  });
});

describe('fetchForecast', () => {
  test('returns data on success', async () => {
    axios.get.mockResolvedValue({ data: { city: { name: 'Paris' }, list: [] } });
    const result = await fetchForecast('Paris');
    expect(result.city.name).toBe('Paris');
  });

  test('throws formatted message on API error', async () => {
    axios.get.mockRejectedValue({
      response: { status: 401, data: { message: 'Invalid API key' } },
    });
    await expect(fetchForecast('Paris')).rejects.toThrow('API error 401: Invalid API key');
  });

  test('falls back to Unknown error when message is absent', async () => {
    axios.get.mockRejectedValue({ response: { status: 503, data: {} } });
    await expect(fetchForecast('Paris')).rejects.toThrow('API error 503: Unknown error');
  });

  test('throws network error message when no response', async () => {
    axios.get.mockRejectedValue(new Error('ETIMEDOUT'));
    await expect(fetchForecast('Paris')).rejects.toThrow('Network error: ETIMEDOUT');
  });
});
