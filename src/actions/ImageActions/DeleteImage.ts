import axios from 'axios';

// Response interfaces
interface ImgBBDeleteResponse {
  success: boolean;
  status: number;
  message?: string;
}

interface NyckelDeleteResponse {
  nyckel?: {
    status: string;
    original_response?: unknown;
    usage: null | unknown;
    cost?: number;
  };
  [key: string]: unknown;
}

interface CombinedDeleteResult {
  imageName: string;
  imgbb: {
    success: boolean;
    message?: string;
  };
  nyckel: {
    success: boolean;
    message?: string;
  };
}

/**
 * Delete options for Nyckel
 */
interface NyckelDeleteOptions {
  response_as_dict?: boolean;
  attributes_as_list?: boolean;
  show_base_64?: boolean;
  show_original_response?: boolean;
  fallback_providers?: string[];
  settings?: Record<string, unknown>;
}

/**
 * Parameters for deleting an image from both services
 */
interface DeleteImageParams {
  imgbbApiKey: string;
  edenaiApiKey: string;
  imageName: string;
  imgbbDeleteHash: string;
  nyckelOptions?: NyckelDeleteOptions;
  nyckelProviders?: string[];
}

/**
 * Deletes an image from ImgBB using its delete hash
 * @param apiKey - Your ImgBB API key
 * @param deleteHash - The delete hash of the image
 * @returns A promise that resolves to the ImgBB API response
 */
async function deleteFromImgBB(
  apiKey: string,
  deleteHash: string,
): Promise<ImgBBDeleteResponse> {
  if (!apiKey) {
    throw new Error('ImgBB API key is required');
  }

  if (!deleteHash) {
    throw new Error('Delete hash is required');
  }

  try {
    const response = await axios.delete<ImgBBDeleteResponse>(
      `https://api.imgbb.com/1/image/${deleteHash}?key=${apiKey}`,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error deleting from ImgBB:', error.response.data);
      return {
        success: false,
        status: error.response.status,
        message: error.message,
      };
    }
    console.error('Error deleting from ImgBB:', error);
    throw error;
  }
}

/**
 * Deletes an image from Nyckel via EdenAI
 * @param apiKey - Your EdenAI API key
 * @param imageName - The name of the image to delete
 * @param options - Additional options for the delete request
 * @param providers - The providers to use (default: ['nyckel'])
 * @returns A promise that resolves to the Nyckel delete response
 */
async function deleteFromNyckel(
  apiKey: string,
  imageName: string,
  options: NyckelDeleteOptions = {},
  providers: string[] = ['nyckel'],
): Promise<NyckelDeleteResponse> {
  if (!apiKey) {
    throw new Error('EdenAI API key is required');
  }

  if (!imageName) {
    throw new Error('Image name is required');
  }

  try {
    const requestData = {
      providers,
      image_name: imageName,
      response_as_dict: options.response_as_dict ?? true,
      attributes_as_list: options.attributes_as_list ?? false,
      show_base_64: options.show_base_64 ?? true,
      show_original_response: options.show_original_response ?? false,
      ...(options.settings && { settings: options.settings }),
      ...(options.fallback_providers && {
        fallback_providers: options.fallback_providers,
      }),
    };

    const response = await axios.post<NyckelDeleteResponse>(
      'https://api.edenai.run/v2/image/search/delete_image/',
      requestData,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error deleting from Nyckel:', error.response.data);
      return {
        nyckel: {
          status: 'error',
          usage: null,
          cost: 0,
        },
      };
    }
    console.error('Error deleting from Nyckel:', error);
    throw error;
  }
}

/**
 * Deletes an image from both ImgBB and Nyckel services
 * @param params - Parameters for the delete operation
 * @returns A promise that resolves to the combined delete result
 */
export async function deleteImageFromBothServices({
  imgbbApiKey,
  edenaiApiKey,
  imageName,
  imgbbDeleteHash,
  nyckelOptions = {},
  nyckelProviders = ['nyckel'],
}: DeleteImageParams): Promise<CombinedDeleteResult> {
  // Results will be populated as operations complete
  const result: CombinedDeleteResult = {
    imageName,
    imgbb: {
      success: false,
    },
    nyckel: {
      success: false,
    },
  };

  // Delete from ImgBB
  try {
    console.log(
      `Deleting image "${imageName}" from ImgBB with delete hash: ${imgbbDeleteHash}`,
    );
    const imgbbResponse = await deleteFromImgBB(imgbbApiKey, imgbbDeleteHash);
    result.imgbb = {
      success: imgbbResponse.success,
      message: imgbbResponse.message,
    };
    console.log(
      `ImgBB delete result: ${imgbbResponse.success ? 'Success' : 'Failed'}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      result.imgbb.message = error.message;
    }
    console.error('Failed to delete from ImgBB:', error);
  }

  // Delete from Nyckel
  try {
    console.log(`Deleting image "${imageName}" from Nyckel`);
    const nyckelResponse = await deleteFromNyckel(
      edenaiApiKey,
      imageName,
      nyckelOptions,
      nyckelProviders,
    );

    const isNyckelSuccess = nyckelResponse.nyckel?.status === 'success';
    result.nyckel = {
      success: isNyckelSuccess,
      message: isNyckelSuccess ? 'Successfully deleted' : 'Failed to delete',
    };
    console.log(
      `Nyckel delete result: ${isNyckelSuccess ? 'Success' : 'Failed'}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      result.nyckel.message = error.message;
    }
    console.error('Failed to delete from Nyckel:', error);
  }

  return result;
}
