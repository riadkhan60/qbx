import axios from 'axios';
import {
  nyckelUploadImage,
  NyckelApiError,
} from '../Nyckel/DirectNyckelUpload';

// ImgBB Response Interfaces
interface ImgBBUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    delete_url: string;
    medium?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
  };
  success: boolean;
  status: number;
}

// Updated Nyckel Response Interface for direct API
interface NyckelDirectResponse {
  id: string;
  data: string;
  externalId?: string;
}

// Upload Options Interfaces
interface NyckelUploadOptions {
  file?: File;
  file_url?: string;
  functionId?: string;
  externalId?: string;
}

interface ImgBBUploadOptions {
  name?: string;
  expiration?: number;
}

interface CombinedUploadResult {
  imageName: string;
  imgbb: {
    success: boolean;
    imageUrl: string;
    deleteHash: string;
    thumbnailUrl?: string;
  };
  nyckel: {
    success: boolean;
    id?: string;
    externalId?: string;
  };
}

interface CombinedUploadParams {
  imgbbApiKey: string;
  nyckelFunctionId: string;
  image: File | Blob;
  imageName: string;
  imgbbOptions?: ImgBBUploadOptions;
  nyckelOptions?: Omit<NyckelUploadOptions, 'file' | 'file_url'>;
}

// Rate limiting configuration
interface RateLimitConfig {
  maxConcurrent: number;
  delayBetweenRequests: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
}

// Default rate limiting settings
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxConcurrent: 4,
  delayBetweenRequests: 3000, // 1 second between requests
  maxRetries: 5,
  retryDelay: 5000, // 2 seconds before retry
};

/**
 * Helper function to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Upload an image to ImgBB service
 */
