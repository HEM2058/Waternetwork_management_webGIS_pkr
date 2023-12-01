import React, { useEffect, useState } from 'react';
import './map.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import NetworkAnalysis from './Networkanalysis';

function ButtonContainer({ map, resetFunction, exportMapImage, toggleBaseLayerPopup, showBaseLayerPopup, handleBaseLayerChange, toggleFilterPopup, showFilterPopup, apiData }) {
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterLayer, setSelectedFilterLayer] = useState('');
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(null);
  console.log(selectedListItemIndex)
  const handleItemClick = (feature,index) => {
    console.log(feature)
    setSelectedListItemIndex(index);
    const multiLineString = feature.geometry.coordinates;
  
    // Calculate the bounds manually
    const lineBounds = multiLineString.reduce((bounds, lineString) => {
      lineString.forEach((coord) => {
        bounds.extend(maplibregl.LngLat.convert(coord));
      });
      return bounds;
    }, new maplibregl.LngLatBounds());
  
    // Remove the existing highlight layer if it exists
    if (map.getLayer('highlight-layer')) {
      map.removeLayer('highlight-layer');
      map.removeSource('highlight');
    }
  
    // Add the new highlight layer to the map
    map.addSource('highlight', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: multiLineString,
        },
      },
    });
  
    map.addLayer({
      id: 'highlight-layer',
      type: 'line',
      source: 'highlight',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'red',
        'line-width': 4,
      },
    });
  
    // Adjust padding and duration as needed
    map.fitBounds(lineBounds, { padding: 20, duration: 2000 });
  };
  
  
  
  useEffect(() => {
    const fetchDataForLayer = async (layerName) => {
      setIsLoading(true);

      const filteredFeatures = apiData.flatMap(item => {
        const features = item.geojson.features.filter(feature => feature.properties.name.endsWith(layerName));
        return features;
      });

      setFilteredData(filteredFeatures);
      setIsLoading(false);
    };

    if (selectedFilterLayer) {
      fetchDataForLayer(selectedFilterLayer);
    } else {
      setFilteredData([]);
    }
  }, [selectedFilterLayer, apiData]);

  return (
    <div className="button-container">
      <button id="reset-button" onClick={() => resetFunction()} data-tooltip="Reset Map View">
        <i className="fas fa-undo"></i>
      </button>
      <button onClick={() => exportMapImage()} data-tooltip="Export Map">
        <i className="fa fa-print"></i>
      </button>
      <button className={showBaseLayerPopup ? 'active' : ''} onClick={() => toggleBaseLayerPopup()} data-tooltip="Base Layers">
        <i className="fas fa-globe"></i>
      </button>
      {showBaseLayerPopup && (
        <div className={`base-layer-popup`}>
          <>
            <input
              type="radio"
              id="DefaultMapToggle"
              name="baseLayer"
              checked={false} 
              onChange={() => handleBaseLayerChange('')}
            />
            <label htmlFor="googleSatelliteToggle">Default BaseMap</label>
            <input
              type="radio"
              id="googleSatelliteToggle"
              name="baseLayer"
              checked={false}
              onChange={() => handleBaseLayerChange('satellite')}
            />
            <label htmlFor="googleSatelliteToggle">Satellite</label>
          </>
        </div>
      )}

      <button onClick={() => toggleFilterPopup()} className={showFilterPopup ? 'active' : ''} data-tooltip="Filter">
        <i className="fas fa-filter"></i>
      </button>

      {showFilterPopup && (
        <div className={`filter-popup`}>
          <select value={selectedFilterLayer} onChange={(e) => setSelectedFilterLayer(e.target.value)}>
            <option value="" disabled>Select a Layer</option>
            <option value="Reservoir">Reservoir</option>
            <option value="Tubewell">Tubewell</option>
            <option value="tank">tank</option>
          </select>

          {selectedFilterLayer && (
      <>
        {isLoading && <p>Loading...</p>}
        {filteredData.length > 0 && (
          <div>
            <label>Filtered Data:</label>
            <ul>
              {filteredData.map((feature, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(feature, index)}
                  className={selectedListItemIndex === index ? 'active' : ''}
                >
                  {feature.properties.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    )}
  

        </div>
      )}
    </div>
  );
}



function OpenLayersMap({ apiData, onMapClick }) {
  const [map, setMap] = useState(null);
  const [showBaseLayerPopup, setShowBaseLayerPopup] = useState(false);
  const [baseLayerName, setBaseLayerName] = useState('');
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  useEffect(() => {
    if (!map && apiData && apiData.length > 0) {
      const firstItem = apiData[0];

      const newMap = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB',
        center: [83.97517583929165, 28.214732103900108],
        zoom: 11.5,
      });

      newMap.on('load', () => {
        newMap.addSource('water-pipeline', {
          type: 'geojson',
          data: firstItem.geojson,
        });

        newMap.addLayer({
          id: 'water-pipeline-layer',
          type: 'line',
          source: 'water-pipeline',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0080ff',
            'line-width': 2,
          },
        });
        newMap.on('click', (e) => {
          // Handle click on the base layer
          if (onMapClick) {
            const clickedCoordinate = newMap.unproject(e.point);
            console.log(clickedCoordinate)
            onMapClick(clickedCoordinate);
          }
        });
      });

      newMap.on('click', 'water-pipeline-layer', (e) => {
        const featureProperties = e.features[0].properties;
        const coordinates = e.lngLat;
      
        // Check if the feature is a water pipeline
        if (featureProperties.name === 'waterpipe') {
          // Display diameter for water pipelines
          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<h3>Diameter</h3><p>${featureProperties.diameter} meter</p>`)
            .addTo(newMap);
        } else {
          // Display only the name for other features
          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<p>${featureProperties.name}</p>`)
            .addTo(newMap);
        }
      });
      
      newMap.on('mouseenter', 'water-pipeline-layer', () => {
        newMap.getCanvas().style.cursor = 'pointer';
      });
      
      newMap.on('mouseleave', 'water-pipeline-layer', () => {
        newMap.getCanvas().style.cursor = '';
      });
      

      setMap(newMap);
    }
  }, [map, apiData]);

  const resetFunction = () => {
    map.flyTo({
      center: [83.97517583929165, 28.214732103900108],
      zoom: 11.5,
    });
  };

  const exportMapImage = () => {
    const dataURL = map.getCanvas().toDataURL('image/png');
    console.log('Exported Map Image:', dataURL);
  };

  const toggleBaseLayerPopup = () => {
    setShowBaseLayerPopup(!showBaseLayerPopup);
  };

  const handleBaseLayerChange = (layerName) => {
    setBaseLayerName(layerName);
    const styleUrl = layerName
      ? `https://api.maptiler.com/maps/${layerName}/style.json?key=Otbh9YhFMbwux7HyoffB`
      : 'https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB';
    map.setStyle(styleUrl);
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  return (
    <div>
      <div id="map"></div>
      {map && (
        <>
          <ButtonContainer
            map={map}
            resetFunction={resetFunction}
            exportMapImage={exportMapImage}
            toggleBaseLayerPopup={toggleBaseLayerPopup}
            showBaseLayerPopup={showBaseLayerPopup}
            handleBaseLayerChange={handleBaseLayerChange}
            toggleFilterPopup={toggleFilterPopup}
            showFilterPopup={showFilterPopup}
            apiData={apiData}
          />
      
        </>
      )}
    </div>
  );
}

export default OpenLayersMap;


