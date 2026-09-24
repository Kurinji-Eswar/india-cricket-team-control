import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the India Cricket dashboard', () => {
  render(<App />);
  expect(screen.getAllByText(/India Cricket/i).length).toBeGreaterThan(0);
});
