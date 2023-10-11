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
    const formData = new FormData();
    formData.append('layerName', layerName);
    formData.append('shpFile', selectedFile);

    axios
      .post('http://your-django-api-url/geojsonfile/', formData)
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch((error) => {
        setErrorMessage('Error uploading file: ' + error);
      });
  };

  return (
    <div className="FormContainer">
      <div className="FormWrapper">
        <h1 className="FormTitle">Layer Upload</h1>
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
            <label className="FormLabel" htmlFor="shpFile">ZIP file (Shapefile):</label>
            <input
              className="FormInput"
              type="file"
              id="shpFile"
              name="shpFile"
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
