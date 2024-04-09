import React, { useEffect, useState } from 'react';
import './map.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// Import it into your code
import { useLocation } from 'react-router-dom'; // Import useLocation
import MeasuresControl from 'maplibre-gl-measures';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI} from "@watergis/maplibre-gl-export";
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';
import { NavigationControl, ScaleControl, FullscreenControl } from 'maplibre-gl';
import streetBaselayer from './assets/streets-v2.png';
import satelliteBaselayer from './assets/satellite.png';
import serviceAreaGeoJSON from './assets/servicearea.geojson'; // Import local GeoJSON file
import { event } from 'jquery';



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

function OpenLayersMap({ pipelineData, storageUnitData, gateValveData, tubeWellData, onMapClick, selectedMultistringGeometry, routeData,  taskGeometry}) {
  const [map, setMap] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeBaselayer, setActiveBaselayer] = useState('street');
  
  const [style, setStyle] = useState('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB')

  const location = useLocation(); // Use useLocation hook to get current path
  const currentPath = location.pathname; // Get the current path
  console.log(routeData)
console.log(pipelineData)


  useEffect(() => {
   if(map){ 
    console.log("Style changed")
   setMap(null)
  
   }
  },[pipelineData,style]);


  useEffect(() => {
    if (!map) {
      const newMap = new maplibregl.Map({
        container: 'map',
        style: style,
        center: [83.97517583929165, 28.204732103900108],
        zoom: 12,
        pitch: 35, // Set pitch to 45 degrees
      });
      newMap.addControl(new ScaleControl(), 'bottom-right');
      newMap.addControl(new NavigationControl(), 'bottom-right');
      newMap.addControl(new FullscreenControl(), 'top-right');
      newMap.addControl(new MeasuresControl(), 'top-right');
      newMap.addControl(new MaplibreExportControl(), 'bottom-right');
      
    
      
      setMap(newMap);
    }
  }, [map, style]);



  const updateArea =(e) =>{
    console.log(e)
    }
  if(map){
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

  }

  useEffect(() => {
    if (map) {
      // Listen for the style.load event
      map.once('style.load', () => {
        // Add vector layers after the style has loaded
        if (serviceAreaGeoJSON) {
          // Add service area layer
          map.addSource('service-area-data', {
            type: 'geojson',
            data: serviceAreaGeoJSON,
          });
      
          map.addLayer({
            id: 'service-area-layer',
            type: 'fill',
            source: 'service-area-data',
            paint: {
              'fill-color': 'red', // Adjust color as needed
              'fill-opacity': 0.2,
            },
          });
        }
       // Add pipeline data as a linestring layer
if (pipelineData) {
  map.addSource('pipeline-data', {
    type: 'geojson',
    data: pipelineData,
  });

  map.addLayer({
    id: 'pipeline-layer',
    type: 'line',
    source: 'pipeline-data',
    paint: {
      // Dynamically set line-color based on Leakage property
      'line-color': [
        'case',
        ['==', ['get', 'leakage'], true], 'red', // If Leakage is true, set color to red
        'blue' // Otherwise, set color to blue
      ],
      'line-opacity': 0.8,
      'line-width': 2,
      
    },
    
  });
}

        // Add storage unit data as a polygon layer
        if (storageUnitData) {
          map.addSource('storage-unit-data', {
            type: 'geojson',
            data: storageUnitData,
          });
  
          map.addLayer({
            id: 'storage-unit-layer',
            type: 'fill',
            source: 'storage-unit-data',
            paint: {
              'fill-color': '#FFA500', // Adjust color as needed
              'fill-opacity': 0.5,
            },
          });
        }
  
        // Add gate valve data as a point layer
        if (gateValveData) {
          map.addSource('gate-valve-data', {
            type: 'geojson',
            data: gateValveData,
          });
  
          map.addLayer({
            id: 'gate-valve-layer',
            type: 'circle',
            source: 'gate-valve-data',
            paint: {
              'circle-color': '#FF0000', // Adjust color as needed
              'circle-radius': 5,
              'circle-opacity': 0.8,
            },
          });
        }
  
        // Add tube well data as a point layer
        if (tubeWellData) {
          map.addSource('tube-well-data', {
            type: 'geojson',
            data: tubeWellData,
          });
  
          map.addLayer({
            id: 'tube-well-layer',
            type: 'circle',
            source: 'tube-well-data',
            paint: {
              'circle-color': '#00FF00', // Adjust color as needed
              'circle-radius': 5,
              'circle-opacity': 0.8,
            },
          });
        }
      
    // Add click event listener to show popup for pipelines
    map.on('mouseenter', 'pipeline-layer', (e) => {
      map.getCanvas().style.cursor = 'pointer'; // Set cursor to pointer
    })
    map.on('click', 'pipeline-layer', (e) => {
      map.getCanvas().style.cursor = 'pointer'; // Set cursor to pointer
      const coordinates = e.features[0].geometry.coordinates.slice();
      console.log(coordinates[0])
       const properties = e.features[0].properties;
       console.log(properties)
     
      const description = `Diameter: ${properties.diameter_m}<br>Material:${properties.material} Pipe<br>Pipe Length:${properties.length_m} meters<br> Lekagae Found:${properties.leakage}`;

      // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
      

      new maplibregl.Popup()
        .setLngLat(coordinates[0])
        .setHTML(description)
        .addTo(map);
    });

    // Add mouseleave event listener to remove cursor change and popup
    map.on('mouseleave', 'pipeline-layer', () => {
      map.getCanvas().style.cursor = '';
      map.getCanvas().style.cursor = '';
    });

     // Add click event listener to show popup for storage units
        // Add click event listener to show popup
        map.on('mouseenter', 'storage-unit-layer', (e) => {
          map.getCanvas().style.cursor = 'pointer'; // Set cursor to pointer
        })
        map.on('click', 'storage-unit-layer', (e) => {
          map.getCanvas().style.cursor = 'pointer'; // Set cursor to pointer
          const coordinates = e.features[0].geometry.coordinates[0].slice(); 
          console.log(coordinates)
           const properties = e.features[0].properties;
           console.log(properties)
         
          const description = `${properties.Name} ${properties.Type}`;
    
          // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
          // the popup appears over the copy being pointed to.
         
    
          new maplibregl.Popup()
            .setLngLat(coordinates[0])
            .setHTML(description)
            .addTo(map);
        });
    
        // Add mouseleave event listener to remove cursor change and popup
        map.on('mouseleave', 'storage-unit-layer', () => {
          map.getCanvas().style.cursor = '';
          map.getCanvas().style.cursor = '';
        });
      });
    }
  }, [map, pipelineData, storageUnitData, gateValveData, tubeWellData, style]);
  useEffect(() => {
    if (map && routeData) {
      const coordinates = routeData.data.data[0].latlngs.map(point => [point[0], point[1]]); // Extracting coordinates from routeData
  
      // Remove existing source and layer if they already exist
      if (map.getSource('route-geometry')) {
        map.removeLayer('route-layer');
        map.removeSource('route-geometry');
      }
  
      // Add route data as a linestring layer
      map.addSource('route-geometry', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });
  
      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route-geometry',
        paint: {
          'line-color': 'green', // Adjust color as needed
          'line-width': 5,
        },
      });
  
      // Add point labels
      coordinates.forEach((coord, index) => {
        const label = `Point ${index + 1}`;
        console.log(label)
        map.addLayer({
          id: `point-label-${index}`,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coord,
              },
              properties: {
                label: label,
              },
            },
          },
          layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Regular'], // Adjust font family as needed
            'text-size': 12,
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#000000', // Adjust text color as needed
          },
        });
      });
  
      // Optionally, zoom to the route geometry
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, routeData]);
  
  
  
  

  useEffect(() => {
    if (map && taskGeometry) {
      const geometryString = taskGeometry.split(';')[1]; // Extracting the geometry string
      const coordinates = geometryString
        .replace('POLYGON ((', '')
        .replace('))', '')
        .split(', ')
        .map(coord => {
          const [lng, lat] = coord.split(' ');
          return [parseFloat(lng), parseFloat(lat)];
        });
     // Remove existing source and layer if they already exist
     if (map.getSource('task-geometry')) {
      map.removeLayer('task-geometry-layer');
      map.removeSource('task-geometry');
    }
      map.addSource('task-geometry', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        },
      });
  
      map.addLayer({
        id: 'task-geometry-layer',
        type: 'fill',
        source: 'task-geometry',
        paint: {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5,
        },
      });
  
      // Zoom to the task geometry
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, taskGeometry, style]);
  

 

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

  

  const handleBaselayerToggle = (baselayer) => {
    setActiveBaselayer(baselayer);
    if (baselayer === 'street') {
      setStyle('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB');
  
    } else if (baselayer === 'satellite') {
      setStyle('https://api.maptiler.com/maps/satellite/style.json?key=Otbh9YhFMbwux7HyoffB');
    }
  };

  if (map && currentPath === '/Networkanalysis') {
  
    map.on('click', (event) => {
        console.log(currentPath)
      console.log(event.lngLat);
      onMapClick(event.lngLat);
    });
  }
  

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
  <div className="legend" style={{ backgroundColor: 'red', width: '20px', height: '20px', opacity: '0.2' }}></div>

    <label htmlFor="serviceAreaCheckbox">Service Area</label>
  </div>
  <div className='legends'>
    <div className="legend" style={{ backgroundColor: 'blue', width: '20px', height: '5px' }}></div>
    <label htmlFor="pipelineCheckbox">Pipeline</label>
  </div>
  <div className='legends'>
    <div className="legend" style={{ backgroundColor: '#FFA500', width: '20px', height: '20px' }}></div>
    <label htmlFor="storageUnitCheckbox">Storage Unit</label>
  </div>
  <div className='legends'>
    <div className="legend" style={{ backgroundColor: '#FF0000', borderRadius: '50%' }}></div>
    <label htmlFor="gateValveCheckbox">Gate Valve</label>
  </div>
  <div className='legends'>
    <div className="legend" style={{ backgroundColor: '#00FF00', borderRadius: '50%' }}></div>
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
