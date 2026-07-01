import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  MessageCircle,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  TrendingUp,
  Instagram,
  ExternalLink,
  Heart,
  ShoppingBag,
  Eye,
  X,
  Zap,
  Clock,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Review } from '../types';
import { useCart } from '../store/CartContext';
import { useInView, useTilt, useAnimatedCounter, useMousePosition } from '../hooks/useAnimations';
import { Button } from '../components/ui/Button';

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
            opacity: Math.random() * 0.5 + 0.2,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
        />
      ))}
    </div>
  );
}

// Video Hero Section
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  const slides = [
    {
      title: 'Radiance Redefined',
      subtitle: 'Premium Skincare Collection',
      description: 'Discover the secret to luminous skin with our exclusive Arabian-inspired formulas.',
      video: 'https://cdn.coverr.co/videos/coverr-woman-applying-skincare-products-1280x720.mp4',
      link: '/shop?category=skincare',
      cta: 'Shop Skincare',
    },
    {
      title: 'Elegance in Every Thread',
      subtitle: 'Fashion Collection 2024',
      description: 'Where tradition meets contemporary design. Modest luxury for the modern woman.',
      video: 'https://cdn.coverr.co/videos/coverr-elegant-fashion-woman-walking-1280x720.mp4',
      link: '/shop?category=ladies',
      cta: 'Explore Fashion',
    },
    {
      title: 'Luxury in Every Drop',
      subtitle: 'Signature Fragrances',
      description: 'Artisan perfumes blending the finest Arabian oud with French sophistication.',
      video: 'https://cdn.coverr.co/videos/coverr-luxury-perfume-bottle-1280x720.mp4',
      link: '/shop?category=cosmetics',
      cta: 'Discover Scents',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] overflow-hidden bg-black">
      {/* Video Backgrounds */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[2000ms] ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster={slide.video.replace('.mp4', '-poster.jpg')}
          >
            <source src={slide.video} type="video/mp4" />
          </video>
          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/30" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Floating particles */}
      <FloatingParticles />

      {/* Mouse spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-40"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.15), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`max-w-2xl transition-all duration-1000 ${
                index === currentSlide
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-10 absolute pointer-events-none'
              }`}
            >
              {/* Animated subtitle */}
              <div className={`flex items-center gap-3 mb-6 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-200`}>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-amber-400 to-transparent" />
                <span className="text-sm tracking-[0.3em] text-amber-400 uppercase">{slide.subtitle}</span>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-amber-400 to-transparent" />
              </div>

              {/* Main title */}
              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.9] ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-1000 delay-300`}>
                <span className="block overflow-hidden">
                  <span className={`block ${isLoaded ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-1000 delay-500`}>
                    {slide.title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className={`inline-block mr-[0.3em] ${
                          i === slide.title.split(' ').length - 1 ? 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent' : ''
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </span>
              </h1>

              {/* Description */}
              <p className={`text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-700`}>
                {slide.description}
              </p>

              {/* CTAs */}
              <div className={`flex flex-wrap gap-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-900`}>
                <Link to={slide.link}>
                  <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]">
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>
                <button
                  onClick={() => window.open('https://wa.me/971501234567', '_blank')}
                  className="group px-8 py-4 glass border border-white/10 text-white font-medium rounded-full transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-400/5"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Order on WhatsApp
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-8 md:right-12 z-30 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-3 glass rounded-full text-white/60 hover:text-white hover:border-amber-400/50 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 glass rounded-full text-white/60 hover:text-white hover:border-amber-400/50 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-8 md:left-12 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative h-1 rounded-full overflow-hidden transition-all duration-500"
          >
            <span className={`absolute inset-0 bg-white/30 ${index === currentSlide ? 'opacity-0' : 'opacity-100'}`} />
            <span
              className={`absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 ${
                index === currentSlide ? 'animate-[reveal-horizontal_5s_linear]' : 'opacity-0'
              }`}
              style={{ width: index === currentSlide ? '100%' : '0%' }}
            />
            <span className={`h-1 ${index === currentSlide ? 'w-8' : 'w-2'} transition-all duration-500`} />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// 3D Product Card
function ProductCard3D({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const { ref, transform } = useTilt(8);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickView, setIsQuickView] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950">
            {/* Image */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 opacity-90' : 'scale-100 opacity-100'
              }`}
            />

            {/* Second image on hover */}
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider bg-red-500 text-white rounded-full">
                  -{discount}%
                </span>
              )}
              {product.trending && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Viral
                </span>
              )}
              {product.bestseller && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <button
                onClick={(e) => { e.preventDefault(); setIsQuickView(true); }}
                className="p-2 rounded-full glass hover:bg-amber-400/20 transition-colors"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); }}
                className="p-2 rounded-full glass hover:bg-red-400/20 transition-colors"
              >
                <Heart className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className={`transform transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-2'}`}>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-white/20 text-white/20'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({product.review_count})</span>
                </div>

                <h3 className="font-semibold text-white mb-1 line-clamp-1 transition-colors group-hover:text-amber-400">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">AED {product.price}</span>
                  {product.original_price && (
                    <span className="text-sm text-gray-500 line-through">AED {product.original_price}</span>
                  )}
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem(product, 1);
                }}
                className={`mt-4 w-full py-3 text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {isQuickView && (
        <QuickViewModal product={product} onClose={() => setIsQuickView(false)} />
      )}
    </>
  );
}

// Quick View Modal
function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <div
        className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="aspect-square relative">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-amber-400' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-white/20'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.review_count} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">AED {product.price}</span>
              {product.original_price && (
                <span className="text-lg text-gray-500 line-through">AED {product.original_price}</span>
              )}
            </div>

            <p className="text-gray-400 mb-6">{product.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => { addItem(product, 1); onClose(); }}
                className="flex-1 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="px-6 py-4 glass border border-white/10 text-white font-medium rounded-xl hover:border-amber-400/50 transition-all flex items-center gap-2"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Section Wrapper
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`}
    >
      {children}
    </section>
  );
}

