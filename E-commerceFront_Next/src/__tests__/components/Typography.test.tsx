import React from 'react';
import { render, screen } from '@testing-library/react';
import { Typography } from '@/components/atoms/Typography';

describe('Typography Component', () => {
  it('renders children correctly', () => {
    render(<Typography>Base Text</Typography>);
    expect(screen.getByText('Base Text')).toBeInTheDocument();
  });

  it('renders as a paragraph by default', () => {
    const { container } = render(<Typography>Default Variant</Typography>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('renders correct tag for h1-h4 variants', () => {
    const { container: containerH1 } = render(<Typography variant="h1">H1 Title</Typography>);
    expect(containerH1.querySelector('h1')).toBeInTheDocument();

    const { container: containerH2 } = render(<Typography variant="h2">H2 Title</Typography>);
    expect(containerH2.querySelector('h2')).toBeInTheDocument();

    const { container: containerH3 } = render(<Typography variant="h3">H3 Title</Typography>);
    expect(containerH3.querySelector('h3')).toBeInTheDocument();

    const { container: containerH4 } = render(<Typography variant="h4">H4 Title</Typography>);
    expect(containerH4.querySelector('h4')).toBeInTheDocument();
  });

  it('renders as span for small and detail variants', () => {
    const { container: containerSmall } = render(<Typography variant="small">Small Text</Typography>);
    expect(containerSmall.querySelector('span')).toBeInTheDocument();

    const { container: containerDetail } = render(<Typography variant="detail">Detail Text</Typography>);
    expect(containerDetail.querySelector('span')).toBeInTheDocument();
  });

  it('renders custom tag when "as" prop is provided', () => {
    const { container } = render(<Typography as="div">Custom Div</Typography>);
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Typography className="custom-test-class">Text</Typography>);
    const element = screen.getByText('Text').closest('p');
    expect(element).toHaveClass('custom-test-class');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Typography variant="h1">Text</Typography>);
    let element = screen.getByText('Text').closest('h1');
    expect(element).toHaveClass('text-4xl');

    rerender(<Typography variant="detail">Text</Typography>);
    element = screen.getByText('Text').closest('span');
    expect(element).toHaveClass('uppercase');
    expect(element).toHaveClass('tracking-[0.25em]');
  });
});
