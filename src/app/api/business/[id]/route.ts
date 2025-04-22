// app/api/businesses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET a single business by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        products: true,
        knowledgeBase: true,
        vectorStore: true,
        customers: true,
        orders: true,
        queryCustomers: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ business }, { status: 200 });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 },
    );
  }
}

// PUT - Update a business
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 },
      );
    }

    // If facebookPageId is being updated, check for uniqueness
    if (
      body.facebookPageId &&
      body.facebookPageId !== existingBusiness.facebookPageId
    ) {
      const duplicatePage = await prisma.business.findUnique({
        where: { facebookPageId: body.facebookPageId },
      });

      if (duplicatePage) {
        return NextResponse.json(
          { error: 'A business with this Facebook Page ID already exists' },
          { status: 409 },
        );
      }
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: {
        facebookPageId: body.facebookPageId,
        pageName: body.pageName,
        description: body.description,
        contactInfo: body.contactInfo,
        profilePictureUrl: body.profilePictureUrl,
        prefix: body.prefix,
        website: body.website,
        customerGender: body.customerGender,
        // Don't update accountId as it should remain constant
      },
    });

    return NextResponse.json({ business: updatedBusiness }, { status: 200 });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 },
    );
  }
}

// DELETE - Delete a business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 },
      );
    }

    // Delete the business
    await prisma.business.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Business deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 },
    );
  }
}
