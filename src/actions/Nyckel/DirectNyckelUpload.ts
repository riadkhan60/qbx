import axios from 'axios';

const NYCKEL_CLIENT_ID = process.env.NYCKEL_CLIENT_ID;
const NYCKEL_CLIENT_SECRET = process.env.NYCKEL_SECRET_KEY;

// Direct Nyckel API types - Updated to match actual API specification
interface NyckelDirectResponse {
  id: string; // The Id of the created sample (was sampleId)
  data: string; // The input data (URL or data URI)
  externalId?: string; // Your unique identifier for this sample
}

interface NyckelAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface NyckelCredentials {
  clientId: string;
  clientSecret: string;
}

interface DirectUploadOptions {
  file?: File;
  file_url?: string;
  externalId?: string;
}

interface DirectUploadParams extends DirectUploadOptions {
  functionId?: string; // Optional, defaults to the one from your console
}

// Token cache for efficiency (tokens are valid for 1 hour)
interface TokenCache {
  token: string;
  expiresAt: number;
  clientId: string;
}

let tokenCache: TokenCache | null = null;

export class NyckelApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'NyckelApiError';
  }
}

/**
 * Create Nyckel credentials from environment variables
 */
function createNyckelCredentials(): NyckelCredentials {
  if (!NYCKEL_CLIENT_ID || !NYCKEL_CLIENT_SECRET) {
    throw new NyckelApiError(
      'Nyckel credentials not found. Please set NYCKEL_CLIENT_ID and NYCKEL_SECRET_KEY environment variables.',
    );
  }

  return {
    clientId: NYCKEL_CLIENT_ID,
    clientSecret: NYCKEL_CLIENT_SECRET,
  };
}

/**
 * Get JWT token for Nyckel API authentication with caching
 * Tokens are cached for efficiency since they're valid for 1 hour
 */
async function getNyckelToken(): Promise<string> {
  const credentials = createNyckelCredentials();
  const now = Date.now();

  // Check if we have a valid cached token for this client
  if (
    tokenCache &&
    tokenCache.clientId === credentials.clientId &&
    tokenCache.expiresAt > now
  ) {
    console.log('Using cached Nyckel token');
    return tokenCache.token;
  }

  try {
    console.log('Fetching new Nyckel token');
    const response = await axios.post<NyckelAuthResponse>(
      'https://www.nyckel.com/connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // Cache the token with a 5-minute buffer before expiration
    const bufferSeconds = 300; // 5 minutes
    tokenCache = {
      token: response.data.access_token,
      expiresAt: now + (response.data.expires_in - bufferSeconds) * 1000,
      clientId: credentials.clientId,
    };

    console.log(`Token cached, expires in ${response.data.expires_in} seconds`);
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new NyckelApiError(
        `Failed to get Nyckel token: ${
          error.response?.data?.error || error.message
        }`,
        error.response?.status,
        error.response?.data,
      );
    }
    throw new NyckelApiError('Failed to get Nyckel token');
  }
}

/**
 * Clear the token cache (useful for testing or when credentials change)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  console.log('Nyckel token cache cleared');
}

/**
 * Upload image directly to Nyckel API
 * This replaces the EdenAI wrapper with direct Nyckel API calls
 * Updated to match actual Nyckel API specification
 */
export async function nyckelUploadImage({
  functionId = 'h4v4tp4xpe3a05hs', // Your function ID from the console URL
  file,
  file_url,
  externalId,
}: DirectUploadParams): Promise<NyckelDirectResponse> {
  try {
    // Validate input
    if (!file && !file_url) {
      throw new NyckelApiError('Either file or file_url must be provided');
    }
    if (file && file_url) {
      throw new NyckelApiError('Cannot provide both file and file_url');
    }

    // Get authentication token
    const token = await getNyckelToken();

    // Prepare the API endpoint
    const endpoint = `https://www.nyckel.com/v1/functions/${functionId}/samples`;

    let data: FormData | Record<string, unknown>;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (file) {
      // Handle file upload using multipart/form-data
      const formData = new FormData();
      formData.append('data', file); // Use 'data' field name as per API docs

      if (externalId) {
        formData.append('externalId', externalId);
      }

      data = formData;
      // Don't set Content-Type for FormData, let axios handle it
    } else {
      // Handle URL upload using application/json
      data = {
        data: file_url!,
        ...(externalId && { externalId }),
      };

      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post<NyckelDirectResponse>(endpoint, data, {
      headers,
      timeout: 30000, // 30 second timeout
    });

    console.log('Direct Nyckel upload response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      // Handle specific Nyckel API errors
      if (statusCode === 429) {
        throw new NyckelApiError(
          'Rate limit exceeded. Please wait before retrying.',
          statusCode,
          errorData,
        );
      }

      if (statusCode === 401) {
        throw new NyckelApiError(
          'Authentication failed. Please check your credentials.',
          statusCode,
          errorData,
        );
      }

      if (statusCode === 404) {
        throw new NyckelApiError(
          `Function ${functionId} not found. Please check your function ID.`,
          statusCode,
          errorData,
        );
      }

      throw new NyckelApiError(
        `Nyckel API error: ${errorData?.message || error.message}`,
        statusCode,
        errorData,
      );
    }

    if (error instanceof NyckelApiError) {
      throw error;
    }

    throw new NyckelApiError('Unknown error occurred during upload');
  }
}

/**
 * Wrapper function that maintains similar interface to the original EdenAI function
 * This makes it easier to migrate existing code
 */
export async function nyckelUploadImageCompat({
  imageName,
  file,
  file_url,
  functionId,
}: {
  imageName: string;
  file?: File;
  file_url?: string;
  functionId?: string;
}): Promise<{ nyckel: NyckelDirectResponse }> {
  const result = await nyckelUploadImage({
    functionId,
    file,
    file_url,
    externalId: imageName, // Use imageName as externalId for compatibility
  });

  // Return in similar format to EdenAI response for easier migration
  return {
    nyckel: result,
  };
}
