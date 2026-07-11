import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a loading indicator while the quote is fetching', async () => {
    (global.fetch as jest.Mock).mockReturnValueOnce(new Promise(() => {}));

    await render(<App />);

    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('shows the quote once the fetch resolves', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        value: 'Chuck Norris can slam a revolving door.',
        url: '',
        icon_url: '',
      }),
    });

    await render(<App />);

    expect(
      await screen.findByText('Chuck Norris can slam a revolving door.')
    ).toBeTruthy();
  });

  it('shows an error and retries when Try Again is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', value: 'Recovered quote', url: '', icon_url: '' }),
      });

    await render(<App />);

    expect(await screen.findByText('Request failed with status 503')).toBeTruthy();

    fireEvent.press(screen.getByText('Try Again'));

    expect(await screen.findByText('Recovered quote')).toBeTruthy();
  });

  it('fetches a new quote when New Quote is pressed', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', value: 'First quote', url: '', icon_url: '' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '2', value: 'Second quote', url: '', icon_url: '' }),
      });

    await render(<App />);

    await screen.findByText('First quote');

    fireEvent.press(screen.getByText('New Quote'));

    expect(await screen.findByText('Second quote')).toBeTruthy();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});
