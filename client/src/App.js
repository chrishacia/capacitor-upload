import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import FileUploadForm from './FileUploadForm';
import ImageGallery from './ImageGallery';

const App = () => {
  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Image Upload App</h1>

        {/* Navigation buttons */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/upload">
            <button style={{ marginRight: '10px' }}>Go to File Upload</button>
          </Link>
          <Link to="/gallery">
            <button>View Image Gallery</button>
          </Link>
        </div>

        {/* Define routes */}
        <Routes>
          <Route path="/upload" element={<FileUploadForm />} />
          <Route path="/gallery" element={<ImageGallery />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
