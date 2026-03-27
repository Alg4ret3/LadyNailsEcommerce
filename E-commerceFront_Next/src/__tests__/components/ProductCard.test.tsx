import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';

// Mocking Contexts
jest.mock('@/context/CompareContext');
jest.mock('@/context/WishlistContext');

// Mocking Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mocking Framer Motion AnimatePresence
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mocking AddToCartModal
jest.mock('@/components/organisms/AddToCartModal', () => ({
  AddToCartModal: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="add-to-cart-modal">Modal Open</div> : null
  ),
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 15000,
    image: '/test-image.jpg',
    slug: 'test-product',
    vendor: 'Test Vendor',
    tags: ['Calidad Premium'], // Use a non-system tag to ensure it's visible
  };

  const mockAddToCompare = jest.fn();
  const mockRemoveFromCompare = jest.fn();
  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCompare as jest.Mock).mockReturnValue({
      addToCompare: mockAddToCompare,
      removeFromCompare: mockRemoveFromCompare,
      isInCompare: jest.fn().mockReturnValue(false),
    });
    (useWishlist as jest.Mock).mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isFavorite: jest.fn().mockReturnValue(false),
    });
  });

  it('renders product information correctly', () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('$15.000')).toBeInTheDocument();
    const img = screen.getByAltText('Test Product');
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('displays the visible tag badge', () => {
    render(<ProductCard {...mockProduct} />);
    expect(screen.getByText('Calidad Premium')).toBeInTheDocument();
  });

  it('displays the "Mayorista" badge when isWholesale is true', () => {
    render(<ProductCard {...mockProduct} isWholesale={true} />);
    expect(screen.getByText('Mayorista')).toBeInTheDocument();
  });

  it('calls toggleFavorite when heart button is clicked', () => {
    render(<ProductCard {...mockProduct} />);
    const heartBtn = screen.getByLabelText('Añadir de favoritos');
    fireEvent.click(heartBtn);
    expect(mockToggleFavorite).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      name: 'Test Product',
    }));
  });

  it('calls addToCompare when compare button is clicked', () => {
    render(<ProductCard {...mockProduct} />);
    // Bottom actions are: [Añadir, Compare]
    // Quick actions are: [Heart]
    // Total buttons: [Heart, Añadir, Compare]
    const buttons = screen.getAllByRole('button');
    const compareBtn = buttons[2]; 
    fireEvent.click(compareBtn);
    expect(mockAddToCompare).toHaveBeenCalled();
  });

  it('opens AddToCartModal when "Añadir" button is clicked', () => {
    render(<ProductCard {...mockProduct} />);
    const addBtn = screen.getByText('Añadir').closest('button')!;
    fireEvent.click(addBtn);
    expect(screen.getByTestId('add-to-cart-modal')).toBeInTheDocument();
  });

  it('shows red heart and different label when product is favorite', () => {
    (useWishlist as jest.Mock).mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isFavorite: jest.fn().mockReturnValue(true),
    });
    render(<ProductCard {...mockProduct} />);
    const heartBtn = screen.getByLabelText('Eliminar de favoritos');
    expect(heartBtn).toHaveClass('bg-red-500');
  });

  it('calls removeFromCompare when already in compare', () => {
    (useCompare as jest.Mock).mockReturnValue({
      addToCompare: mockAddToCompare,
      removeFromCompare: mockRemoveFromCompare,
      isInCompare: jest.fn().mockReturnValue(true),
    });
    render(<ProductCard {...mockProduct} />);
    // Total buttons: [Heart, "Eliminar de comparación", Añadir, Compare]
    const buttons = screen.getAllByRole('button');
    const removeBtn = buttons[1]; // The conditional one
    fireEvent.click(removeBtn);
    expect(mockRemoveFromCompare).toHaveBeenCalledWith('1');
  });
});
