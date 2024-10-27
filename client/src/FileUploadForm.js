import React, { useState, useEffect } from 'react';
import { handleFileUploadWeb, selectFileFromDevice, captureImageFromCamera } from './fileUploadUtils';

const FileUploadForm = () => {
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(false);  // State to track whether it's a mobile device

  // Check if the user is on a mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  // Handle file selection from web
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  // Handle file selection from device (mobile gallery)
  const handleDeviceFileSelection = async () => {
    try {
      const fileBlob = await selectFileFromDevice();
      setSelectedFiles([...selectedFiles, fileBlob]);
    } catch (error) {
      setUploadStatus('File selection failed.');
    }
  };

  // Handle image capture from camera (mobile)
  const handleCameraCapture = async () => {
    try {
      const fileBlob = await captureImageFromCamera();
      setSelectedFiles([...selectedFiles, fileBlob]);
    } catch (error) {
      setUploadStatus('Image capture failed.');
    }
  };

  // Remove an image from the list before uploading
  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  // Handle form submission and upload all selected files
  const handleUpload = async () => {
    try {
      if (selectedFiles.length === 0) {
        setUploadStatus('No files to upload.');
        return;
      }

      for (const file of selectedFiles) {
        const additionalData = { caption };
        await handleFileUploadWeb(file, additionalData);
      }

      setUploadStatus('Files uploaded successfully.');
      setSelectedFiles([]);
    } catch (error) {
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <div>
      <h1>Upload Files or Photos</h1>

      {/* Input field for caption */}
      <div>
        <label htmlFor="caption">Caption:</label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      {/* Conditionally render based on device type */}
      {isMobile ? (
        // Mobile-specific buttons
        <div>
          <h2>Mobile Actions</h2>
          <button onClick={handleDeviceFileSelection}>Select from Device</button>
          <button onClick={handleCameraCapture}>Capture with Camera</button>
        </div>
      ) : (
        // Web-specific file input
        <div>
          <label htmlFor="file">Select files (Web):</label>
          <input type="file" multiple id="file" onChange={handleFileChange} />
        </div>
      )}

      {/* Thumbnails Section */}
      <div>
        <h2>Selected Images</h2>
        {selectedFiles.length === 0 ? (
          <p>No images selected. Please choose pictures from your device or take some pictures.</p>
        ) : (
          <ul>
            {selectedFiles.map((file, index) => {
              const fileURL = URL.createObjectURL(file);
              return (
                <li key={index}>
                  <img
                    src={fileURL}
                    alt="selected"
                    style={{ width: '100px', height: '100px', marginRight: '10px' }}
                  />
                  <button onClick={() => handleRemoveImage(index)}>Remove</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Upload Button */}
      <button onClick={handleUpload}>Upload All Files</button>

      {/* Display upload status */}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploadForm;
