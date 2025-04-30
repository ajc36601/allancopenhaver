import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT title, type, description, dateTime, text
      FROM articles
      ORDER BY dateTime DESC
      LIMIT 3
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('❌ Error fetching recent articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}