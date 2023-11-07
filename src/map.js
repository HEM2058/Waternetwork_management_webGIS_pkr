import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'; // Import Axios
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { XYZ } from 'ol/source';
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
import TileWMS from 'ol/source/TileWMS';
import { transform } from 'ol/proj';
import $ from 'jquery';
import MunicipalityInfo from './MunicipalityInfo';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import PropertyViewer from './PropertyViewer'; // Import the PropertyViewer component
import Circle from 'ol/style/Circle';
function OpenLayersMap({ apiData }) {
  const [map, setMap] = useState(null)
  const [colorHash, setColorHash] = useState({});
  const [initialZoom, setInitialZoom] = useState(10); // Set your initial zoom level here
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPalika, setSelectedPalika] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('Layer 1');
  const [availableLayers, setAvailableLayers] = useState([]);
  const [searchText, setSearchText] = useState(null); // Store the latest search text
  const [baseLayerName, setBaseLayerName] = useState(''); // stores latest baselayer selection from baselayer lists
  const [showFilter, setShowFilter] = useState(false); //stores filter button activate state
  const [showBaseLayerPopup, setShowBaseLayerPopup] = useState(false); //stores baselayer button activate state 
  const [Reset, setReset] = useState(false);
  const [Property, setProperty] = useState('');
  const [Popup, setPopup] = useState('');
  const [ClosePopup, setClosePopup] = useState(false)

  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
// this updates BaseLayerName with latest click on baselayers list
function handleBaseLayerChange(layer) { 
  console.log(layer)
  setBaseLayerName(layer);
  


}
// this updates SearchText useState variable with latest search input
function handleAttributeSearch(input) {
setSearchText(input); // Update the latest search text
}

//button for the brower print when click on it
function exportMapImage(){
  // Trigger the browser's print dialog
  window.print();

}

//button for baselayer button toggler

const toggleBaseLayerPopup = () => {
setShowBaseLayerPopup(!showBaseLayerPopup);
if(showFilter){
 setShowFilter(!showFilter)
}}
//button for palika layer filter coming from the api
const toggleFilter = () => {
setShowFilter(!showFilter);
if(showBaseLayerPopup){
  setShowBaseLayerPopup(!showBaseLayerPopup)
 }
};

