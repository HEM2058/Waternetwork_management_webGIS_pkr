import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { Style, Text, Fill, Stroke } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
import { LineString, Polygon } from 'ol/geom';
import { Draw } from 'ol/interaction';
import {ZoomSlider} from 'ol/control.js';
import {FullScreen, defaults as defaultControls} from 'ol/control.js';
import { max, createEmpty } from 'ol/extent';
import './map.css';
import { Link } from 'react-router-dom'; // Import the Link component
function OpenLayersMap({ selectedPalika }) {

  const [colorHash, setColorHash] = useState({});
  const [initialZoom, setInitialZoom] = useState(10); // Set your initial zoom level here
  const [popupVisible, setPopupVisible] = useState(false); // Add state for popup visibility
 
 
  useEffect(() => {
   
    
    const minZoom = 9.3; // Define the minimum zoom level you want (e.g., 4)
    const centerCoordinates = fromLonLat([81.2519, 29.7767]);
   const extent = [centerCoordinates[0], centerCoordinates[1], centerCoordinates[0], centerCoordinates[1]];
  const maxExtent = createEmpty();
    function rotateNorthArrow(rotation) {
      const northArrow = document.getElementById('north-arrow');
      if (northArrow) {
        northArrow.style.transform = `rotate(${-rotation}rad)`;
      }
    }
    function resetMapToNorth() {
      const view = map.getView();
      view.setRotation(0);
    }
    // Get the North Arrow element
const northArrow = document.getElementById('north-arrow');

// Add a click event listener
northArrow.addEventListener('click', resetMapToNorth);

     // Determine the initial zoom level based on screen width
     const screenWidth = window.innerWidth;

     if (screenWidth <= 1024) {
      console.log("Going inside 1024")
       setInitialZoom(8); // Adjust the initial zoom level for smaller screens
       
     } else {
    
       setInitialZoom(10); // Set the default initial zoom level for larger screens
     }
    // URL to the GeoJSON data
    const geoJSONUrl = '/data/bajhanga.geojson';

    // Set up the map once the GeoJSON data is available
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.3, 
        }),
      ],
      view: new View({
        center: fromLonLat([81.2519, 29.7767]),
        zoom: initialZoom,
        minZoom: minZoom, // Set the minimum zoom level
      
        extent: [
          8909115.173371011,  // Minimum longitude (west) in meters
          3318850.109835052,   // Minimum latitude (south) in meters
          9149115.173371011,  // Maximum longitude (east) in meters
          3568989.6836373677  // Maximum latitude (north) in meters
        ]
        
        
        
        

      }),
      controls: defaultControls().extend([new FullScreen()]),
    });

    map.getViewport().classList.add('map-pointer-cursor');
// After creating the map
map.getView().on('change:rotation', function (event) {
  rotateNorthArrow(event.target.getRotation());
});

   // URL to the GeoJSON data
   const geoJSONUrl1 = 'http://127.0.0.1:2500/geojson-features/';
   // Create a vector source
     // Create a vector source with the GeoJSON format
const vectorSource1 = new VectorSource({
  format: new GeoJSON(),
});


   // Load the data using Axios
   axios
     .get(geoJSONUrl1)
     .then((response) => {
       console.log('Received GeoJSON data from Axios:', response.data);
          // Check the projection of the loaded GeoJSON data
const geoJSONFormat = new GeoJSON();
       const projection = geoJSONFormat.readProjection(response.data);
       console.log('GeoJSON Projection:', projection);

          // Access the "geojson" property in the response
       const geojsonData = response.data[0].geojson;
       // Check each feature's geometry type
          // Read features from the "geojson" property
const features = vectorSource1.getFormat().readFeatures(geojsonData);
         // Assign an index-based ID to each feature
features.forEach((feature, index) => {
  feature.setId(index);
});
  // Add the features to the vector source
  vectorSource1.addFeatures(features);
       vectorSource1.getFeatures().forEach(function (feature) {
         const geometryType = feature.getGeometry().getType();
         console.log(`Feature ID: ${feature.getId()}, Geometry Type: ${geometryType}`);
       });

       // Create a VectorLayer with the custom style
       const vectorLayer = new VectorLayer({
         source: vectorSource1,
         style: new Style({
           fill: new Fill({
             color: 'red',
           }),
           stroke: new Stroke({
             color: 'white',
             width: 10,
           }),
         }),
           // Explicitly specify the projection as EPSG:4326 (WGS 84)
         projection: 'EPSG:4326',

       });
       vectorLayer.on('error', function (event) {
        console.error('Error adding the VectorLayer to the map:', event.error);
      });
      
       // Add the VectorLayer to the map
       map.addLayer(vectorLayer);
       console.log('VectorLayer state after adding to the map:', vectorLayer.get('state'));
       console.log('VectorLayer added to the map.');
     })
     .catch((error) => {
       console.error('Error loading GeoJSON data using Axios:', error);
     });


    // Create a vector source with the GeoJSON URL
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: geoJSONUrl, // Use the URL to load GeoJSON data
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        // Assign a unique color with 50% opacity to each feature based on its properties
        const properties = feature.getProperties();
        const name = properties.NEPALI_NAME;
        const color = getRandomColor(name); // Use a custom function to get a unique color

        return new Style({
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
          text: new Text({
            text: name,
            fill: new Fill({
              color: 'black',
            }),
          }),
        });
      },
    });

    map.addLayer(vectorLayer);

 
    
