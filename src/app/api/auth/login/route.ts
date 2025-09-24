import { NextRequest, NextResponse } from 'next/server';
import { signIn, getUser, getCurrentUser, createUser } from '../../../../lib/supabase';

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
      // Admin users (for admin dashboard)
      { email: 'admin@eshop.com', password: 'admin123', role: 'owner', firstName: 'Admin', lastName: 'User' },
      { email: 'manager@eshop.com', password: 'manager123', role: 'developer', firstName: 'Manager', lastName: 'User' },
      // Customer users (for customer login)
      { email: 'customer@eshop.com', password: 'customer123', role: 'customer', firstName: 'Demo', lastName: 'Customer' },
      { email: 'john@example.com', password: 'john123', role: 'customer', firstName: 'John', lastName: 'Doe' },
      { email: 'jane@example.com', password: 'jane123', role: 'customer', firstName: 'Jane', lastName: 'Smith' }
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
        firstName: userDetails.first_name,
        lastName: userDetails.last_name,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })).toString('base64');
      
      return NextResponse.json({
        user: userDetails,
        token,
        message: 'Login successful (demo mode)'
      });
    }
    
    // Use Supabase authentication for real users
    console.log('Attempting Supabase auth for:', email);
    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error('Supabase auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
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
    
    console.log('Supabase auth successful, data:', data);
    
    // Get user details from Supabase Auth
    const { user: authUser } = await getCurrentUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    // Check if user exists in our users table, if not create a basic user record
    console.log('Checking for user in users table:', authUser.id);
    let userDetails = await getUser(authUser.id);
    console.log('User details from users table:', userDetails);
    
    if (!userDetails) {
      // User doesn't exist in our users table, create a basic record
      console.log('Creating user record for Supabase Auth user:', authUser.id);
      
      // Extract user data from Supabase Auth metadata
      const firstName = authUser.user_metadata?.first_name || 'User';
      const lastName = authUser.user_metadata?.last_name || '';
      const email = authUser.email || '';
      
      // Create user record in our users table
      console.log('Creating user with data:', {
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: 'staff',
        is_active: true,
        password_hash: ''
      });
      
      const newUser = await createUser({
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: 'staff', // Default role for regular users
        is_active: true, // Supabase Auth users are active by default
        password_hash: '' // No password hash needed for Supabase Auth users
      });
      
      console.log('User creation result:', newUser);
      
      if (newUser) {
        userDetails = newUser;
        console.log('User record created successfully');
      } else {
        // If we can't create a user record, still allow login with basic info
        userDetails = {
          id: authUser.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: 'staff',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Using basic user info from Supabase Auth');
      }
    }
    
    // Check if user is active
    console.log('Final user details:', userDetails);
    console.log('User active status:', userDetails.is_active);
    
    if (!userDetails.is_active) {
      console.log('User account is deactivated');
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
