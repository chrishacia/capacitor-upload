import axios from 'axios';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Function to handle file upload from the web
export const handleFileUploadWeb = async (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  // Add any additional data (e.g., captions)
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  try {
    const response = await axios.post('https://xxqx.net/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // Return response for further use (e.g., file URL)
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Function to handle file selection from the device's photo gallery (Capacitor)
export const selectFileFromDevice = async () => {
  try {
    const file = await Camera.getPhoto({
      source: CameraSource.Photos,  // Select from device's photo gallery
      resultType: CameraResultType.Uri,  // Return the file as a URI
    });

    // Convert file URI to Blob for upload
    const response = await fetch(file.webPath);
    const blob = await response.blob();
    return blob;  // Return Blob for further processing
  } catch (error) {
    console.error('File selection failed:', error);
    throw error;
  }
};

// Function to capture an image from the device's camera (Capacitor)
export const captureImageFromCamera = async () => {
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,  // Return file as URI
      source: CameraSource.Camera,       // Capture from camera
      quality: 100,                      // Adjust quality if needed
    });

    // Convert image URI to Blob for upload
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    return blob;  // Return Blob for further processing
  } catch (error) {
    console.error('Image capture failed:', error);
    throw error;
  }
};

// General file upload function (can be used by other functions)
export const uploadFile = async (fileBlob, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', fileBlob);

  // Add any additional data (e.g., captions)
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  try {
    const response = await axios.post('https://xxqx.net/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;  // Return response (e.g., file URL)
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
