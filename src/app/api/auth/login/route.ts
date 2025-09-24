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
    
    // Use Supabase authentication
    const { data, error } = await signIn(email, password);
    
    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
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
