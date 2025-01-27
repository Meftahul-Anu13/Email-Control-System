import { NextResponse } from 'next/server';

const FLASK_API_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await fetch(`${FLASK_API_URL}/send_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: data.recipient,
        subject: data.subject,
        content: data.content
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}