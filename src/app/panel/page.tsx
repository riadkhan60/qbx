// components/ProductCreateForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getBusinesses } from '@/actions/business';
import { useUserStore } from '@/contexts/UserContext/UserContextProvoder';

interface ProductVariant {
  name: string;
  isAvailable: boolean;
}

export default function ProductCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Product details
  const [name, setName] = useState('');
  const [productIdentityCode, setProductIdentityCode] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [availability, setAvailability] = useState(true);
  const [productState, setProductState] = useState('in-Stock');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warrantyTime, setWarrantyTime] = useState('');

  // Images
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedRealImages, setSelectedRealImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [realImagePreviews, setRealImagePreviews] = useState<string[]>([]);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantName, setVariantName] = useState('');

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const realImageInputRef = useRef<HTMLInputElement>(null);

  const accountId = useUserStore((state) => state.accountId);
  const [businessId, setBussinessID] = useState('');
  const [apiKey, setApiKey] = useState([]);
  const [imgBBApi, setImgBBApi] = useState('');


  useEffect(() => {
    async function fetchBusinesses() {
      if (accountId) {
        setLoading(true);
        const businesses = await getBusinesses(accountId);
        setBussinessID(businesses[0].id);
        setApiKey(businesses[0].apiTokenEntry?.eden_ai_api_token);
        setImgBBApi(businesses[0].apiTokenEntry?.imgbb_token);
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [accountId]);
  // Handle image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isRealImage = false,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const fileArray = Array.from(e.target.files);
    const previewArray = fileArray.map((file) => URL.createObjectURL(file));

    if (isRealImage) {
      setSelectedRealImages((prev) => [...prev, ...fileArray]);
      setRealImagePreviews((prev) => [...prev, ...previewArray]);
    } else {
      setSelectedImages((prev) => [...prev, ...fileArray]);
      setImagePreviews((prev) => [...prev, ...previewArray]);
    }
  };

  // Remove image from selection
  const removeImage = (index: number, isRealImage = false) => {
    if (isRealImage) {
      const newImages = [...selectedRealImages];
      const newPreviews = [...realImagePreviews];

      URL.revokeObjectURL(newPreviews[index]);
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      setSelectedRealImages(newImages);
      setRealImagePreviews(newPreviews);
    } else {
      const newImages = [...selectedImages];
      const newPreviews = [...imagePreviews];

      URL.revokeObjectURL(newPreviews[index]);
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      setSelectedImages(newImages);
      setImagePreviews(newPreviews);
    }
  };

  // Add a new variant
  const addVariant = () => {
    if (!variantName.trim()) return;

    setVariants((prev) => [...prev, { name: variantName, isAvailable: true }]);
    setVariantName('');
  };

  // Remove a variant
  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // Toggle variant availability
  const toggleVariantAvailability = (index: number) => {
    const newVariants = [...variants];
    newVariants[index].isAvailable = !newVariants[index].isAvailable;
    setVariants(newVariants);
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!name || !productIdentityCode || !price || !businessId) {
        throw new Error('Please fill in all required fields');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('name', name);
      formData.append('productIdentityCode', productIdentityCode);
      formData.append('description', description);
      formData.append('shortDescription', shortDescription);
      formData.append('price', price);
      formData.append('discount', discount);
      formData.append('availability', String(availability));
      formData.append('productState', productState);
      formData.append('deliveryTime', deliveryTime);
      formData.append('businessId', businessId);
      formData.append('hasWarranty', String(hasWarranty));
      formData.append('warrantyTime', warrantyTime);
      formData.append('variants', JSON.stringify(variants));
      formData.append('NkAPiKey', apiKey.toString());
      formData.append('imgBBApiKey', imgBBApi.toString());

      // Append images
      selectedImages.forEach((image) => {
        formData.append(`images`, image);
      });

      // Append real images
      selectedRealImages.forEach((image) => {
        formData.append(`realImages`, image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setMessage({ type: 'success', text: 'Product created successfully!' });

      // Clear form
      setName('');
      setProductIdentityCode('');
      setDescription('');
      setShortDescription('');
      setPrice('');
      setDiscount('0');
      setAvailability(true);
      setProductState('in-Stock');
      setDeliveryTime('');
      setHasWarranty(false);
      setWarrantyTime('');
      setSelectedImages([]);
      setSelectedRealImages([]);
      setImagePreviews([]);
      setRealImagePreviews([]);
      setVariants([]);

      // Redirect to product list
      setTimeout(() => {
        router.push('/panel');
        router.refresh();
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-6 overflow-auto  rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {message && (
        <div
          className={`p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Identity Code *
            </label>
            <input
              type="text"
              value={productIdentityCode}
              onChange={(e) => setProductIdentityCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>
        </div>

        {/* Pricing and Availability */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pricing & Availability</h2>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Price *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Discount
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="availability"
              checked={availability}
              onChange={() => setAvailability(!availability)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="availability"
              className="ml-2 text-sm text-gray-500"
            >
              Available
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product State
            </label>
            <select
              value={productState}
              onChange={(e) => setProductState(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="in-Stock">In Stock</option>
              <option value="out-of-Stock">Out of Stock</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Delivery Time
            </label>
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 3-5 business days"
            />
          </div>
        </div>
      </div>

      {/* Warranty Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Warranty</h2>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasWarranty"
            checked={hasWarranty}
            onChange={() => setHasWarranty(!hasWarranty)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="hasWarranty" className="ml-2 text-sm text-gray-500">
            Has Warranty
          </label>
        </div>

        {hasWarranty && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Warranty Time
            </label>
            <input
              type="text"
              value={warrantyTime}
              onChange={(e) => setWarrantyTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 1 year"
            />
          </div>
        )}
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product Images</h2>

        {/* Regular Images */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Display Images
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={96}
                  height={96}
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
            >
              +
            </button>
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e) => handleImageChange(e)}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Real Images */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Real Product Images
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {realImagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={preview}
                  alt={`Real Preview ${index}`}
                  width={96}
                  height={96}
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => realImageInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
            >
              +
            </button>
            <input
              type="file"
              ref={realImageInputRef}
              onChange={(e) => handleImageChange(e, true)}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product Variants</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="Variant name (e.g., Red, Large, etc.)"
          />
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Add
          </button>
        </div>

        {variants.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Added Variants</h3>
            <ul className="space-y-2">
              {variants.map((variant, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variant.isAvailable}
                      onChange={() => toggleVariantAvailability(index)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <span>{variant.name}</span>
                    <span
                      className={`ml-3 px-2 py-1 text-xs rounded ${
                        variant.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {variant.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-blue-600 text-white rounded-md ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
