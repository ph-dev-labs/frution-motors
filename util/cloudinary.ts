import axios from "axios";

// Types for better type safety
interface CloudinaryResponse {
  secure_url: string;
  // Add other response fields as needed
}

interface CloudinaryError {
  message: string;
  // Add other error fields as needed
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Validate environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  console.log(uploadPreset, "dsghhdsfghfsdgf")

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing required Cloudinary configuration');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    const cloudinaryError = error as CloudinaryError;
    console.error('Error uploading to Cloudinary:', cloudinaryError);
    throw new Error('Failed to upload image to Cloudinary');
  }
};