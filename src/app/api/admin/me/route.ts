import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';

export async function GET() {
  try {
    const adminNo = getAdminFromSession();
    
    if (!adminNo) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      adminNo 
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
