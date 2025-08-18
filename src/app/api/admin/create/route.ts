import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields: name, email, password' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user into database
    const result = await query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING admin_no, name, email',
      [name, email, hashedPassword]
    );

    const admin = result.rows[0];
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      admin: {
        admin_no: admin.admin_no,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err: any) {
    console.error('Error creating admin user:', err);
    
    // Handle unique constraint violation (duplicate email)
    if (err.code === '23505') {
      return NextResponse.json({ error: 'Admin user with this email already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}
