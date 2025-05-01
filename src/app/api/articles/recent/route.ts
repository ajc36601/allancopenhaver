import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = parseInt(searchParams.get('type') || '', 10);
  const limit = parseInt(searchParams.get('limit') || '1', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  if (isNaN(type)) {
    return NextResponse.json({ error: 'Missing or invalid type parameter' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT title, description, dateTime, text, type 
       FROM articles 
       WHERE type = ? AND dateTime <= NOW()
       ORDER BY dateTime DESC 
       LIMIT ? OFFSET ?`,
      [type, limit, offset]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json([], { status: 200 }); // empty array if no results
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
