import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, Globe, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const values = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We source only the finest products from trusted global brands and local artisans.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a community of beauty and fashion enthusiasts across the UAE.',
  },
  {
    icon: Globe,
    title: 'Authenticity',
    description: 'Every product is 100% genuine, backed by our authenticity guarantee.',
  },
];

const milestones = [
  { year: '2020', title: 'AG Founded', description: 'Started as a small Instagram shop for skincare products' },
  { year: '2021', title: 'Product Expansion', description: 'Added cosmetics and fashion collections' },
  { year: '2022', title: 'UAE-Wide Delivery', description: 'Expanded delivery to all seven emirates' },
  { year: '2023', title: 'Digital Platform', description: 'Launched our e-commerce website' },
  { year: '2024', title: 'Community Growth', description: 'Over 5,000 happy customers served' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200"
          alt="AG About"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
            <div className="max-w-2xl">
              <span className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-sm font-medium px-4 py-1 rounded mb-4">
                Our Story
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                About AG
              </h1>
              <p className="text-xl text-gray-200">
                Where beauty meets elegance, and fashion finds its home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AG was born from a passion for bringing premium beauty and fashion products to customers across the UAE. What started as a small Instagram shop has grown into a beloved destination for those seeking quality skincare, cosmetics, and elegant fashion.
                </p>
                <p>
                  We believe that everyone deserves access to authentic, high-quality products without compromise. Our carefully curated collection reflects our commitment to excellence, featuring both international luxury brands and exceptional local finds.
                </p>
                <p>
                  Today, AG serves thousands of satisfied customers across all seven emirates, delivering happiness one order at a time.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e3f3c7e6e?w=600"
                alt="AG Products"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl p-6 text-black shadow-lg">
                <p className="text-3xl font-bold">5000+</p>
                <p className="text-sm font-medium">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide the UAE community with access to premium, authentic beauty and fashion products through exceptional service, competitive pricing, and a seamless shopping experience from discovery to delivery.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To become the most trusted destination for premium beauty and fashion in the UAE, known for quality products, outstanding customer care, and a community that celebrates elegance and self-expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-medium tracking-wider">WHAT WE STAND FOR</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-amber-400 text-sm font-medium tracking-wider">MILESTONES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Our Journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700 transform -translate-x-1/2" />

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}>
                <div className="flex-1 hidden md:block" />
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center z-10">
                  <span className="text-black font-bold text-sm">{milestone.year}</span>
                </div>
                <div className="flex-1 md:ml-16 ml-0">
                  <div className={`bg-gray-800 rounded-lg p-6 ${index % 2 === 0 ? 'md:mr-16' : ''}`}>
                    <h3 className="font-semibold mb-1">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Experience AG?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium skincare, cosmetics, and fashion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop">
              <Button variant="gold" size="lg">
                Shop Now
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
