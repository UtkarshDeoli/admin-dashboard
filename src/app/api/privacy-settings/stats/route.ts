import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get overall statistics
    const totalResult = await query('SELECT COUNT(*) as total FROM privacy_settings');
    const onlinePrivateResult = await query('SELECT COUNT(*) as count FROM privacy_settings WHERE is_private_online = true');
    const publicationPrivateResult = await query('SELECT COUNT(*) as count FROM privacy_settings WHERE is_private_publication = true');
    const fullyPrivateResult = await query('SELECT COUNT(*) as count FROM privacy_settings WHERE is_private_online = true AND is_private_publication = true');
    const fullyPublicResult = await query('SELECT COUNT(*) as count FROM privacy_settings WHERE is_private_online = false AND is_private_publication = false');

    // Get breakdown by entity type
    const entityTypeBreakdownResult = await query(`
      SELECT 
        entity_type,
        COUNT(*) as total,
        COUNT(CASE WHEN is_private_online = true THEN 1 END) as online_private,
        COUNT(CASE WHEN is_private_publication = true THEN 1 END) as publication_private,
        COUNT(CASE WHEN is_private_online = true AND is_private_publication = true THEN 1 END) as fully_private,
        COUNT(CASE WHEN is_private_online = false AND is_private_publication = false THEN 1 END) as fully_public
      FROM privacy_settings 
      GROUP BY entity_type 
      ORDER BY entity_type
    `);

    // Get breakdown by field name
    const fieldBreakdownResult = await query(`
      SELECT 
        field_name,
        COUNT(*) as total,
        COUNT(CASE WHEN is_private_online = true THEN 1 END) as online_private,
        COUNT(CASE WHEN is_private_publication = true THEN 1 END) as publication_private,
        COUNT(CASE WHEN is_private_online = true AND is_private_publication = true THEN 1 END) as fully_private
      FROM privacy_settings 
      GROUP BY field_name 
      ORDER BY total DESC, field_name
      LIMIT 20
    `);

    // Get most common privacy patterns
    const patternsResult = await query(`
      SELECT 
        is_private_online,
        is_private_publication,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM privacy_settings)), 2) as percentage
      FROM privacy_settings 
      GROUP BY is_private_online, is_private_publication 
      ORDER BY count DESC
    `);

    const stats = {
      overview: {
        total: parseInt(totalResult.rows[0].total),
        online_private: parseInt(onlinePrivateResult.rows[0].count),
        publication_private: parseInt(publicationPrivateResult.rows[0].count),
        fully_private: parseInt(fullyPrivateResult.rows[0].count),
        fully_public: parseInt(fullyPublicResult.rows[0].count)
      },
      by_entity_type: entityTypeBreakdownResult.rows.map(row => ({
        entity_type: row.entity_type,
        total: parseInt(row.total),
        online_private: parseInt(row.online_private),
        publication_private: parseInt(row.publication_private),
        fully_private: parseInt(row.fully_private),
        fully_public: parseInt(row.fully_public)
      })),
      by_field: fieldBreakdownResult.rows.map(row => ({
        field_name: row.field_name,
        total: parseInt(row.total),
        online_private: parseInt(row.online_private),
        publication_private: parseInt(row.publication_private),
        fully_private: parseInt(row.fully_private)
      })),
      patterns: patternsResult.rows.map(row => ({
        is_private_online: row.is_private_online,
        is_private_publication: row.is_private_publication,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage)
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching privacy settings statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy settings statistics' },
      { status: 500 }
    );
  }
}
