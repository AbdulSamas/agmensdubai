import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { CATEGORY_LABELS } from '../types';

const categories: Category[] = ['skincare', 'cosmetics', 'ladies', 'gents', 'shoes'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestseller', label: 'Bestselling' },
];

const priceRanges = [
  { min: 0, max: 100, label: 'Under AED 100' },
  { min: 100, max: 200, label: 'AED 100 - 200' },
  { min: 200, max: 500, label: 'AED 200 - 500' },
  { min: 500, max: 1000, label: 'AED 500 - 1000' },
  { min: 1000, max: Infinity, label: 'Above AED 1000' },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCategory = searchParams.get('category') as Category | null;
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const currentPriceMin = searchParams.get('min');
  const currentPriceMax = searchParams.get('max');
  const isFeatured = searchParams.get('featured') === 'true';
  const isTrending = searchParams.get('trending') === 'true';
  const isBestseller = searchParams.get('bestseller') === 'true';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (currentCategory && categories.includes(currentCategory)) {
          query = query.eq('category', currentCategory);
        }

        if (currentSearch) {
          query = query.or(`name.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`);
        }

        if (currentPriceMin) {
          query = query.gte('price', parseFloat(currentPriceMin));
        }

        if (currentPriceMax) {
          query = query.lte('price', parseFloat(currentPriceMax));
        }

        if (isFeatured) {
          query = query.eq('featured', true);
        }

        if (isTrending) {
          query = query.eq('trending', true);
        }

        if (isBestseller) {
          query = query.eq('bestseller', true);
        }

        switch (currentSort) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'bestseller':
            query = query.order('review_count', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query.limit(50);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSort, currentSearch, currentPriceMin, currentPriceMax, isFeatured, isTrending, isBestseller]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory) count++;
    if (currentSearch) count++;
    if (currentPriceMin || currentPriceMax) count++;
    if (isFeatured || isTrending || isBestseller) count++;
    return count;
  }, [currentCategory, currentSearch, currentPriceMin, currentPriceMax, isFeatured, isTrending, isBestseller]);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const handlePriceRange = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('min', min.toString());
    params.set('max', max.toString());
    setSearchParams(params);
  };

  const getPageTitle = () => {
    if (currentCategory) return CATEGORY_LABELS[currentCategory]?.en || 'Shop';
    if (isTrending) return 'Trending Products';
    if (isBestseller) return 'Best Sellers';
    if (isFeatured) return 'Featured Products';
    if (currentSearch) return `Search: "${currentSearch}"`;
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={currentSearch}
                onChange={(e) => updateFilters('search', e.target.value || null)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            <Button
              variant={activeFiltersCount > 0 ? 'gold' : 'outline'}
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilters('category', currentCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        currentCategory === cat
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {CATEGORY_LABELS[cat].en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => handlePriceRange(range.min, range.max)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        currentPriceMin === range.min.toString() && currentPriceMax === range.max.toString()
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quick Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('trending', isTrending ? 'false' : 'true');
                      setSearchParams(params);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isTrending
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('bestseller', isBestseller ? 'false' : 'true');
                      setSearchParams(params);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isBestseller
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bestseller
                  </button>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('featured', isFeatured ? 'false' : 'true');
                      setSearchParams(params);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isFeatured
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Featured
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={currentSort}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full">
                {CATEGORY_LABELS[currentCategory].en}
                <button onClick={() => updateFilters('category', null)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                "{currentSearch}"
                <button onClick={() => updateFilters('search', null)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentPriceMin && currentPriceMax && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                AED {currentPriceMin} - {currentPriceMax !== 'Infinity' ? `AED ${currentPriceMax}` : '+'}
                <button onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('min');
                  params.delete('max');
                  setSearchParams(params);
                }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <Button variant="primary" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
