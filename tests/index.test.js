import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/api.js', () => ({
  fetchCurrentWeather: jest.fn(),
  fetchForecast: jest.fn(),
}));

jest.unstable_mockModule('../src/formatter.js', () => ({
  formatCurrentWeather: jest.fn(() => 'formatted weather'),
  formatForecast: jest.fn(() => 'formatted forecast'),
}));

const { fetchCurrentWeather, fetchForecast } = await import('../src/api.js');
const { runCurrent, runForecast } = await import('../src/index.js');

describe('runCurrent', () => {
  let logSpy, errorSpy, exitSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('logs formatted weather on success', async () => {
    fetchCurrentWeather.mockResolvedValue({ name: 'London' });
    await runCurrent('London');
    expect(logSpy).toHaveBeenCalledWith('formatted weather');
  });

  test('logs error and exits on failure', async () => {
    fetchCurrentWeather.mockRejectedValue(new Error('API error 404'));
    await runCurrent('Nowhere');
    expect(errorSpy).toHaveBeenCalledWith('Error: API error 404');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('runForecast', () => {
  let logSpy, errorSpy, exitSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('logs formatted forecast on success', async () => {
    fetchForecast.mockResolvedValue({ city: { name: 'Paris' }, list: [] });
    await runForecast('Paris');
    expect(logSpy).toHaveBeenCalledWith('formatted forecast');
  });

  test('logs error and exits on failure', async () => {
    fetchForecast.mockRejectedValue(new Error('Network error: ECONNREFUSED'));
    await runForecast('Nowhere');
    expect(errorSpy).toHaveBeenCalledWith('Error: Network error: ECONNREFUSED');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
