import React, { useEffect } from 'react';
import './map.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill } from 'ol/style';

function OpenLayersMap() {
  useEffect(() => {
   

    // Create a map object without any default controls
    const map = new Map({
      target: 'map', // The ID of the HTML element where you want to render the map
      layers: [
        new TileLayer({
          source: new OSM(), // Use OpenStreetMap as the base layer
        })
      ],
      view: new View({
        center: fromLonLat([81.2519, 29.7767]), // Initial map center
        zoom: 10, // Initial zoom level
      }),
      controls: [] // Specify an empty array to remove all default controls
    });
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: '/data/bajhanga.geojson', // Replace with the path to your GeoJSON file
     
    });

// Create a vector layer to display the GeoJSON data
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: function (feature) {
    // Generate a random color for each polygon
    const randomColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    
    return new Style({
      fill: new Fill({
        color: randomColor,
      }),
    });
  },
});

map.addLayer(vectorLayer)
    
    // Clean up the map when the component unmounts
    return () => {
      map.dispose();
    };
  }, []); // Only run this effect once when the component mounts

  return <div id="map" className="map" />;
}

export default OpenLayersMap;
