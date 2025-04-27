// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadImageToBothServices } from '@/actions/ImageActions/UploadImage';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const formData = await req.formData();

    // Extract data from FormData
    const name = formData.get('name') as string;
    const productIdentityCode = formData.get('productIdentityCode') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const discount = parseFloat(formData.get('discount') as string) || 0;
    const availability = formData.get('availability') === 'true';
    const productState = (formData.get('productState') as string) || 'in-Stock';
    const deliveryTime = formData.get('deliveryTime') as string;
    const businessId = formData.get('businessId') as string;
    const hasWarranty = formData.get('hasWarranty') === 'true';
    const warrantyTime = formData.get('warrantyTime') as string;
    const variants = JSON.parse((formData.get('variants') as string) || '[]');
    const NkAPiKey = formData.get('NkAPiKey') as string;
    const imgBBApi = formData.get('imgBBApiKey') as string;

    // Get all image files
    const images = formData.getAll('images') as File[];
    const realImages = formData.getAll('realImages') as File[];

    // Validate required fields
    if (!name || !productIdentityCode || !price || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if product with same productIdentityCode already exists
    const existingProduct = await prisma.product.findUnique({
      where: { productIdentityCode },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this identity code already exists' },
        { status: 409 },
      );
    }

    // Process images - using Promise.all to wait for all uploads to complete
    const processedImages = await Promise.all(
      images.map(async (image: File, index: number) => {
        try {
          const response = await uploadImageToBothServices({
            imgbbApiKey: imgBBApi,
            edenaiApiKey: NkAPiKey,
            image: image,
            imageName: `${productIdentityCode}_image_${index}.jpg`,
          });

          console.log('Image upload response:', response);
          return {
            imageName: response.imageName,
            imageLink: response.imgbb.imageUrl,
            deleteHash: response.imgbb.deleteHash,
          };
        } catch (error) {
          console.error('Error uploading image:', error);
          return null;
        }
      }),
    );

    // Filter out any failed uploads
    const validImages = processedImages.filter((img) => img !== null);

    // Process real images
    const processedRealImages = await Promise.all(
      realImages.map(async (image: File, index: number) => {
        try {
          const response = await uploadImageToBothServices({
            imgbbApiKey: imgBBApi,
            edenaiApiKey: NkAPiKey,
            image: image,
            imageName: `${productIdentityCode}_image_${index}.jpg`,
          });
          return {
            imageName: response.imageName,
            imageLink: response.imgbb.imageUrl,
            deleteHash: response.imgbb.deleteHash,
          };
        } catch (error) {
          console.error('Error uploading real image:', error);
          return null;
        }
      }),
    );

    // Filter out any failed uploads
    const validRealImages = processedRealImages.filter((img) => img !== null);

    // Create product with related data
    const product = await prisma.product.create({
      data: {
        name,
        productIdentityCode,
        description,
        shortDescription,
        price: price.toString(),
        discount: discount.toString(),
        availability,
        productState,
        deliveryTime,
        businessId,
        hasWarranty,
        warrantyTime,
        images: {
          createMany: {
            data: validImages, // Type assertion to avoid error
          },
        },
        realImages: {
          createMany: {
            data: validRealImages, // Type assertion to avoid error
          },
        },
        variants: {
          createMany: {
            data: variants.map(
              (variant: { name: string; isAvailable?: boolean }) => ({
                name: variant.name,
                isAvailable: variant.isAvailable ?? true,
              }),
            ),
          },
        },
      },
      include: {
        images: true,
        realImages: true,
        variants: true,
      },
    });

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
