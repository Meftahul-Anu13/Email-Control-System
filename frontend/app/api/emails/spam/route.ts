import { NextResponse } from 'next/server';

const FLASK_API_URL = 'http://localhost:5000';

export async function PATCH(request: Request) {
  try {
    const response = await fetch(`${FLASK_API_URL}/move_spam`, {
      method: 'POST',
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