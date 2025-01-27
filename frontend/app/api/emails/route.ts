import { NextResponse } from 'next/server';

const FLASK_API_URL = 'http://localhost:5000'; // Update with your Flask backend URL

// GET /api/emails/read
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

// POST /api/emails/send
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

// PUT /api/emails/reply
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const response = await fetch(`${FLASK_API_URL}/reply_email`, {
      method: 'POST', // Note: Flask endpoint uses POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_id: data.email_id,
        content: data.content
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send reply',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/emails/spam
export async function PATCH(request: Request) {
  try {
    const response = await fetch(`${FLASK_API_URL}/move_spam`, {
      method: 'POST', // Note: Flask endpoint uses POST
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to move emails from spam',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/emails/[email_id]
export async function generateStaticParams() {
  return [];
}

export async function GET_DETAIL(
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