// Database initialization script for Supabase
// This script helps populate the database with initial data

const { createClient } = require('@supabase/supabase-js');

// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bbtypnulrkkdvvfupxws.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidHlwbnVscmtrZHZ2ZnVweHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDE2NDksImV4cCI6MjA3NDI3NzY0OX0.zAXeNagYcELcs9jlEJxzAfhgAjknhA2ZWv-pkn7hrrM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  console.log('🚀 Initializing database...');

  try {
    // 1. Create categories
    console.log('📁 Creating categories...');
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Sports', description: 'Sports equipment and gear' },
      { name: 'Home & Kitchen', description: 'Home improvement and kitchen items' },
      { name: 'Accessories', description: 'Various accessories and gadgets' }
    ];

    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'name' });
      
      if (error) {
        console.error('Error creating category:', error);
      } else {
        console.log(`✅ Created category: ${category.name}`);
      }
    }

    // 2. Create sample products
    console.log('📦 Creating sample products...');
    const products = [
      {
        name: 'Sony WH-1000XM4 Headphones',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology',
        price: 279.99,
        original_price: 349.99,
        category: 'Electronics',
        brand: 'Sony',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        rating: 4.8,
        reviews: 2847,
        in_stock: true
      },
      {
        name: 'Apple Watch Series 9',
        description: 'The most advanced Apple Watch with health and fitness features',
        price: 399.99,
        original_price: 429.99,
        category: 'Electronics',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        rating: 4.7,
        reviews: 1923,
        in_stock: true
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Latest flagship smartphone with AI-powered features',
        price: 999.99,
        original_price: 1099.99,
        category: 'Electronics',
        brand: 'Samsung',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        rating: 4.6,
        reviews: 2100,
        in_stock: true
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning',
        price: 129.99,
        original_price: 150.00,
        category: 'Sports',
        brand: 'Nike',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        rating: 4.6,
        reviews: 1234,
        in_stock: true
      },
      {
        name: 'MacBook Pro 16-inch',
        description: 'Professional laptop with M3 Pro chip',
        price: 2499.99,
        original_price: 2799.99,
        category: 'Electronics',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        rating: 4.9,
        reviews: 445,
        in_stock: true
      }
    ];

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'name' });
      
      if (error) {
        console.error('Error creating product:', error);
      } else {
        console.log(`✅ Created product: ${product.name}`);
      }
    }

    // 3. Create shipping methods
    console.log('🚚 Creating shipping methods...');
    const shippingMethods = [
      {
        name: 'Standard Shipping',
        type: 'standard',
        cost: 5.00,
        estimated_days: '5-7 business days',
        description: 'Economical shipping option for domestic orders',
        regions: ['US', 'CA'],
        is_active: true
      },
      {
        name: 'Express Shipping',
        type: 'express',
        cost: 15.00,
        estimated_days: '2-3 business days',
        description: 'Faster shipping for urgent domestic deliveries',
        regions: ['US'],
        is_active: true
      },
      {
        name: 'Free Shipping',
        type: 'free',
        cost: 0.00,
        estimated_days: '7-10 business days',
        description: 'Free shipping for orders over $50',
        regions: ['US'],
        is_active: true
      }
    ];

    for (const method of shippingMethods) {
      const { data, error } = await supabase
        .from('shipping_methods')
        .upsert(method, { onConflict: 'name' });
      
      if (error) {
        console.error('Error creating shipping method:', error);
      } else {
        console.log(`✅ Created shipping method: ${method.name}`);
      }
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Run the SQL schema from supabase/schema.sql in your Supabase project');
    console.log('2. Set up your environment variables in Vercel');
    console.log('3. Deploy your application');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase();
