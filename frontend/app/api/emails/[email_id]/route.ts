import { NextResponse } from 'next/server';

const FLASK_API_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: { email_id: string } }
) {
  try {
    const response = await fetch(
      `${FLASK_API_URL}/view_email_details/${params.email_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch email details',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}