// import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders chess game', () => {
  render(<App />);
  const headingElement = screen.getByText(/chess game/i);
  expect(headingElement).toBeInTheDocument();
});
