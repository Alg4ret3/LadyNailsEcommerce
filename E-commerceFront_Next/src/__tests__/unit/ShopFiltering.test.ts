import { filterProducts, FilterState } from '@/utils/shop-filters';
import { MedusaProduct } from '@/services/medusa/products';

describe('Shop Filtering Logic', () => {
  const mockProducts: MedusaProduct[] = [
    {
      id: '1',
      title: 'Gel Polish Red',
      handle: 'gel-polish-red',
      thumbnail: '/img1.jpg',
      variants: [{ id: 'v1', prices: [{ amount: 15000, currency_code: 'cop' }], calculated_price: { original_amount: 15000, calculated_amount: 15000 } }],
      categories: [{ id: 'cat1', name: 'Esmaltes', handle: 'esmaltes' }],
      brand: { id: 'b1', name: 'Lady Nails' },
      tags: [{ id: 't1', value: 'marca:Lady Nails' }],
    },
    {
      id: '2',
      title: 'Acrylic Kit',
      handle: 'acrylic-kit',
      thumbnail: '/img2.jpg',
      variants: [{ id: 'v2', prices: [{ amount: 45000, currency_code: 'cop' }], calculated_price: { original_amount: 45000, calculated_amount: 45000 } }],
      categories: [{ id: 'cat2', name: 'Kits', handle: 'kits' }],
      brand: { id: 'b2', name: 'OPI' },
      tags: [{ id: 't2', value: 'marca:OPI' }],
    },
    {
      id: '3',
      title: 'Top Coat',
      handle: 'top-coat',
      thumbnail: '/img3.jpg',
      variants: [{ id: 'v3', prices: [{ amount: 10000, currency_code: 'cop' }], calculated_price: { original_amount: 10000, calculated_amount: 10000 } }],
      categories: [{ id: 'cat1', name: 'Esmaltes', handle: 'esmaltes' }],
      // No brand/tag brand for this one to test defaults
    }
  ] as MedusaProduct[];

  const baseState: FilterState = {
    query: '',
    priceRange: 100000,
    selectedCategories: [],
    selectedBrands: [],
  };

  it('should return all products when no filters are applied', () => {
    const result = filterProducts(mockProducts, baseState);
    expect(result.length).toBe(3);
  });

  it('should filter by search query (case insensitive)', () => {
    const result = filterProducts(mockProducts, { ...baseState, query: 'gel' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Gel Polish Red');

    const result2 = filterProducts(mockProducts, { ...baseState, query: 'COAT' });
    expect(result2.length).toBe(1);
    expect(result2[0].title).toBe('Top Coat');
  });

  it('should filter by price range', () => {
    const result = filterProducts(mockProducts, { ...baseState, priceRange: 20000 });
    expect(result.length).toBe(2);
    expect(result.map(p => p.id)).toContain('1');
    expect(result.map(p => p.id)).toContain('3');
  });

  it('should filter by category', () => {
    const result = filterProducts(mockProducts, { ...baseState, selectedCategories: ['cat2'] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');

    const resultMult = filterProducts(mockProducts, { ...baseState, selectedCategories: ['cat1', 'cat2'] });
    expect(resultMult.length).toBe(3);
  });

  it('should filter by brand (using brand field)', () => {
    const result = filterProducts(mockProducts, { ...baseState, selectedBrands: ['OPI'] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter by brand (using tags fallback)', () => {
    // Product 1 has brand 'Lady Nails' in both p.brand.name and tag 'marca:Lady Nails'
    const result = filterProducts(mockProducts, { ...baseState, selectedBrands: ['Lady Nails'] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should match multiple brand selections', () => {
    const result = filterProducts(mockProducts, { ...baseState, selectedBrands: ['Lady Nails', 'OPI'] });
    expect(result.length).toBe(2);
  });

  it('should combine multiple filters correctly', () => {
    const state: FilterState = {
      query: 'polish',
      priceRange: 20000,
      selectedCategories: ['cat1'],
      selectedBrands: ['Lady Nails'],
    };
    const result = filterProducts(mockProducts, state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');

    // Mismatched brand
    const resultNone = filterProducts(mockProducts, { ...state, selectedBrands: ['OPI'] });
    expect(resultNone.length).toBe(0);
  });
});
