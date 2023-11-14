import React, { useEffect, useState } from 'react';

function ApiDataFetcher({ onDataFetched }) {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:2500/api/geoshp/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setApiData(data);
        onDataFetched(data); // Forward the data to the parent component
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return null; // This component doesn't render anything to the DOM
}

export default ApiDataFetcher;
