import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all businesses (can filter by accountId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const businesses = await prisma.business.findMany({
      where: accountId ? { accountId } : undefined,
      include: {
        products: true,
        knowledgeBase: true,
        apiTokenEntry: true,
        vectorStore: true,
      },
    });

    return NextResponse.json({ businesses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 },
    );
  }
}

// POST - Create a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.facebookPageId || !body.pageName) {
      return NextResponse.json(
        { error: 'Facebook Page ID and Page Name are required' },
        { status: 400 },
      );
    }

    // Check if business with facebookPageId already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { facebookPageId: body.facebookPageId },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'A business with this Facebook Page ID already exists' },
        { status: 409 },
      );
    }

    const business = await prisma.business.create({
      data: {
        facebookPageId: body.facebookPageId,
        pageName: body.pageName,
        accountId: body.accountId, // Using provided accountId
        description: body.description,
        contactInfo: body.contactInfo,
        profilePictureUrl: body.profilePictureUrl,
        prefix: body.prefix,
        website: body.website,
        customerGender: body.customerGender || 'male',
      },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 },
    );
  }
}
