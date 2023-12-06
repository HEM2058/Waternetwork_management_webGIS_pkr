import React, { useEffect, useState } from 'react';
import './map.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Import it into your code
import MeasuresControl from 'maplibre-gl-measures';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI} from "@watergis/maplibre-gl-export";
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';
import { NavigationControl, ScaleControl, FullscreenControl } from 'maplibre-gl';


function ButtonContainer({ map, resetFunction, exportMapImage, toggleBaseLayerPopup, showBaseLayerPopup, handleBaseLayerChange,baseLayerName, toggleFilterPopup, showFilterPopup, apiData }) {
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterLayer, setSelectedFilterLayer] = useState('');
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(null);
  const [activeButton, setActiveButton] = useState('');
  console.log(baseLayerName)

  const handleItemClick = (feature, index) => {
    setSelectedListItemIndex(index);
    const multiLineString = feature.geometry.coordinates;

    const lineBounds = multiLineString.reduce((bounds, lineString) => {
      lineString.forEach((coord) => {
        bounds.extend(maplibregl.LngLat.convert(coord));
      });
      return bounds;
    }, new maplibregl.LngLatBounds());

    if (map.getLayer('highlight-layer')) {
      map.removeLayer('highlight-layer');
      map.removeSource('highlight');
    }

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          map.flyTo({
            center: [longitude, latitude],
            zoom: 25,
          });
  
          // Create a GeoJSON point feature for the current location
          const pointFeature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              title: 'Current Location',
              description: `Accuracy: ${accuracy} meters`,
            },
          };
  
          // Add the point feature source
          map.addSource('current-location', {
            type: 'geojson',
            data: pointFeature,
          });
  
          // Add a circle layer to represent the accuracy
          map.addLayer({
            id: 'current-location-circle',
            type: 'circle',
            source: 'current-location',
            paint: {
              'circle-radius': accuracy,
              'circle-color': 'black',
              'circle-opacity': 0.3,
              'circle-stroke-color': 'black',
              'circle-stroke-width': 1,
            },
          });
  
       
        },
        (error) => {
          console.error('Error getting current location:', error.message);
        },
        // Optional: Add options for better accuracy
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  };
  const resetActiveButtonState = () => {
    setActiveButton('');
  };
  
  return (
    <div className="button-container">
         <button onClick={getCurrentLocation} data-tooltip="Get Current Location">
        <i className="fas fa-location-arrow"></i>
      </button>
      <button id="reset-button" onClick={() => resetFunction()} data-tooltip="Reset Map View">
        <i className="fas fa-undo"></i>
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
              checked={baseLayerName === 'streets-v2'}
          onChange={() => handleBaseLayerChange('streets-v2')}
            />
            <label htmlFor="googleSatelliteToggle">Street Map</label>
            <input
              type="radio"
              id="googleSatelliteToggle"
              name="baseLayer"
                checked={baseLayerName === 'satellite'}
          onChange={() => handleBaseLayerChange('satellite')}
            />
            <label htmlFor="googleSatelliteToggle">Satellite Map</label>
            <input
              type="radio"
              id="topo"
              name="baseLayer"
                checked={baseLayerName === 'topo-v2'}
          onChange={() => handleBaseLayerChange('topo-v2')}
            />
            <label htmlFor="googleSatelliteToggle">Topographic Map</label>
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

function OpenLayersMap({ apiData, onMapClick,selectedMultistringGeometry }) {
  const [map, setMap] = useState(null);
  const [showBaseLayerPopup, setShowBaseLayerPopup] = useState(false);
  const [baseLayerName, setBaseLayerName] = useState('streets-v2');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [baselayer, setBaselayer] = useState('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB')
  console.log(selectedMultistringGeometry)
  useEffect(() => {
    if (!map) {
      const firstItem = apiData[0];
      console.log(baselayer)
      const newMap = new maplibregl.Map({
        container: 'map',
        style: baselayer,
        center: [83.97517583929165, 28.214732103900108],
        zoom: 11.5,
      });
      
      setMap(newMap);
    }
    if(map){
    const firstItem = apiData[0];
map.addControl(new ScaleControl(), 'bottom-right');
map.addControl(new NavigationControl(), 'bottom-right');
map.addControl(new FullscreenControl(), 'top-right'); // Add FullscreenControl
// add the plugin
map.addControl(new MeasuresControl({ /** see options below for further tunning */}), "top-right");
map.addControl(new MaplibreExportControl({
  PageSize: Size.A3,
  PageOrientation: PageOrientation.Portrait,
  Format: Format.PNG,
  DPI: DPI[96],
  Crosshair: true,
  PrintableArea: true
}), 'bottom-right');

map.on('load', async () => {

  try {

    const response = await fetch('/data/servicearea.geojson');
    const localGeojsonData = await response.json();
    console.log(localGeojsonData);

    map.addSource('local-geojson', {
      type: 'geojson',
      data: localGeojsonData,
    });

    map.addLayer({
      id: 'local-geojson-layer',
      type: 'line',
      source: 'local-geojson',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
        'line-dasharray': [2, 2], // Adjust the numbers to change the pattern
      },
    });
  } catch (error) {
    console.error('Error loading local GeoJSON:', error);
  }

  map.addSource('water-pipeline', {
    type: 'geojson',
    data: firstItem.geojson,
  });

  map.addLayer({
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

  map.on('click', (e) => {
    if (onMapClick) {
      const clickedCoordinate = map.unproject(e.point);
      console.log(clickedCoordinate);
      onMapClick(clickedCoordinate);
    }
  });

  map.on('click', 'water-pipeline-layer', (e) => {
    const featureProperties = e.features[0].properties;
    const coordinates = e.lngLat;

    if (featureProperties.name === 'waterpipe') {
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<h3>Diameter</h3><p>${featureProperties.diameter} millimeter</p>`)
        .addTo(map);
    } else {
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<p>${featureProperties.name}</p>`)
        .addTo(map);
    }
  });
 


  map.on('mouseenter', 'water-pipeline-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'water-pipeline-layer', () => {
    map.getCanvas().style.cursor = '';
  });

});

  }
    
  }, [map,apiData, baselayer]);

useEffect(()=>{ // Add the selected multistring geometry to the map as a GeoJSON layer
  if(map){
  if (selectedMultistringGeometry) {
   // Check if the source already exists
   const existingSource = map.getSource('selected-multistring-geojson');
   if (existingSource) {
     map.removeLayer('selected-multistring-layer');
     map.removeSource('selected-multistring-geojson');
   }
    map.addSource('selected-multistring-geojson', {
      type: 'geojson',
      data: selectedMultistringGeometry,
    });

    map.addLayer({
      id: 'selected-multistring-layer',
      type: 'line',
      source: 'selected-multistring-geojson',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'red', // You can adjust the color as needed
        'line-width': 2,
      },
    });

    // Zoom to the extent of the selected-multistring-layer
    const bounds = new maplibregl.LngLatBounds();
    selectedMultistringGeometry.coordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    map.fitBounds(bounds, { padding: 20 });
  }
}
}, [selectedMultistringGeometry]);

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
    const styleUrl =  `https://api.maptiler.com/maps/${layerName}/style.json?key=Otbh9YhFMbwux7HyoffB`
    setBaselayer(styleUrl);
    
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
            baseLayerName={baseLayerName}
            showBaseLayerPopup={showBaseLayerPopup}
            handleBaseLayerChange={handleBaseLayerChange}
            toggleFilterPopup={toggleFilterPopup}
            showFilterPopup={showFilterPopup}
            apiData={apiData}
          />
          <div className="map-legends">
  <div className="legend" style={{ backgroundColor: 'red'}}></div>
  <span>Service Area</span>
  <div className="legend" style={{ backgroundColor: 'blue' }}></div>
  <span>Pipeline</span>
</div>

        </>
        
      )}
    </div>
  );
}

export default OpenLayersMap;
