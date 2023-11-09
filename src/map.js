import React, { useEffect, useState, useRef } from 'react';
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
import { LineString} from 'ol/geom';
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
import Polygon from 'ol/geom/Polygon';
import PropertyViewer from './PropertyViewer'; // Import the PropertyViewer component
import Circle from 'ol/style/Circle';
function OpenLayersMap({ apiData }) {
  const [map, setMap] = useState(null)
  const [colorHash, setColorHash] = useState({});
  const [initialZoom, setInitialZoom] = useState(null); // Set your initial zoom level here
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPalika, setSelectedPalika] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [availableLayers, setAvailableLayers] = useState([]);
  const [searchText, setSearchText] = useState(null); // Store the latest search text
  const [baseLayerName, setBaseLayerName] = useState(''); // stores latest baselayer selection from baselayer lists
  const [showFilter, setShowFilter] = useState(false); //stores filter button activate state
  const [showBaseLayerPopup, setShowBaseLayerPopup] = useState(false); //stores baselayer button activate state 
  const [Reset, setReset] = useState(false);
  const [Property, setProperty] = useState('');
  const [Popup, setPopup] = useState('');
  const [ClosePopup, setClosePopup] = useState(false)
  const markerLayerRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const multipolygonLayerRef = useRef(null);
  const lineLayerRef = useRef(null);
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

  setReset(!Reset)
}


   // Callback function to handle closing the popup, this is passing as prop to PropertyViewer component and will call back once popup is closed
   const handlePopupClose = () => {
    setClosePopup(false); // Set ClosePopup to false when closing the popup

  };

        // Function to calculate and update the initial zoom level based on screen size
        const updateZoomBasedOnScreenSize = () => {
          const screenWidth = window.innerWidth;
        
          if (screenWidth < 768) { // Adjust this value based on your design breakpoints
          
            setInitialZoom(4); // Set the zoom level for smaller screens
          } else {
           
            setInitialZoom(10); // Set the default zoom level for larger screens
          }
        };
        

  useEffect(() => {

    console.log(selectedLayer)
  updateZoomBasedOnScreenSize();

 
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
        rotation: 0, // Set rotation to 0 to disable rotation
      
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
    


    // Create OpenStreetMap layer as a base layer
  const geoJSONUrl = '/data/bajhanga.geojson';
   
     
  if (map) {
    // Check if there's an existing 'osm' layer and remove it
    const existingOSMLayer = map.getLayers().getArray().find((layer) => {
      return layer.get('name') === 'osm';
    });
  
    if (existingOSMLayer) {
      map.removeLayer(existingOSMLayer);
    }
  
    // Check if there's an existing 'googleSatellite' layer and remove it
    const existingGoogleSatelliteLayer = map.getLayers().getArray().find((layer) => {
      return layer.get('name') === 'googleSatellite';
    });
  
    if (existingGoogleSatelliteLayer) {
      map.removeLayer(existingGoogleSatelliteLayer);
    }
  
    let osmLayer; // Declare the variable here
  
    // Create and add the new layer based on the 'baseLayerName'
    if (baseLayerName === 'osm') {
      osmLayer = new TileLayer({
        source: new OSM(),
        opacity: 1,
        name: 'osm',
      });
      map.addLayer(osmLayer);
    } else if (baseLayerName === 'googleSatellite') {
      const googleSatelliteLayer = new TileLayer({
        source: new XYZ({
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          maxZoom: 21,
        }),
        opacity: 1,
        name: 'googleSatellite',
      });
      map.addLayer(googleSatelliteLayer);
    }
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

      if (map) {
        // Get all layers currently added to the map
        const currentLayers = map.getLayers().getArray();
      
        // Remove all previous WMS layers
        currentLayers.forEach((layer) => {
          if (layer instanceof TileLayer && layer.getSource() instanceof TileWMS) {
            map.removeLayer(layer);
          }
        });
      
        if (apiData) {
          apiData.forEach((item) => {
            const { Palika, name } = item;
            if (selectedLayer.includes(name)) { // Check if the selectedLayer array includes the current 'name'
              console.log(name)
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
              map.addLayer(wmsLayer);
            }
          });
        }
      }
      
      
 

  
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
            color: 'black', // Set the stroke color to black
            width: 2,
            lineDash: [5, 5], // Create a dotted line effect with 5px dashes and 5px gaps
          }),
          text: new Text({
            text: name,
            fill: new Fill({
              color: 'blue',
            }),
            
              // Add zIndex and make the text bold
       
        font: 'bold 12px sans-serif', // Adjust the font size and weight as needed
      
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
// function polygonStyleFunction(feature, resolution) {
//   return new Style({
//     stroke: new Stroke({
//       color: 'blue',
//       width: 1,
//     }),
//     fill: new Fill({
//       color: 'rgba(0, 0, 255, 0.1)',
//     }),
//   });
// }

// Function to zoom into a specific polygon by matching the LOCAL property
function zoomToFeatureByLocal(local) {
  vectorSource.once('change', function () {
    const features = vectorSource.getFeatures();

    for (const feature of features) {
      const featureProperties = feature.getProperties();
      if (featureProperties.LOCAL === local) {
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
          color: 'red',
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
      )}, 0)`;
      colorHash[local] = randomColor;

      return randomColor;
    }


  
    
      // Create a function to handle setting latitude and longitude
 
      
    
        
    
        // Call addMarker to add the marker to the map
     
   
    



    
    
    
    
    
    
    
    
    
    
    





  


    // Add an event listener to the document click event
    document.addEventListener('click', (event) => {
      const searchResultsContainer = document.getElementById('search-results');
    
      // Check if the searchResultsContainer and mapContainer exist
      if (searchResultsContainer) {
        // Check if the click event target is outside the search results area
        if (!searchResultsContainer.contains(event.target)) {
          // Check if the click event target is inside the map container
     
            searchResultsContainer.innerHTML = ''; // Clear the search results
          
        }
      }
    });
    

    

    

   



  },[apiData, selectedPalika, selectedLayer, baseLayerName, Reset, map, initialZoom]);

  useEffect(()=>{
if(Reset==true){
  console.log(Reset)
    // Reset the map to its initial state
  map.getView().setCenter(fromLonLat([81.2519, 29.7767]));
  map.getView().setZoom(initialZoom);
  setReset(!Reset)
}
  },[Reset])


  //This useEffect is depends upon the latest searchText usestate variable so that we can search and get result. We can click on the search result to display popup with its location marking at map
  useEffect(() => {

    //handling adding marker and zooming to their extent
    const addMarker = (lat, lon) => {
      if (map) {
        // Create a style for the marker
        const markerStyle = new Style({
          image: new Circle({
            radius: 5, // Increase the size as needed
            fill: new Fill({
              color: 'green', // Change the color to blue
            }),
            stroke: new Stroke({
              color: 'black', // You can change the border color
              width: 2, // Adjust the border width
            }),
          }),
        });
    
        // Create a marker feature
        const markerFeature = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
        });
    
        markerFeature.setStyle(markerStyle);
    
        // If you want to create the layer if it doesn't exist:
        const markerLayer = new VectorLayer({
          source: new VectorSource({
            features: [markerFeature],
          }),
          style: markerStyle, // Apply the custom style to the marker
        });
    
        map.addLayer(markerLayer);
    
        // Update markerLayerRef.current to the new marker layer
        markerLayerRef.current = markerLayer;
    
        // Zoom to the marker's location
        const view = map.getView();
        view.fit(markerFeature.getGeometry().getExtent(), {
          padding: [50, 50, 50, 150], // You can adjust the padding as needed
          duration: 1000, // Animation duration in milliseconds
        });
      }
    };
    
//adding the polygon on the map and zooming to their extent
const addPolygon = (coordinates) => {
  if (map) {
 


    // Define the polygon style
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'blue', // Adjust the border color
        width: 2, // Adjust the border width
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.2)', // Adjust the fill color and opacity
      }),
    });

    // Create a polygon feature
    const polygonFeature = new Feature({
      geometry: new Polygon(coordinates),
    });

    polygonFeature.setStyle(polygonStyle);

    // Create a vector layer for the polygon
    const polygonLayer = new VectorLayer({
      source: new VectorSource({
        features: [polygonFeature],
      }),
      style: polygonStyle,
    });

    map.addLayer(polygonLayer);
      // Update polygonLayerRef.current to the new polygon layer
      polygonLayerRef.current = polygonLayer;
    // Zoom to the polygon's extent
    const view = map.getView();
    view.fit(polygonFeature.getGeometry().getExtent(), {
      padding: [50, 50, 50, 150],
      duration: 1000,
    });
  }
};

//adding the multipoligon on the map and zooming to their extent
const addMultiPolygon = (multiPolygonCoordinates) => {
  if (map) {
    // Define the polygon style
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'blue', // Adjust the border color
        width: 2, // Adjust the border width
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.2)', // Adjust the fill color and opacity
      }),
    });

    // Create an array to store individual polygon features
    const polygonFeatures = [];

    // Iterate through each polygon in the MultiPolygon
    for (const polygonCoordinates of multiPolygonCoordinates) {
      const polygonFeature = new Feature({
        geometry: new Polygon(polygonCoordinates),
      });
      polygonFeature.setStyle(polygonStyle);
      polygonFeatures.push(polygonFeature);
    }

    // Create a vector layer for the polygon features
    const polygonLayer = new VectorLayer({
      source: new VectorSource({
        features: polygonFeatures,
      }),
      style: polygonStyle,
    });

    map.addLayer(polygonLayer);
      // Update multipolygonLayerRef.current to the new multipolygon layer
      multipolygonLayerRef.current = polygonLayer;
    // Zoom to the extent of all polygon features
    const view = map.getView();
    const extent = polygonLayer.getSource().getExtent();
    view.fit(extent, {
      padding: [50, 50, 50, 150],
      duration: 1000,
    });
  }
};

//handling line feature in the map and zooming to their extent
const addLine = (coordinates) => {
  if (map) {
    // Define the line style
    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'red', // Adjust the line color
        width: 3, // Adjust the line width
      }),
    });

    // Create a line feature
    const lineFeature = new Feature({
      geometry: new LineString(coordinates),
    });

    lineFeature.setStyle(lineStyle);

    // Create a vector layer for the line
    const lineLayer = new VectorLayer({
      source: new VectorSource({
        features: [lineFeature],
      }),
      style: lineStyle,
    });

    map.addLayer(lineLayer);
    // Update lineLayerRef.current to the new line layer
    lineLayerRef.current = lineLayer;
    // Zoom to the line's extent
    const view = map.getView();
    view.fit(lineFeature.getGeometry().getExtent(), {
      padding: [50, 50, 50, 150],
      duration: 1000,
    });
  }
};

    
    function handleSearchResultClick(geojsonFeature, propertyValue) {
      // Assuming you have the properties data in the 'properties' variable
      const properties = geojsonFeature.properties;
      const geometryType = geojsonFeature.geometry.type;
// Replace the original geometry with the transformed geometry

      console.log(geometryType)
  if (geometryType === 'Point') {

    const coordinates = geojsonFeature.geometry.coordinates;
    const newLatitude = coordinates[1];
    const newLongitude = coordinates[0];
    addMarker(newLatitude, newLongitude);
  } else if (geometryType === 'Polygon') {
    // Handle the polygon geometry
    //transfering from EPSG:4326 into EPSG:3857 which is the default projection of the openlayers
    const transformedCoordinates = geojsonFeature.geometry.coordinates.map(ring => ring.map(coord => fromLonLat(coord)));
    geojsonFeature.geometry.coordinates = transformedCoordinates;
    console.log(geojsonFeature.geometry.coordinates)
    addPolygon(geojsonFeature.geometry.coordinates);
   
  }else if (geometryType === 'MultiPolygon') {
    // Handle the multipolygon geometry
  //transfering from EPSG:4326 into EPSG:3857 which is the default projection of the openlayers
  const transformedPolygons = geojsonFeature.geometry.coordinates.map(polygon => {
    return polygon.map(ring => ring.map(coord => fromLonLat(coord)));
  });
  geojsonFeature.geometry.coordinates = transformedPolygons;
    console.log(geojsonFeature.geometry.coordinates)
    addMultiPolygon(geojsonFeature.geometry.coordinates);

  }
   else if (geometryType === 'LineString') {
    // Handle the line geometry
      //transfering from EPSG:4326 into EPSG:3857 which is the default projection of the openlayers
    const transformedCoordinates = geojsonFeature.geometry.coordinates.map(coord => fromLonLat(coord));
    geojsonFeature.feature.geometry.coordinates = transformedCoordinates;
    addLine(geojsonFeature.geometry.coordinates);
  } else {
    // Handle other geometry types as needed
    console.warn('Unsupported geometry type:', geometryType);
  }

  
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
            //clear the previous marker from the map
            if(markerLayerRef.current){
            markerLayerRef.current.getSource().clear();
            }

            //clear the previous polygon marker from the map
            if(polygonLayerRef.current){
              console.log("erased polygon")
              polygonLayerRef.current.getSource().clear();
              }
                //clear the previous multipolygon marker from the map
            if(multipolygonLayerRef.current){
              console.log("erased multipolygon")
              multipolygonLayerRef.current.getSource().clear();
              }
                //clear the previous polygon marker from the map
            if(lineLayerRef.current){
              console.log("erased line")
              lineLayerRef.current.getSource().clear();
              }
            //Reset the map view to initial state
              // Reset the map to its initial state
  map.getView().setCenter(fromLonLat([81.2519, 29.7767]));
  map.getView().setZoom(initialZoom);
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
     // Call the handleWFSRequest function whenever searchText changes
     handleWFSRequest();
},[searchText])
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
          type="checkbox" // Change the input type to checkbox
          id={layer}
          name="layerCheckbox" // You can use the same name or change it if needed
          value={layer}
          checked={selectedLayer.includes(layer)} // Check if the layer is included in the selectedLayer array
          onChange={() => {
            if (selectedLayer.includes(layer)) {
              setSelectedLayer(selectedLayer.filter(selected => selected !== layer)); // Remove the layer from selectedLayer array if it's already selected
            } else {
              setSelectedLayer([...selectedLayer, layer]); // Add the layer to selectedLayer array if it's not selected
            }
          }}
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
  <>
  <input
      type="radio"
      id="DefaultMapToggle"
      name="baseLayer"
      checked={baseLayerName === ''}
      onChange={() => handleBaseLayerChange('')}
    />
    <label htmlFor="googleSatelliteToggle">Default BaseMap</label>
    <input
      type="radio"
      id="googleSatelliteToggle"
      name="baseLayer"
      checked={baseLayerName === 'googleSatellite'}
      onChange={() => handleBaseLayerChange('googleSatellite')}
    />
    <label htmlFor="googleSatelliteToggle">Google Satellite</label>

    <input
      type="radio"
      id="osmToggle"
      name="baseLayer"
      checked={baseLayerName === 'osm'}
      onChange={() => handleBaseLayerChange('osm')}
    />
    <label htmlFor="osmToggle">OSM</label>
  </>
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
