import axios from 'axios';

// Define more specific types for the response
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

interface UploadOptions {
  file?: File;
  file_url?: string;
  settings?: Record<string, unknown>;
  fallback_providers?: string[];
  response_as_dict?: boolean;
  attributes_as_list?: boolean;
  show_base_64?: boolean;
  show_original_response?: boolean;
}

interface UploadParams extends UploadOptions {
  apiKey: string;
  providers?: string[];
  imageName: string;
}

export async function NKuploadImage({
  apiKey,
  providers = ['nyckel'],
  imageName,
  file,
  file_url,
  ...options
}: UploadParams): Promise<EdenAIResponse> {
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

    console.log('EdenAI upload image response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}
