import { NextRequest, NextResponse } from 'next/server';
import { signIn, getUser, getCurrentUser } from '../../../../lib/supabase';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check for demo credentials first (for development/testing)
    const demoUsers = [
      { email: 'admin@eshop.com', password: 'admin123', role: 'owner', firstName: 'Admin', lastName: 'User' },
      { email: 'manager@eshop.com', password: 'manager123', role: 'developer', firstName: 'Manager', lastName: 'User' }
    ];
    
    const demoUser = demoUsers.find(user => user.email === email && user.password === password);
    
    if (demoUser) {
      // Create demo user data
      const userDetails = {
        id: 'demo-' + Date.now(),
        email: demoUser.email,
        first_name: demoUser.firstName,
        last_name: demoUser.lastName,
        role: demoUser.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Create a session token
      const token = Buffer.from(JSON.stringify({
        userId: userDetails.id,
        email: userDetails.email,
        role: userDetails.role,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })).toString('base64');
      
      return NextResponse.json({
        user: userDetails,
        token,
        message: 'Login successful (demo mode)'
      });
    }
    
    // Use Supabase authentication for real users
    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error('Supabase auth error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      } else if (error.message?.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please check your email and click the verification link before signing in' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: `Login failed: ${error.message}` },
          { status: 401 }
        );
      }
    }
    
    // Get user details from our users table
    const { user: authUser } = await getCurrentUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    // Get additional user details from our users table
    const userDetails = await getUser(authUser.id);
    
    if (!userDetails || !userDetails.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Create a session token (in production, you might want to use proper JWT)
    const token = Buffer.from(JSON.stringify({
      userId: userDetails.id,
      email: userDetails.email,
      role: userDetails.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64');
    
    return NextResponse.json({
      user: userDetails,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
