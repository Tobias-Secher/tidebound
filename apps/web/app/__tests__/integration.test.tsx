import { render, screen } from '@testing-library/react';
import { Button } from '@repo/ui/button';

describe('Cross-workspace integration', () => {
  it('can import and test components from @repo/ui', () => {
    render(<Button appName="web">Imported Button</Button>);
    expect(screen.getByText('Imported Button')).toBeInTheDocument();
  });

  it('renders button with correct attributes', () => {
    render(<Button appName="web">Test Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });
});
