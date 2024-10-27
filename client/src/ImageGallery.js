import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  // Fetch the uploaded images when the component loads
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://xxqx.net/api/images');  // Adjust API endpoint as needed
        setImages(response.data);  // Assuming response is an array of image URLs or paths
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {images.map((image, index) => (
            <div key={index} style={{ padding: '10px' }}>
              <img
                src={image}
                alt={`Uploaded ${index}`}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
