import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

type tParams = Promise<{ slug: string }>;

export async function GET(req: Request, { params }: { params: tParams }) {
  const param = await params;
  const slug = decodeURIComponent(param.slug);

  try {
    const [rows] = await pool.query(
      `SELECT title, type, description, dateTime, text FROM articles WHERE title = ? LIMIT 1`,
      [slug]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
