import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the adminNo cookie
    cookies().set('adminNo', '', { 
      httpOnly: true, 
      path: '/', 
      expires: new Date(0) 
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
