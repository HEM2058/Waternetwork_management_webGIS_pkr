import React, { useState } from 'react';
import axios from 'axios';
import './shp_geojson.css'; // Import the CSS file directly

const LayerUploadForm = () => {
  const [layerName, setLayerName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNameChange = (e) => {
    setLayerName(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!layerName || !selectedFile) {
      setErrorMessage('Both name and file are required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', layerName);
    formData.append('zip_file', selectedFile);
    console.log(formData)
    axios
      .post('http://127.0.0.1:8000/uploadgeojson/', formData)
      .then((response) => {
        console.log('Data uploaded successfully:', response.data);
        // Handle the response data as needed
      })
      .catch((error) => {
        setErrorMessage('Error uploading data: ' + error);
      });
  };

  return (
    <div className="FormContainer">
      <div className="FormWrapper">
        <h1 className="FormTitle">Data Upload</h1>
        <form>
          <div>
            <label className="FormLabel" htmlFor="layerName">Name of the layer:</label>
            <input
              className="FormInput"
              type="text"
              id="layerName"
              name="layerName"
              value={layerName}
              onChange={handleNameChange}
              required
            />
          </div>
          <div>
            <label className="FormLabel" htmlFor="zipFile">ZIP file (Shapefile):</label>
            <input
              className="FormInput"
              type="file"
              id="zipFile"
              name="zipFile"
              accept=".zip"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <button className="SubmitButton" type="button" onClick={handleUpload}>

              Upload
            </button>
          </div>
        </form>
        {errorMessage && <div className="WarningMessage">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LayerUploadForm;
