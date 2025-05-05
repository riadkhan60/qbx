async function convertImageLinksToFiles(imageLinks: string[]): Promise<File[]> {
  const filePromises = imageLinks.map(async (url, index) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    // Get content type (e.g., image/jpeg or image/png)
    const mimeType = response.headers.get('Content-Type') || 'image/jpeg';

    // Extract extension from mimeType
    const extension = mimeType.split('/')[1];

    return new File([buffer], `image_${index}.${extension}`, {
      type: mimeType,
    });
  });

  return Promise.all(filePromises);
}

export default convertImageLinksToFiles;
