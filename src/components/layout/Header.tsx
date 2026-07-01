import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Heart,
  ChevronDown,
  MessageCircle,
  Play,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { CATEGORY_LABELS, type Category } from '../../types';
import { useMousePosition } from '../../hooks/useAnimations';

const categories: Category[] = ['skincare', 'cosmetics', 'ladies', 'gents', 'shoes'];

const categoryImages: Record<Category, string> = {
  skincare: 'https://images.unsplash.com/photo-1620916566486-3c800c8e6b8e?w=300',
  cosmetics: 'https://images.unsplash.com/photo-1512496027998-ft3738e7e0e5?w=300',
  ladies: 'https://images.unsplash.com/photo-1583391733956-6c782764c7a4?w=300',
  gents: 'https://images.unsplash.com/photo-1507003211169-0a65dd86897c?w=300',
  shoes: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300',
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { itemCount, toggleCart } = useCart();
  const { state: authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-dark py-3'
            : 'bg-transparent py-4'
        }`}
        onMouseLeave={() => setActiveCategory(null)}
      >
        {/* Spotlight effect following mouse */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.15), transparent 40%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative">
                <span className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  AG
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-yellow-200/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="hidden lg:flex flex-col leading-none">
                <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Beauty</span>
                <span className="text-[10px] tracking-[0.3em] text-amber-500/80">& Fashion</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  <Link
                    to={`/shop?category=${cat}`}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                      activeCategory === cat
                        ? 'text-amber-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {CATEGORY_LABELS[cat].en}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                      activeCategory === cat ? 'rotate-180' : ''
                    }`} />
                  </Link>
                </div>
              ))}
              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-white/5"
              >
                Our Story
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden md:flex p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User */}
              {authState.isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <Link to="/account" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5">My Account</Link>
                    <Link to="/orders" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5">Orders</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5">Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-black bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full animate-pulse-glow">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mega Menu */}
          {activeCategory && (
            <div className="absolute left-0 right-0 top-full glass-dark border-t border-white/5 opacity-100 visible transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Category Image */}
                <div className="relative col-span-1 overflow-hidden rounded-xl">
                  <img
                    src={categoryImages[activeCategory]}
                    alt={CATEGORY_LABELS[activeCategory].en}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{CATEGORY_LABELS[activeCategory].en}</h3>
                    <p className="text-sm text-gray-300">{CATEGORY_LABELS[activeCategory].ar}</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1 md:col-span-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-amber-500 mb-3">Shop by</h4>
                      <div className="space-y-2">
                        <Link to={`/shop?category=${activeCategory}&featured=true`} className="block text-sm text-gray-400 hover:text-white transition-colors">Featured</Link>
                        <Link to={`/shop?category=${activeCategory}&bestseller=true`} className="block text-sm text-gray-400 hover:text-white transition-colors">Bestsellers</Link>
                        <Link to={`/shop?category=${activeCategory}`} className="block text-sm text-gray-400 hover:text-white transition-colors">All Products</Link>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-amber-500 mb-3">Price Range</h4>
                      <div className="space-y-2">
                        <Link to={`/shop?category=${activeCategory}&min=0&max=100`} className="block text-sm text-gray-400 hover:text-white transition-colors">Under AED 100</Link>
                        <Link to={`/shop?category=${activeCategory}&min=100&max=300`} className="block text-sm text-gray-400 hover:text-white transition-colors">AED 100 - 300</Link>
                        <Link to={`/shop?category=${activeCategory}&min=300&max=1000`} className="block text-sm text-gray-400 hover:text-white transition-colors">Premium</Link>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link
                        to={`/shop?category=${activeCategory}`}
                        className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors group"
                      >
                        Explore Collection
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-start justify-center pt-32 px-4">
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-white">Search</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, trends..."
                className="w-full px-0 py-4 text-2xl md:text-4xl font-light bg-transparent border-0 border-b-2 border-white/20 focus:border-amber-400 focus:ring-0 text-white placeholder-gray-600 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Search className="w-8 h-8" />
              </button>
            </form>

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Trending Searches</h3>
              <div className="flex flex-wrap gap-3">
                {['Gold Serum', 'Oud Perfume', 'Abaya Collection', 'Kandura', 'Summer Sale'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-400 glass-gold rounded-full hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />

          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm glass-dark">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">AG</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:ring-0 transition-colors"
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="px-4 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${cat}`}
                  className="flex items-center justify-between p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <span className="font-medium">{CATEGORY_LABELS[cat].en}</span>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </Link>
              ))}
              <div className="border-t border-white/5 my-4" />
              <Link to="/about" className="block p-4 text-white hover:bg-white/5 rounded-xl transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block p-4 text-white hover:bg-white/5 rounded-xl transition-colors">
                Contact
              </Link>
              <Link to="/track" className="block p-4 text-white hover:bg-white/5 rounded-xl transition-colors">
                Track Order
              </Link>
            </nav>

            {/* Mobile CTAs */}
            <div className="p-4 space-y-3 mt-auto">
              <Link to="/shop" className="block">
                <button className="w-full py-4 text-black font-medium rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 transition-all duration-300">
                  Shop Now
                </button>
              </Link>
              <button
                onClick={() => window.open('https://wa.me/971501234567', '_blank')}
                className="w-full py-4 text-white font-medium rounded-xl glass-gold border border-green-500/30 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
