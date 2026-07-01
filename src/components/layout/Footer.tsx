import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Truck,
  Shield,
  RefreshCw,
  HeadphonesIcon,
  ArrowUpRight,
  Sparkles,
  Heart,
} from 'lucide-react';
import { CATEGORY_LABELS, EMIRATES, type Category } from '../../types';

// Custom TikTok icon since lucide doesn't have it
function TikIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52V6.69h-.04z"/>
    </svg>
  );
}

const categories: Category[] = ['skincare', 'cosmetics', 'ladies', 'gents', 'shoes'];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400' },
  { icon: TikIcon, href: 'https://tiktok.com', label: 'TikTok', color: 'hover:bg-white hover:text-black' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-500' },
];

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'Orders over AED 200' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7 days hassle-free' },
  { icon: Shield, title: '100% Authentic', desc: 'Genuine products' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'WhatsApp assistance' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      {/* Features Bar */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 border border-amber-400/20 flex items-center justify-center group-hover:border-amber-400/40 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-4xl font-black tracking-tighter bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                AG
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-xs">
              Premium beauty and fashion destination. Where luxury meets everyday elegance in the heart of UAE.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:border-green-500 hover:text-white transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-500 mb-4">Shop</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {CATEGORY_LABELS[cat].en}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop?bestseller=true" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-500 mb-4">Help</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/track" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  About AG
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-500 mb-4">Policies</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-500 mb-4">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="tel:+971501234567" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +971 50 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="mailto:info@ag.ae" className="text-sm text-gray-400 hover:text-white transition-colors">
                  info@ag.ae
                </a>
              </li>
            </ul>

            {/* Delivery Areas */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-2">We deliver to all Emirates</p>
              <div className="flex flex-wrap gap-1">
                {EMIRATES.slice(0, 4).map((emirate) => (
                  <span key={emirate} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                    {emirate}
                  </span>
                ))}
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">+3 more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="max-w-xl mx-auto text-center">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Join the AG Family</h3>
            <p className="text-sm text-gray-400 mb-6">Exclusive access to new arrivals, offers, and beauty secrets.</p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:ring-0 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} AG Beauty & Fashion. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">Made with</span>
            <Heart className="w-3 h-3 text-red-500 animate-pulse" />
            <span className="text-xs text-gray-500">in Dubai</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-amber-400 transition-colors group"
          >
            Back to top
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
