import React, { useEffect, useState } from 'react';
import './map.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Import it into your code
import MeasuresControl from 'maplibre-gl-measures';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI} from "@watergis/maplibre-gl-export";
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';
import { NavigationControl, ScaleControl, FullscreenControl } from 'maplibre-gl';
import streetBaselayer from './assets/streets-v2.png';
import satelliteBaselayer from './assets/satellite.png';


function ButtonContainer({ map, resetFunction, exportMapImage, toggleBaseLayerPopup, showBaseLayerPopup, handleBaseLayerChange,baseLayerName, toggleFilterPopup, showFilterPopup, apiData }) {
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterLayer, setSelectedFilterLayer] = useState('');
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(null);
  const [activeButton, setActiveButton] = useState('');



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

      const filteredFeatures = apiData.features
      .filter(feature => feature.geometry.type === 'Polygon');
    
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
         <button onClick={getCurrentLocation} title="Get Current Location">
        <i className="fas fa-location-arrow"></i>
      </button>
      <button id="reset-button" onClick={() => resetFunction()} title="Reset Map View">
        <i className="fas fa-undo"></i>
      </button>
  
   
    

   


   
    </div>
  );
}

function OpenLayersMap({ pipelineData, storageUnitData, gateValveData, tubeWellData, onMapClick, selectedMultistringGeometry, routeData }) {
  const [map, setMap] = useState(null);
  const [showBaseLayerPopup, setShowBaseLayerPopup] = useState(false);
  const [baseLayerName, setBaseLayerName] = useState('streets-v2');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeBaselayer, setActiveBaselayer] = useState('default');
  const [style, setStyle] = useState('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB')

  const [layerVisibility, setLayerVisibility] = useState({
    pipeline: false,
    storageUnit: false,
    gateValve: false,
    tubeWell: false,
  });
  let activePopup = null;
  useEffect(() => {
   if(map){ 
   setMap(null)
   }
  },[style]);

  useEffect(() => {
    if (!map) {
      const newMap = new maplibregl.Map({
        container: 'map',
        style: style,
        center: [83.97517583929165, 28.214732103900108],
        zoom: 11.5,
      });
      newMap.addControl(new ScaleControl(), 'bottom-right');
      newMap.addControl(new NavigationControl(), 'bottom-right');
      newMap.addControl(new FullscreenControl(), 'top-right');
      // map.addControl(new MeasuresControl(), 'top-right');
      newMap.addControl(new MaplibreExportControl(), 'bottom-right');
      
      setMap(newMap);
    }
  }, [map, style]);

  useEffect(() => {
    if (map) {
      console.log("hello world")
   console.log(layerVisibility)

      // map.on('load', async () => {
      //   console.log("inside loading function")
        // try {
        //   const response = await fetch('/data/servicearea.geojson');
        //   const localGeojsonData = await response.json();

        //   map.addSource('local-geojson', {
        //     type: 'geojson',
        //     data: localGeojsonData,
        //   });

        //   map.addLayer({
        //     id: 'local-geojson-layer',
        //     type: 'line',
        //     source: 'local-geojson',
        //     layout: {
        //       'line-join': 'round',
        //       'line-cap': 'round',
        //     },
        //     paint: {
        //       'line-color': '#ff0000',
        //       'line-width': 3,
        //       'line-dasharray': [2, 2],
        //     },
        //   });
        // } catch (error) {
        //   console.error('Error loading local GeoJSON:', error);
        // }
if(layerVisibility.pipeline){
        map.addSource('water-pipeline', {
          type: 'geojson',
          data: pipelineData,
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
      }
      if(layerVisibility.storageUnit){
        map.addSource('storage-unit', {
          type: 'geojson',
          data: storageUnitData,
        });
        
        map.addLayer({
          id: 'storage-unit-layer',
          type: 'fill',
          source: 'storage-unit',
          paint: {
            'fill-color': '#FFA500',
            'fill-opacity': 0.5,
          },
       
        });
      }
      if(layerVisibility.gateValve){
        map.addSource('gate-valve', {
          type: 'geojson',
          data: gateValveData,
        });
        
        map.addLayer({
          id: 'gate-valve-layer',
          type: 'circle',
          source: 'gate-valve',
          paint: {
            'circle-color': '#FF0000',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
          },
          
        });
      }
      if(layerVisibility.tubeWell){
        map.addSource('tubewell', {
          type: 'geojson',
          data: tubeWellData,
        });
        
        map.addLayer({
          id: 'tubewell-layer',
          type: 'circle',
          source: 'tubewell',
          paint: {
            'circle-color': '#00FF00',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
          },
   
        });
      }
    

   
        
      // });
    }
  }, [map, pipelineData, storageUnitData, gateValveData, tubeWellData, layerVisibility]);

  const handleLayerToggle = (layer) => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };

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



  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };
  const handleBaselayerToggle = (baselayer) => {
    setActiveBaselayer(baselayer);
    if (baselayer === 'street') {
      setStyle('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB');
  
    } else if (baselayer === 'satellite') {
      setStyle('https://api.maptiler.com/maps/satellite/style.json?key=Otbh9YhFMbwux7HyoffB');
    }
  };

  return (
    <div>
      <div id="map">  {map && (
        <>
          <ButtonContainer
            map={map}
            resetFunction={resetFunction}
            exportMapImage={exportMapImage}
            apiData={pipelineData}
          />
          <div className="map-legends">
            <div className='legends'>
              <input
                type="checkbox"
                id="serviceAreaCheckbox"
                checked
                
              />
              <div className="legend" style={{ backgroundColor: 'red'}}></div>
              <label htmlFor="serviceAreaCheckbox">Service Area</label>
            </div>
            <div className='legends'>
              <input
                type="checkbox"
                id="pipelineCheckbox"
                checked={layerVisibility.pipeline}
                onChange={() => handleLayerToggle('pipeline')}
              />
              <div className="legend" style={{ backgroundColor: 'blue' }}></div>
              <label htmlFor="pipelineCheckbox">Pipeline</label>
            </div>
            <div className='legends'>
              <input
                type="checkbox"
                id="storageUnitCheckbox"
                checked={layerVisibility.storageUnit}
                onChange={() => handleLayerToggle('storageUnit')}
              />
              <div className="legend" style={{ backgroundColor: '#FFA500' }}></div>
              <label htmlFor="storageUnitCheckbox">Storage Unit</label>
            </div>
            <div className='legends'>
              <input
                type="checkbox"
                id="gateValveCheckbox"
                checked={layerVisibility.gateValve}
                onChange={() => handleLayerToggle('gateValve')}
              />
              <div className="legend" style={{ backgroundColor: '#FF0000' }}></div>
              <label htmlFor="gateValveCheckbox">Gate Valve</label>
            </div>
            <div className='legends'>
              <input
                type="checkbox"
                id="tubeWellCheckbox"
                checked={layerVisibility.tubeWell}
                onChange={() => handleLayerToggle('tubeWell')}
              />
              <div className="legend" style={{ backgroundColor: '#00FF00' }}></div>
              <label htmlFor="tubeWellCheckbox">Tubewell</label>
            </div>
          </div>
          <div className='baselayer_toggle'>
     
      <button  title='switch to street baselayer'
        className={activeBaselayer === 'street' ? 'active' : ''}
        onClick={() => handleBaselayerToggle('street')}
      >
        <img src={streetBaselayer} alt="Street Baselayer" />
      </button>
      <button  title='switch to satellite baselayer'
        className={activeBaselayer === 'satellite' ? 'active' : ''}
        onClick={() => handleBaselayerToggle('satellite')}
      >
        <img src={satelliteBaselayer} alt="Satellite Baselayer" />
      </button>
      </div>
        </>
      )}</div>
    
    </div>
  );
}


export default OpenLayersMap;
