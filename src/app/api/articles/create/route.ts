import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { pool } from '../../../lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, text, type } = body;

  if (!title || !description || !text || typeof type !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO articles (title, description, text, type, dateTime)
       VALUES (?, ?, ?, ?, NOW())`,
      [title, description, text, type]
    );

    return NextResponse.json({ message: 'Article created successfully', result }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
