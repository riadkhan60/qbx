import axios from 'axios';
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

interface NyckelResponse {
  status: string;
  original_response: {
    id: string;
    data: string;
    externalId: string;
  };
  usage: null | unknown;
  cost: number;
}

interface EdenAIResponse {
  nyckel: NyckelResponse;
  [key: string]: unknown;
}

// Upload Options Interfaces
interface NyckelUploadOptions {
  file?: File;
  file_url?: string;
  settings?: Record<string, unknown>;
  fallback_providers?: string[];
  response_as_dict?: boolean;
  attributes_as_list?: boolean;
  show_base_64?: boolean;
  show_original_response?: boolean;
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
  edenaiApiKey: string;
  image: File | Blob;
  imageName: string;
  imgbbOptions?: ImgBBUploadOptions;
  nyckelOptions?: Omit<NyckelUploadOptions, 'file' | 'file_url'>;
  nyckelProviders?: string[];
}

async function uploadToImgBB(
  apiKey: string,
  image: File | Blob,
  options?: ImgBBUploadOptions,
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
    throw error;
  }
}

async function uploadToNyckel({
  apiKey,
  providers = ['nyckel'],
  imageName,
  file,
  file_url,
  ...options
}: {
  apiKey: string;
  providers?: string[];
  imageName: string;
  file?: File;
  file_url?: string;
} & NyckelUploadOptions): Promise<EdenAIResponse> {
  try {
    if (!file && !file_url) {
      throw new Error('Either file or file_url must be provided');
    }
    if (file && file_url) {
      throw new Error('Cannot provide both file and file_url');
    }

    const commonParams: Record<string, unknown> = {
      providers: providers.join(','),
      image_name: imageName,
      response_as_dict: options.response_as_dict ?? true,
      attributes_as_list: options.attributes_as_list ?? false,
      show_base_64: options.show_base_64 ?? true,
      show_original_response: options.show_original_response ?? true,
    };

    if (options.settings) {
      commonParams.settings = JSON.stringify(options.settings);
    }
    if (options.fallback_providers) {
      commonParams.fallback_providers = options.fallback_providers.join(',');
    }

    let data: FormData | Record<string, unknown>;
    let headers: Record<string, string>;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      Object.entries(commonParams).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      data = formData;

      headers = {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      };
    } else {
      data = {
        ...commonParams,
        file_url: file_url!,
      };

      headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      };
    }

    const response = await axios.post<EdenAIResponse>(
      'https://api.edenai.run/v2/image/search/upload_image',
      data,
      { headers },
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

function extractDeleteHash(deleteUrl: string): string {
  const parts = deleteUrl.split('/');
  return parts[parts.length - 1];
}

export async function uploadImageToBothServices({
  imgbbApiKey,
  edenaiApiKey,
  image,
  imageName,
  imgbbOptions = {},
  nyckelOptions = {},
  nyckelProviders = ['nyckel'],
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
    let nyckelResponse: EdenAIResponse;
    try {
      nyckelResponse = await uploadToNyckel({
        apiKey: edenaiApiKey,
        providers: nyckelProviders,
        imageName: imageName,
        file: image instanceof File ? image : new File([image], imageName),
        ...nyckelOptions,
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
        id: nyckelResponse.nyckel?.original_response?.id,
        externalId: nyckelResponse.nyckel?.original_response?.externalId,
      },
    };
  } catch (error) {
    console.error('Combined upload failed:', error);
    throw error;
  }
}