// Stats Counter
function StatItem({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, count } = useAnimatedCounter(value);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-2">{label}</div>
    </div>
  );
}

// Trending on TikTok Section
function TikTokSection() {
  const products = [
    { views: '2.5M', name: 'Glow Serum', image: 'https://images.unsplash.com/photo-1620916566486-3c800c8e6b8e?w=400' },
    { views: '1.8M', name: 'Oud Perfume', image: 'https://images.unsplash.com/photo-1541643600914-78b08468360b?w=400' },
    { views: '980K', name: 'Gold Mask', image: 'https://images.unsplash.com/photo-1596755094514-f87e3f3c7e6e?w=400' },
    { views: '750K', name: 'Premium Abaya', image: 'https://images.unsplash.com/photo-1583391733956-6c782764c7a4?w=400' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <span className="text-sm tracking-widest text-pink-500 uppercase">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Viral on <span className="text-gradient">TikTok</span>
            </h2>
          </div>
          <Link
            to="/shop?trending=true"
            className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products strip */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 -mx-4 px-4">
          {products.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                  <Play className="w-3 h-3 text-white" fill="white" />
                  <span className="text-xs font-bold text-white">{item.views}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-400">See what's trending</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Feed
function InstagramFeed() {
  const posts = [
    'https://images.unsplash.com/photo-1596755094514-f87e3f3c7e6e?w=400',
    'https://images.unsplash.com/photo-1583391733956-6c782764c7a4?w=400',
    'https://images.unsplash.com/photo-1512496027998-ft3738e7e0e5?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a65dd86897c?w=400',
    'https://images.unsplash.com/photo-1566174054880-8c4e6a3a2e7e?w=400',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Instagram className="w-5 h-5 text-amber-400" />
            <span className="text-sm tracking-widest text-amber-400 uppercase">@ag.beauty</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Follow Our <span className="text-gold-gradient">Journey</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden rounded-xl"
            >
              <img
                src={post}
                alt="Instagram post"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonial Carousel
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const reviews = [
    {
      name: 'Sarah Al Maktoum',
      location: 'Dubai',
      rating: 5,
      text: 'The gold serum transformed my skin in just 2 weeks. I\'ve tried everything and nothing compares to AG quality.',
      image: 'SA',
      verified: true,
    },
    {
      name: 'Fatima Hassan',
      location: 'Abu Dhabi',
      rating: 5,
      text: 'Finally a brand that understands luxury. The packaging alone made me feel special. Products exceeded all expectations.',
      image: 'FH',
      verified: true,
    },
    {
      name: 'Mariam Khalid',
      location: 'Sharjah',
      rating: 5,
      text: 'The abaya quality is incredible. Fast delivery and the team was so helpful on WhatsApp. Will order again!',
      image: 'MK',
      verified: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Loved by <span className="text-gold-gradient">Thousands</span>
          </h2>
        </div>

        <div className="relative">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
              }`}
            >
              <div className="glass rounded-3xl p-8 md:p-12 text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-5 h-5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-white/20'}`} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-8">
                  "{review.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg">
                    {review.image}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-sm text-gray-400">{review.location}</div>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <Shield className="w-3 h-3" />
                        Verified Purchase
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Main HomePage Component
export function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, bestsellers] = await Promise.all([
          supabase.from('products').select('*').eq('trending', true).limit(4),
          supabase.from('products').select('*').eq('bestseller', true).limit(8),
        ]);

        setTrendingProducts(trending.data || []);
        setBestsellerProducts(bestsellers.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Stats Bar */}
      <AnimatedSection className="border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value={5000} label="Happy Customers" suffix="+" />
          <StatItem value={250} label="Premium Products" suffix="+" />
          <StatItem value={4.9} label="Average Rating" />
          <StatItem value={7} label="Emirates Covered" />
        </div>
      </AnimatedSection>

      {/* TikTok Trending */}
      <TikTokSection />

      {/* Categories */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm tracking-widest text-amber-400 uppercase">Explore</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Shop by <span className="text-gold-gradient">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Skin Care', key: 'skincare', image: 'https://images.unsplash.com/photo-1620916566486-3c800c8e6b8e?w=500' },
              { name: 'Cosmetics', key: 'cosmetics', image: 'https://images.unsplash.com/photo-1512496027998-ft3738e7e0e5?w=500' },
              { name: 'Ladies', key: 'ladies', image: 'https://images.unsplash.com/photo-1583391733956-6c782764c7a4?w=500' },
              { name: 'Gents', key: 'gents', image: 'https://images.unsplash.com/photo-1507003211169-0a65dd86897c?w=500' },
              { name: 'Shoes', key: 'shoes', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500' },
            ].map((cat, i) => (
              <Link
                key={cat.key}
                to={`/shop?category=${cat.key}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
                  <span className="flex items-center gap-2 text-sm text-amber-400 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Trending Products */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Zap className="w-5 h-5 text-amber-400 mb-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Trending <span className="text-gold-gradient">Now</span>
              </h2>
            </div>
            <Link
              to="/shop?trending=true"
              className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingProducts.map((product, i) => (
                <div key={product.id} style={{ transitionDelay: `${i * 100}ms` }} className="reveal">
                  <ProductCard3D product={product} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* WhatsApp CTA */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-green-600 to-green-700 p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <MessageCircle className="w-12 h-12 text-white mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Order via WhatsApp
                </h2>
                <p className="text-lg text-green-100 mb-6">
                  Prefer a more personal shopping experience? Chat with our team directly for product recommendations and exclusive deals.
                </p>
                <button
                  onClick={() => window.open('https://wa.me/971501234567', '_blank')}
                  className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="glass rounded-2xl p-6 max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">AG Support</p>
                        <p className="text-white">Hi! How can I help you find the perfect product today?</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Online now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Bestsellers */}
      <AnimatedSection className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Award className="w-5 h-5 text-amber-400 mb-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Customer <span className="text-gold-gradient">Favorites</span>
              </h2>
            </div>
            <Link
              to="/shop?bestseller=true"
              className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestsellerProducts.map((product, i) => (
                <ProductCard3D key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* Delivery Banner */}
      <AnimatedSection className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Free Delivery Across UAE</h3>
                  <p className="text-gray-400">On all orders above AED 200</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {['Dubai', 'Abu Dhabi', 'Sharjah', 'All Emirates'].map((city, i) => (
                  <span key={i} className="px-4 py-2 glass text-sm text-gray-300 rounded-full">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter */}
      <AnimatedSection className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the AG Family
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe for exclusive access to new arrivals, special offers, and beauty secrets from our experts.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:ring-0 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
}
