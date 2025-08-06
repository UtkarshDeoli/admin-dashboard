import { NextResponse } from 'next/server';
import { query } from '@/lib/db';


export async function GET(request: Request) {
    const queryParam = new URL(request.url).searchParams.get('query');
    console.log('Search query triggered:', queryParam ,{request , url: request.url});
    if (!queryParam) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const result = await query(`
            SELECT 
            *
            FROM addresses
            WHERE line1 ILIKE '%${queryParam}%' 
             OR line2 ILIKE '%${queryParam}%'
             OR line3 ILIKE '%${queryParam}%'
             OR city ILIKE '%${queryParam}%'
             OR state ILIKE '%${queryParam}%'
             OR zip ILIKE '%${queryParam}%'
             OR country ILIKE '%${queryParam}%'
             OR phone1 ILIKE '%${queryParam}%'
             OR phone2 ILIKE '%${queryParam}%'
             OR phone3 ILIKE '%${queryParam}%'
             OR email1 ILIKE '%${queryParam}%'
             OR email2 ILIKE '%${queryParam}%'
             OR website1 ILIKE '%${queryParam}%'
             OR website2 ILIKE '%${queryParam}%'
             OR fax ILIKE '%${queryParam}%'
             ORDER BY address_no
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error searching addresses:', error);
        return NextResponse.json(
            { error: 'Failed to search addresses' },
            { status: 500 }
        );
    }
}
