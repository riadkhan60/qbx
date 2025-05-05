import { NextRequest, NextResponse } from 'next/server';

// API endpoint to extract Facebook post data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, postLink, pageID, openAi } = body;

    // Validate required fields
    if (!accessToken || !postLink || !pageID) {
      return NextResponse.json(
        {
          error:
            'Missing required fields. Please provide accessToken, postLink, and pageID.',
        },
        { status: 400 },
      );
    }

    // Call your Express backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/api/extract-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        postLink,
        pageID,
        openAi,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch post data' },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Facebook post API route:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
