import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button appName="test">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows alert with app name on click', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    render(<Button appName="TestApp">Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(alertSpy).toHaveBeenCalledWith('Hello from your TestApp app!');
    alertSpy.mockRestore();
  });
});
