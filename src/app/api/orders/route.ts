import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    
    let orders = await DatabaseService.getOrders();
    
    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    // Filter by customer if provided
    if (customerId) {
      orders = orders.filter(order => order.customerId === customerId);
    }
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerId || !body.items || !body.shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, items, shippingAddress' },
        { status: 400 }
      );
    }
    
    // Calculate total
    const total = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);
    
    const order = await DatabaseService.createOrder({
      customerId: body.customerId,
      items: body.items,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: body.shippingAddress,
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    });
    
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