async function uploadToImgBB(
  apiKey: string,
  image: File | Blob,
  options?: ImgBBUploadOptions,
  retryCount = 0,
  maxRetries = DEFAULT_RATE_LIMIT.maxRetries,
): Promise<ImgBBUploadResponse> {
  if (!apiKey) {
    throw new Error('ImgBB API key is required');
  }

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', image);

  // Add optional parameters
  if (options?.name) {
    formData.append('name', options.name);
  }

  if (options?.expiration) {
    formData.append('expiration', options.expiration.toString());
  }

  try {
    const response = await axios.post<ImgBBUploadResponse>(
      'https://api.imgbb.com/1/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);

    // Implement retry mechanism
    if (retryCount < maxRetries) {
      console.log(`Retrying ImgBB upload (${retryCount + 1}/${maxRetries})...`);
      await delay(DEFAULT_RATE_LIMIT.retryDelay * (retryCount + 1));
      return uploadToImgBB(apiKey, image, options, retryCount + 1, maxRetries);
    }

    throw error;
  }
}

/**
 * Upload an image to Nyckel using direct API (replacing EdenAI wrapper)
 */
async function uploadToNyckel({
  imageName,
  file,
  file_url,
  functionId,
  retryConfig = DEFAULT_RATE_LIMIT,
  retryCount = 0,
}: {
  imageName: string;
  file?: File;
  file_url?: string;
  functionId?: string;
  retryConfig?: RateLimitConfig;
  retryCount?: number;
}): Promise<{ nyckel: NyckelDirectResponse }> {
  try {
    if (!file && !file_url) {
      throw new Error('Either file or file_url must be provided');
    }
    if (file && file_url) {
      throw new Error('Cannot provide both file and file_url');
    }

    console.log(`Uploading to Nyckel (direct API): ${imageName}`);

    const result = await nyckelUploadImage({
      file,
      file_url,
      externalId: imageName,
      functionId,
    });

    console.log('Direct Nyckel upload successful:', result.id);

    // Return in similar format to maintain compatibility with existing code
    return {
      nyckel: result,
    };
  } catch (error) {
    // Handle Nyckel-specific errors
    if (error instanceof NyckelApiError) {
      console.error('Nyckel API Error:', error.message, error.statusCode);

      // Handle rate limiting with retry logic
      if (error.statusCode === 429 && retryCount < retryConfig.maxRetries) {
        const waitTime = retryConfig.retryDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(
          `Rate limit hit. Waiting ${waitTime}ms before retry ${
            retryCount + 1
          }/${retryConfig.maxRetries}`,
        );
        await delay(waitTime);
        return uploadToNyckel({
          imageName,
          file,
          file_url,
          functionId,
          retryConfig,
          retryCount: retryCount + 1,
        });
      }

      // Handle authentication errors
      if (error.statusCode === 401) {
        console.error(
          'Authentication failed. Check NYCKEL_CLIENT_ID and NYCKEL_SECRET_KEY environment variables.',
        );
      }

      // Handle function not found errors
      if (error.statusCode === 404) {
        console.error('Function not found. Check your function ID.');
      }
    }

    if (error instanceof Error) {
      console.error('Nyckel upload error:', error.message);
    }
    throw error;
  }
}

/**
 * Extract the delete hash from an ImgBB delete URL
 */
function extractDeleteHash(deleteUrl: string): string {
  const parts = deleteUrl.split('/');
  return parts[parts.length - 1];
}

/**
 * Queue for managing concurrent uploads
 */
class UploadQueue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private results: any[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
    this.config = config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(task: () => Promise<any>): void {
    this.queue.push(task);
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.running >= this.config.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift()!;

    try {
      const result = await task();
      this.results.push(result);
    } catch (error) {
      console.error('Task failed:', error);
    } finally {
      this.running--;
      // Add a delay between requests to avoid rate limiting
      await delay(this.config.delayBetweenRequests);
      this.processNext();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async waitForAll(): Promise<any[]> {
    // If there are tasks running or in queue, wait
    while (this.running > 0 || this.queue.length > 0) {
      await delay(100);
    }
    return this.results;
  }
}

/**
 * Upload a single image to both ImgBB and Nyckel services
 */
export async function uploadImageToBothServices({
  imgbbApiKey,
  nyckelFunctionId,
  image,
  imageName,
  imgbbOptions = {},
  nyckelOptions = {},
}: CombinedUploadParams): Promise<CombinedUploadResult> {
  try {
    // Ensure imageName is set in ImgBB options
    const imgbbUploadOptions: ImgBBUploadOptions = {
      ...imgbbOptions,
      name: imageName,
    };

    // Step 1: Upload to ImgBB
    console.log(`Uploading image "${imageName}" to ImgBB...`);
    const imgbbResponse = await uploadToImgBB(
      imgbbApiKey,
      image,
      imgbbUploadOptions,
    );

    if (!imgbbResponse.success) {
      throw new Error('ImgBB upload failed');
    }

    const deleteHash = extractDeleteHash(imgbbResponse.data.delete_url);
    console.log(`Successfully uploaded to ImgBB. Delete hash: ${deleteHash}`);

    // Step 2: Upload to Nyckel (after successful ImgBB upload)
    console.log(`Uploading image "${imageName}" to Nyckel...`);
    let nyckelResponse: { nyckel: NyckelDirectResponse };
    try {
      nyckelResponse = await uploadToNyckel({
        imageName,
        file: image instanceof File ? image : new File([image], imageName),
        ...nyckelOptions,
        functionId: nyckelFunctionId,
      });
      console.log('Successfully uploaded to Nyckel');
    } catch (nyckelError) {
      console.error('Error uploading to Nyckel:', nyckelError);
      // Return partial success even if Nyckel upload fails
      return {
        imageName,
        imgbb: {
          success: true,
          imageUrl: imgbbResponse.data.url,
          deleteHash,
          thumbnailUrl: imgbbResponse.data.thumb?.url,
        },
        nyckel: {
          success: false,
        },
      };
    }

    // Return combined result
    return {
      imageName,
      imgbb: {
        success: true,
        imageUrl: imgbbResponse.data.url,
        deleteHash,
        thumbnailUrl: imgbbResponse.data.thumb?.url,
      },
      nyckel: {
        success: true,
        id: nyckelResponse.nyckel?.id,
        externalId: nyckelResponse.nyckel?.externalId,
      },
    };
  } catch (error) {
    console.error('Combined upload failed:', error);
    throw error;
  }
}

/**
 * Batch upload multiple images with rate limiting
 */
export async function batchUploadImages(
  images: Array<{ image: File | Blob; name: string }>,
  imgbbApiKey: string,
  edenaiApiKey: string,
  nyckelFunctionId: string,
  rateLimitConfig: RateLimitConfig = DEFAULT_RATE_LIMIT,
): Promise<CombinedUploadResult[]> {
  const queue = new UploadQueue(rateLimitConfig);

  // Add all uploads to the queue
  for (const { image, name } of images) {
    queue.add(() =>
      uploadImageToBothServices({
        imgbbApiKey,
        image,
        imageName: name,
        nyckelFunctionId,
      }),
    );
  }

  // Wait for all uploads to complete
  return queue.waitForAll();
}
