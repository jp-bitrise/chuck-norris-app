import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QuoteCard } from './QuoteCard';

describe('QuoteCard', () => {
  it('renders the quote text', async () => {
    await render(<QuoteCard quote="Chuck Norris can divide by zero." iconUrl={null} />);

    expect(screen.getByText('Chuck Norris can divide by zero.')).toBeTruthy();
  });

  it('renders the icon when an iconUrl is provided', async () => {
    await render(<QuoteCard quote="Some quote" iconUrl="https://example.com/icon.png" />);

    expect(screen.getByTestId('quote-icon')).toBeTruthy();
  });

  it('omits the icon when iconUrl is null', async () => {
    await render(<QuoteCard quote="Some quote" iconUrl={null} />);

    expect(screen.queryByTestId('quote-icon')).toBeNull();
  });
});
