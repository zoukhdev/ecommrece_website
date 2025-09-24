'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { apiService } from '../lib/api';
import { Product, Category } from '../lib/supabase';
import { ShoppingBag, Truck, Shield, Headphones, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  // Slider data
  const slides = [
    {
      id: 1,
      title: t('home.slider.welcome.title'),
      subtitle: t('home.slider.welcome.subtitle'),
      description: t('home.slider.welcome.description'),
      image: &quot;https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&quot;,
      gradient: &quot;from-blue-600 via-purple-600 to-indigo-700&quot;,
      buttonText: t('btn.shop_now'),
      buttonLink: &quot;/products&quot;,
      secondaryButtonText: t('btn.browse_categories'),
      secondaryButtonLink: &quot;/categories&quot;
    },
    {
      id: 2,
      title: t('home.slider.electronics.title'),
      subtitle: t('home.slider.electronics.subtitle'),
      description: t('home.slider.electronics.description'),
      image: &quot;https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop&quot;,
      gradient: &quot;from-green-600 via-teal-600 to-cyan-700&quot;,
      buttonText: t('btn.view_electronics'),
      buttonLink: &quot;/categories/electronics&quot;,
      secondaryButtonText: t('btn.learn_more'),
      secondaryButtonLink: &quot;/about&quot;
    },
    {
      id: 3,
      title: t('home.slider.fashion.title'),
      subtitle: t('home.slider.fashion.subtitle'),
      description: t('home.slider.fashion.description'),
      image: &quot;https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&quot;,
      gradient: &quot;from-pink-600 via-rose-600 to-red-700&quot;,
      buttonText: t('btn.shop_fashion'),
      buttonLink: &quot;/categories/clothing&quot;,
      secondaryButtonText: t('btn.view_collection'),
      secondaryButtonLink: &quot;/products&quot;
    },
    {
      id: 4,
      title: t('home.slider.home.title'),
      subtitle: t('home.slider.home.subtitle'),
      description: t('home.slider.home.description'),
      image: &quot;https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&quot;,
      gradient: &quot;from-orange-600 via-amber-600 to-yellow-700&quot;,
      buttonText: t('btn.shop_home'),
      buttonLink: &quot;/categories/home-kitchen&quot;,
      secondaryButtonText: t('btn.get_inspired'),
      secondaryButtonLink: &quot;/categories&quot;
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        
        if (productsResponse.data) {
          setFeaturedProducts(productsResponse.data.products.slice(0, 8));
        }
        
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Slider */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Slide Container */}
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : index < currentSlide
                  ? 'opacity-0 scale-105 -translate-x-full'
                  : 'opacity-0 scale-95 translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80`}></div>
                <div className="absolute inset-0 bg-black opacity-20"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="text-center text-white">
                    <div className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        {slide.title}
                      </h1>
                    </div>
                    
                    <div className={`transform transition-all duration-1000 delay-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <p className="text-xl md:text-2xl mb-4 text-blue-100 font-medium">
                        {slide.subtitle}
                      </p>
                    </div>
                    
                    <div className={`transform transition-all duration-1000 delay-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-3xl mx-auto">
                        {slide.description}
                      </p>
                    </div>
                    
                    <div className={`transform transition-all duration-1000 delay-900 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          href={slide.buttonLink}
                          className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover-lift shadow-lg"
                        >
                          <ShoppingBag className="inline w-5 h-5 mr-2" />
                          {slide.buttonText}
                        </Link>
                        <Link
                          href={slide.secondaryButtonLink}
                          className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
                        >
                          {slide.secondaryButtonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ 
              width: isAutoPlaying ? '100%' : '0%',
              animation: isAutoPlaying ? 'progress 5s linear infinite' : 'none'
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('features.free_shipping')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('features.free_shipping_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('features.secure_payment')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('features.secure_payment_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('features.support')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('features.support_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('features.easy_returns')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('features.easy_returns_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('categories.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('categories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mb-4"></div>
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-32 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              categories
                .filter(category => category.name !== 'Electronics') // Remove electronics category
                .map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${category.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'})` 
                  }}
                >
                  {/* Dark Transparent Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl text-center group-hover:text-blue-300 transition-colors mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-center text-gray-200 group-hover:text-white transition-colors">
                      {category.description || 'Shop now'}
                    </p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {t('btn.shop_now_arrow')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('featured.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('featured.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton for products
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg"
            >
              {t('btn.view_all_products')}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('newsletter.title')}</h2>
          <p className="text-gray-400 dark:text-gray-500 mb-8">
            {t('newsletter.subtitle')}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
            />
            <button className="bg-blue-600 px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              {t('newsletter.subscribe')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
