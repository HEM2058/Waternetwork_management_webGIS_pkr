import React, { useEffect, useState } from 'react';

function ApiDataFetcher({ onDataFetched }) {
  const [pipelineData, setPipelineData] = useState([]);
  const [storageUnitData, setStorageUnitData] = useState([]);
  const [gateValveData, setGateValveData] = useState([]);
  const [tubeWellData, setTubeWellData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pipelineResponse = await fetch('http://127.0.0.1:8000/api/pipeline-geojson/');
        if (!pipelineResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const pipelineData = await pipelineResponse.json();
        setPipelineData(pipelineData);

        const storageUnitResponse = await fetch('http://127.0.0.1:8000/api/storage-unit-geojson/');
        if (!storageUnitResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const storageUnitData = await storageUnitResponse.json();
        setStorageUnitData(storageUnitData);

        const gateValveResponse = await fetch('http://127.0.0.1:8000/api/gate-valve-geojson/');
        if (!gateValveResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const gateValveData = await gateValveResponse.json();
        setGateValveData(gateValveData);

        const tubeWellResponse = await fetch('http://127.0.0.1:8000/api/tube-well-geojson/');
        if (!tubeWellResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const tubeWellData = await tubeWellResponse.json();
        setTubeWellData(tubeWellData);

        onDataFetched({
          pipelineData,
          storageUnitData,
          gateValveData,
          tubeWellData
        }); // Forward the data to the parent component
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return null; // This component doesn't render anything to the DOM
}

export default ApiDataFetcher;
