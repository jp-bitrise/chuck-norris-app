import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useChuckNorris } from './useChuckNorris';
import { RANDOM_JOKE_ENDPOINT } from '../constants/api';

describe('useChuckNorris', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches a quote on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        value: 'Chuck Norris counted to infinity. Twice.',
        url: '',
        icon_url: 'https://example.com/icon.png',
      }),
    });

    const { result } = await renderHook(() => useChuckNorris());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith(RANDOM_JOKE_ENDPOINT);
    expect(result.current.quote).toBe('Chuck Norris counted to infinity. Twice.');
    expect(result.current.iconUrl).toBe('https://example.com/icon.png');
    expect(result.current.error).toBeNull();
  });

  it('sets an error when the response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { result } = await renderHook(() => useChuckNorris());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Request failed with status 500');
    expect(result.current.quote).toBeNull();
  });

  it('sets an error when the response has no value', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', value: '', url: '', icon_url: '' }),
    });

    const { result } = await renderHook(() => useChuckNorris());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Received an empty quote.');
  });

  it('sets an error when fetch rejects', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network down'));

    const { result } = await renderHook(() => useChuckNorris());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network down');
  });

  it('refetches when fetchQuote is called again', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', value: 'First quote', url: '', icon_url: '' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '2', value: 'Second quote', url: '', icon_url: '' }),
      });

    const { result } = await renderHook(() => useChuckNorris());

    await waitFor(() => expect(result.current.quote).toBe('First quote'));

    await act(async () => {
      await result.current.fetchQuote();
    });

    await waitFor(() => expect(result.current.quote).toBe('Second quote'));

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
