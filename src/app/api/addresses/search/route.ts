import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
    const queryParam = request.nextUrl.searchParams.get('query');
    console.log('Search query triggered:', queryParam);
    if (!queryParam) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const result = await query(`
            SELECT 
            *
            FROM addresses
            WHERE line1 ILIKE $1
             OR line2 ILIKE $1
             OR line3 ILIKE $1
             OR city ILIKE $1
             OR state ILIKE $1
             OR zip ILIKE $1
             OR country ILIKE $1
             OR phone1 ILIKE $1
             OR phone2 ILIKE $1
             OR phone3 ILIKE $1
             OR email1 ILIKE $1
             OR email2 ILIKE $1
             OR website1 ILIKE $1
             OR website2 ILIKE $1
             OR fax ILIKE $1
             ORDER BY address_no
        `, [`%${queryParam}%`]);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error searching addresses:', error);
        return NextResponse.json(
            { error: 'Failed to search addresses' },
            { status: 500 }
        );
    }
}
