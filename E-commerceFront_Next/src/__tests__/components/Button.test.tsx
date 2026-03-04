import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';

describe('Button Component', () => {
  it('renders with label', () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<Button><span>Child Content</span></Button>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button label="Click Me" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders as a link when href is provided', () => {
    render(<Button label="Go Home" href="/" />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
