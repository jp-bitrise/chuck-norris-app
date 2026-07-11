import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renders the error message', async () => {
    await render(<ErrorView message="Something went wrong." onRetry={jest.fn()} />);

    expect(screen.getByText('Something went wrong.')).toBeTruthy();
  });

  it('calls onRetry when Try Again is pressed', async () => {
    const onRetry = jest.fn();
    await render(<ErrorView message="Something went wrong." onRetry={onRetry} />);

    fireEvent.press(screen.getByText('Try Again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