//reset initial map view state switcher
const resetFunction=()=>
{  
  console.log("clicked reset")
  setReset(!Reset)
}
console.log(apiData)

   // Callback function to handle closing the popup, this is passing as prop to PropertyViewer component and will call back once popup is closed
   const handlePopupClose = () => {
    setClosePopup(false); // Set ClosePopup to false when closing the popup

  };
  useEffect(() => {

  console.log("Re executed")
     

 
    const minZoom = 9.3; // Define the minimum zoom level you want (e.g., 4)
    const centerCoordinates = fromLonLat([81.2519, 29.7767]);
   const extent = [centerCoordinates[0], centerCoordinates[1], centerCoordinates[0], centerCoordinates[1]];
  const maxExtent = createEmpty();
    // function rotateNorthArrow(rotation) {
    //   const northArrow = document.getElementById('north-arrow');
    //   if (northArrow) {
    //     northArrow.style.transform = `rotate(${-rotation}rad)`;
    //   }
    // }
    // function resetMapToNorth() {
    //   const view = map.getView();
    //   view.setRotation(0);
    // }
    // Get the North Arrow element
// const northArrow = document.getElementById('north-arrow');

// Add a click event listener
// northArrow.addEventListener('click', resetMapToNorth);

    
   

    // Set up the map once the GeoJSON data is available
    if(!map){
    const openmap = new Map({
      target: 'map',
      layers: [],
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

    setMap(openmap)

    
  }
    
  // // Add a base layer (e.g., OpenStreetMap)
  // const baseLayer = new TileLayer({
  //   source: new OSM(),
  //   visible: true,
  //   opacity:0.2,
  // });
  // map.addLayer(baseLayer);
// Create OpenStreetMap layer as a base layer

    // Create OpenStreetMap layer as a base layer
  const geoJSONUrl = '/data/bajhanga.geojson';
   
     
   if(map){
        
        const osmLayer = new TileLayer({
          source: new OSM(),
          opacity: 0.2,
          visible: baseLayerName === 'osm', // Check if it's the selected base layer
        });
         map.addLayer(osmLayer);
      }
      if(map){ 
        const googleSatelliteLayer = new TileLayer({
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            maxZoom: 21,
          }),
          opacity: 1,
          visible: baseLayerName === 'googleSatellite', // Check if it's the selected base layer
        });
        map.addLayer(googleSatelliteLayer);
      }
      // Add other layers as needed based on baseLayerName

     // Add filtering functionality
     if(map) {
     if (apiData) {
      const distinctPalikas = [...new Set(apiData.map((item) => item.Palika))];
      setAvailableLayers(
        distinctPalikas.map((palika) => {
          const palikaLayers = apiData.filter((item) => item.Palika === palika);
          return {
            palika,
            layers: palikaLayers.map((item) => item.name),
          };
        })
      )}};

      if (map){
    
  if (apiData) {
   
    apiData.forEach((item) => {
      const { Palika, name } = item;
      const wmsLayer = new TileLayer({
        source: new TileWMS({
          url: `http://localhost:8080/geoserver/${Palika}/wms`,
          params: {
            'LAYERS': `${Palika}:${name}`,
            'TILED': true,
          },
          serverType: 'geoserver',
          visible: true,
        }),
      });
    
      // Fetch GeoJSON data for the same layer
      fetch(`http://localhost:8080/geoserver/${Palika}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${Palika}:${name}&outputFormat=application/json`)
        .then((response) => response.json())
        .then((geojsonData) => {
         // Create a VectorSource for vector features
         const vectorSource = new VectorSource({
          format: new GeoJSON(),
          features: new GeoJSON().readFeatures(geojsonData),
        });
       
       
          // Filter the features based on searchText
          vectorSource.clear(); // Clear existing features
          geojsonData.features.forEach((feature) => {
            const firstAttribute = Object.keys(feature.properties)[7];
            const labelText = feature.properties[firstAttribute];
             
   
          });
        
          // Iterate through the features in the GeoJSON and use the first attribute for labeling
          geojsonData.features.forEach((feature) => {
            const firstAttribute = Object.keys(feature.properties)[7];
           
            // Now you can use 'firstAttribute' for labeling on the map.
            const labelText = feature.properties[firstAttribute];
            
            // console.log(labelText)
            // You can use 'labelText' for labeling the feature on the map.
            // You'll need to position the label appropriately, depending on your map setup.
          });
        });
    
      map.addLayer(wmsLayer);
    });
    
  }}
 

  
  if(map){
    map.getViewport().classList.add('map-pointer-cursor');
  }
// After creating the map
// map.getView().on('change:rotation', function (event) {
//   rotateNorthArrow(event.target.getRotation());
// });




    
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
  
    if(map){
    map.addLayer(vectorLayer);
  
    }
// Add ScaleLine control to the map
if(map){
map.addControl(new ScaleLine());
const zoomslider = new ZoomSlider();

map.addControl(zoomslider);
}

    const popup = new Overlay({
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
if(map){
    map.addOverlay(popup);
}
// Function to zoom into a specific polygon
function zoomToFeature(feature) {
  try {
    const extent = feature.getGeometry().getExtent();
    // console.log('Zooming to extent:', extent); // Add this for debugging
    console.log(feature)
    const mapView = map.getView();
    // console.log('Map View:', mapView); // Add this for debugging

    // console.log('Fitting to extent...');
    mapView.fit(extent, {
      duration: 1000, // Animation duration in milliseconds
      padding: [50, 50, 50, 50], // Padding around the extent
    });
    // console.log('Fit completed.');
    
  } catch (error) {
    console.error("Error in zoomToFeature:", error);
  }
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

// Function to zoom into a specific polygon by matching the LOCAL property
function zoomToFeatureByLocal(local) {
  vectorSource.once('change', function () {
    const features = vectorSource.getFeatures();

    for (const feature of features) {
      const featureProperties = feature.getProperties();
      if (featureProperties.LOCAL === local) {
          console.log(featureProperties.LOCAL)
        setSelectedData(featureProperties);
        zoomToFeature(feature);
        
        break;
      }
    }
  });
}



       // Check if selectedPalika matches a feature's LOCAL property
       if (selectedPalika) {
  
        zoomToFeatureByLocal(selectedPalika);
      }
   
 
// Define a variable to track the previously clicked feature
let previousClickedFeature = null;
if(map){
map.on('click', function (event) {
  map.forEachFeatureAtPixel(event.pixel, function (feature) {
    const properties = feature.getProperties();

    if (properties.TYPE === 'Gaunpalika' || properties.TYPE === 'Nagarpalika' || properties.TYPE === 'National Park') {
      // Zoom to the clicked polygon
      setSelectedData(properties); // Pass the selected data to the component
      zoomToFeature(feature);
      // Set popup visibility to true7
      
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

     
    
   
    
     
    }
  });
})};




  

// Define an onClose function to close the popup and reset the map to its initial state
const onClose = () => {
  setSelectedData(null); // Close the popup by resetting the selectedData state to null

  map.getView().setCenter(fromLonLat([81.2519, 29.7767]));
  map.getView().setZoom(initialZoom);


  // Remove the highlight style from the previously clicked feature (if there is one)
  if (previousClickedFeature) {
    previousClickedFeature.setStyle(null);
    previousClickedFeature = null;
  }
};

  // Add an event listener to the map viewport to detect clicks outside features
  if (map){
  map.getViewport().addEventListener('click', function (event) {
    const pixel = map.getEventPixel(event);

    // Check if the click was outside any features
    if (!map.hasFeatureAtPixel(pixel)) {
      // Close the popup and reset the map to its initial state
      onClose();
    }
  })};


    // Function to generate a unique color with 50% opacity based on the feature's local property
    function getRandomColor(local) {
      // Check if the color is already assigned to this feature
      if (colorHash[local]) {
        return colorHash[local];
      }

      // Generate a new random color with 50% opacity (alpha: 0.5)
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.4)`;
      colorHash[local] = randomColor;

      return randomColor;
    }


    const addMarker = (lat, lon) => {
      console.log(lat)
      console.log(lon)
      if (map) {
        console.log("ok")
        // Create a style for the marker
        const markerStyle = new Style({
          image: new Circle({
            radius: 10, // Increase the size as needed
            fill: new Fill({
              color: 'blue', // Change the color to blue
            }),
            stroke: new Stroke({
              color: 'black', // You can change the border color
              width: 2, // Adjust the border width
            }),
          }),
        });
    
        const markerLayer = new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(fromLonLat([lon, lat])),
              }),
            ],
          }),
          style: markerStyle, // Apply the custom style to the marker
        });
    
        map.addLayer(markerLayer);
      }
    };
    
    
      // Create a function to handle setting latitude and longitude
 
      
    
        
    
        // Call addMarker to add the marker to the map
     
   
    



    function handleSearchResultClick(geojsonFeature, propertyValue) {
      // Assuming you have the properties data in the 'properties' variable
      const properties = geojsonFeature.properties;
      const coordinates = geojsonFeature.geometry.coordinates
      const newLatitude = coordinates[1];
      const newLongitude = coordinates[0];
      // setLatitude(newLatitude);
      // setLongitude(newLongitude);
      //  console.log(newLatitude)
        // console.log(latitude)
        // console.log(longitude)
        addMarker(newLatitude, newLongitude);
       // get the searchResults by id and setting style to none when displaying the popup
const searchResults = document.getElementById("search-results");
 
// Check if the element exists
if (searchResults) {
  // Set the value to an empty string to clear it
  searchResults.style.display = 'none';
}

    
      setSearchText(propertyValue);
      // Add a loading class to the input container
      const inputContainer = document.querySelector('.filter-search');
      inputContainer.classList.add('loading');
    
      // Render the PropertyViewer component and pass the properties data as a prop
      setProperty(properties);
    
      // After 2 seconds, add the close icon to the loading class
      setTimeout(() => {
        // Remove the loading class
        inputContainer.classList.remove('loading');
        
        // Create and add the close icon
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times-circle'; // Replace with the appropriate FontAwesome class for a close icon
        closeIcon.style.marginLeft = '5px'; // Adjust the spacing
        closeIcon.style.cursor = 'pointer';
    
        // Append the close icon to the input container
        const searchContainer = document.querySelector('.filter-search');
        if (searchContainer) {
          searchContainer.appendChild(closeIcon);
    
          // Add a click event listener to the close icon
          closeIcon.addEventListener('click', () => {
            // Clear the value in the search input
            setSearchText('');
  // setting style to block when click on the close icon
// Check if the element exists
if (searchResults) {
  // Set the value to an empty string to clear it
  searchResults.style.display = 'block';
}
            // Close the popup by triggering setClosePopup(true)
            setClosePopup(true)
            // Remove the close icon from the container
            if (searchContainer.contains(closeIcon)) {
              searchContainer.removeChild(closeIcon);
            }
          });
        }
      }, 500); // Adjust the delay (in milliseconds) as needed
    }
    
    
    
    
    
    
    
    
    
    
    





  
    function handleWFSRequest() {
      const searchResultsContainer = document.getElementById('search-results');
      searchResultsContainer.innerHTML = ''; // Clear previous results
    
      if (apiData && searchText) {
        apiData.forEach((item) => {
          const { Palika, name } = item;
          fetch(`http://localhost:8080/geoserver/${Palika}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${Palika}:${name}&outputFormat=application/json`)
            .then((response) => response.json())
            .then((geojsonData) => {
              geojsonData.features.forEach((feature) => {
                // Iterate through all properties
                for (const property in feature.properties) {
                  const propertyValue = feature.properties[property];
                  if (propertyValue && propertyValue.toString().toLowerCase().includes(searchText.toLowerCase())) {
                    // Create a list item and add it to the search results container
                    const listItem = document.createElement('li');
    
                    // Create a checkmark icon element
                    const checkmarkIcon = document.createElement('i');
                    checkmarkIcon.className = 'fas fa-search';
                    checkmarkIcon.style.marginRight = '5px'; // Add spacing to the right of the checkmark icon
                    listItem.appendChild(checkmarkIcon);
    
                    // Add the result text
                    const textNode = document.createTextNode(propertyValue);
                    listItem.appendChild(textNode);
                    
                    listItem.addEventListener('click', () => handleSearchResultClick(feature,propertyValue));
                    searchResultsContainer.appendChild(listItem);
                  }
                }
              });
            });
        });
      } else {
        // If searchText is empty, clear the search results container and hide the search result tab
        searchResultsContainer.innerHTML = '';
      }
    }


    // Add an event listener to the document click event
document.addEventListener('click', (event) => {
  const searchResultsContainer = document.getElementById('search-results');

  // Check if the click event target is outside the search result area
  if (!searchResultsContainer.contains(event.target)) {
    searchResultsContainer.innerHTML = ''; // Clear the search results
  }
});

    

    

    // Call the handleWFSRequest function whenever searchText changes
    handleWFSRequest();
if(Reset==true){
  console.log(Reset)
    // Reset the map to its initial state
  map.getView().setCenter(fromLonLat([81.2519, 29.7767]));
  map.getView().setZoom(initialZoom);
  setReset(!Reset)
}


  },[apiData, selectedPalika, selectedLayer,searchText,baseLayerName,Reset,map]);

  return (
    <div>
        {selectedData && <MunicipalityInfo data={selectedData} />}
      <div id="map" className="map" />
        {/* Filter controls */}
        <div className="search-container">
  <div className="filter filter-search">
    <i className="fas fa-search"></i>
    <input
      type="text"
      id="attributeSearch"
      placeholder="Search attributes"
      value={searchText}
      onChange={(e) => handleAttributeSearch(e.target.value)}
    />
  </div>
  <ul id="search-results"></ul> {/* Add an empty unordered list for search results */}
</div>
{showFilter && (
  <div className="filter-container">
  <div className="filter filter-palika-toggle">
    <select
      id="palikaSelect"
      value={selectedPalika}
      onChange={(e) => setSelectedPalika(e.target.value)}
    >
      <option value="">Select a Palika</option>
      {availableLayers.map((item, index) => (
        <option key={index} value={item.palika}>
          {item.palika}
        </option>
      ))}
    </select>
  </div>

  <div className="filter filter-palika-toggle">
    <label>Toggle Layers:</label>
    {availableLayers.find((layer) => layer.palika === selectedPalika)?.layers.map((layer, index) => (
      <div key={index}>
        <input
          type="radio"
          id={layer}
          name="layerRadio"
          value={layer}
          checked={selectedLayer === layer}
          onChange={() => setSelectedLayer(layer)}
        />
        <label htmlFor={layer}>{layer}</label>
      </div>
    ))}
  </div>
  </div>
)}
  <div>
  <div className="button-container">
  <button id="reset-button" onClick={() => resetFunction()} data-tooltip="Reset Map View"><i className="fas fa-undo"></i></button>
  <button onClick={() => exportMapImage()} data-tooltip="Export Map"><i className="fa fa-print"></i></button>
  <button className={showBaseLayerPopup ? 'active' : ''} onClick={() => toggleBaseLayerPopup()} data-tooltip="Base Layers"><i className="fas fa-globe"></i></button>
  {showBaseLayerPopup && (
    <div className={`base-layer-popup`}>
      <button onClick={() => handleBaseLayerChange('googleSatellite')}>googleSatellite</button>
      <button onClick={() => handleBaseLayerChange('osm')} >OSM</button>
    </div>
  )}
  <button onClick={toggleFilter} className={showFilter ? 'active' : ''} data-tooltip="Filter">
    <i className="fas fa-filter"></i>
  </button>
</div>





  
</div>

<PropertyViewer properties={Property} setClosePopup={ClosePopup} onClosePopup={handlePopupClose} />

      {/* <div id="north-arrow" className="north-arrow">
  <span className="north-arrow-text">N</span>

 
</div> */}

    </div>
  );
}

export default OpenLayersMap;
