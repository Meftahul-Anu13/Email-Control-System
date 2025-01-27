import { NextResponse } from 'next/server';

const FLASK_API_URL = 'http://localhost:5000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'INBOX';
  const limit = searchParams.get('limit') || '10';

  try {
    const response = await fetch(
      `${FLASK_API_URL}/read_emails?folder=${folder}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}