// Add ScaleLine control to the map
map.addControl(new ScaleLine());
const zoomslider = new ZoomSlider();
map.addControl(zoomslider);
    const popup = new Overlay({
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    map.addOverlay(popup);

// Function to zoom into a specific polygon
function zoomToFeature(feature) {
  const extent = feature.getGeometry().getExtent();
  // console.log('Zooming to extent:', extent); // Add this for debugging

  const mapView = map.getView();
  // console.log('Map View:', mapView); // Add this for debugging

  // console.log('Fitting to extent...');
  mapView.fit(extent, {
    duration: 1000, // Animation duration in milliseconds
    padding: [50, 50, 50, 50], // Padding around the extent
  });
  // console.log('Fit completed.');
}

// Define a custom style function for polygons
function polygonStyleFunction(feature, resolution) {
  return new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  });
}



   
 
// Define a variable to track the previously clicked feature
let previousClickedFeature = null;

map.on('click', function (event) {
  map.forEachFeatureAtPixel(event.pixel, function (feature) {
    const properties = feature.getProperties();

    if (properties.TYPE === 'Gaunpalika' || properties.TYPE === 'Nagarpalika' || properties.TYPE === 'National Park') {
      // Zoom to the clicked polygon
      zoomToFeature(feature);
      // Set popup visibility to true+
      setPopupVisible(true);
      // Reset the style of the previous clicked feature (if there is one)
      if (previousClickedFeature) {
        previousClickedFeature.setStyle(null); // Reset to the default style
      }

      // Update the layer style to highlight the newly clicked feature
      feature.setStyle(new Style({
        fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }), // Fully transparent fill
        stroke: new Stroke({
          color: 'blue',
          width: 2,
        }),
      }));
  
      // Set the current feature as the previous clicked feature
      previousClickedFeature = feature;

      // Restyle the feature to apply changes
      feature.changed();

      const content = `
      <div class="map_popup">
        <div class="map_popup__title">${properties.NEPALI_NAME}</div>
        <div class="map_popup__content">
          <button class="close-button" onclick="closePopup()">X</button>
          <strong>${properties.LOCAL}</strong> (${properties.TYPE})
          <div class="map_popup__btn-row">
            <a class="map_popup__btn" href="${properties.WEBSITE}" target="_blank">WEBSITE</a>
            <a class="map_popup__btn" href="${properties.WEBSITE}" target="_blank">Relief Request</a>
          </div>
        </div>
      </div>
    `;
    
    // Define the closePopup function
    function closePopup() {
      setPopupVisible(false); // Hide the popup
    }
    
      const coordinate = event.coordinate;

      popup.getElement().innerHTML = content;
      popup.setPosition(coordinate);
    }
  });
});

function zoomToFeatureByLocal(local) {
  vectorSource.once('change', function() {
    const features = vectorSource.getFeatures();
    for (const feature of features) {
      const featureProperties = feature.getProperties();
      if (featureProperties.LOCAL === local) {
        console.log('Matching LOCAL:', featureProperties.LOCAL);
        const extent = feature.getGeometry().getExtent();
        console.log('Extent:', extent); // Add this line for debugging
        zoomToFeature(feature);
        setPopupVisible(true);
        
        break;
      }
    }
  });
}



  // Check if selectedPalika matches a feature's LOCAL property
  if (selectedPalika) {
    zoomToFeatureByLocal(selectedPalika);
  }




    // Function to generate a unique color with 50% opacity based on the feature's local property
    function getRandomColor(local) {
      // Check if the color is already assigned to this feature
      if (colorHash[local]) {
        return colorHash[local];
      }

      // Generate a new random color with 50% opacity (alpha: 0.5)
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.8)`;
      colorHash[local] = randomColor;

      return randomColor;
    }
  }, [selectedPalika]);

  return (
    <div>
      <div id="map" className="map" />
      <div id="popup" className="popup" />
      <div id="north-arrow" className="north-arrow">
  <span className="north-arrow-text">N</span>
</div>

    </div>
  );
}

export default OpenLayersMap;
