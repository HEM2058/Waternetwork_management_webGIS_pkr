import React, { useEffect } from 'react';
import './map.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';

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
        zoom: 7, // Initial zoom level
      }),
      controls: [] // Specify an empty array to remove all default controls
    });

    // Define the Nepal layer
    const nepal = new TileLayer({
      title: 'Nepal',
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/geoapp/wms',
        params: {
          'LAYERS': 'geoapp:Nepal_shp',
          'TILED': true
        },
        serverType: 'geoserver',
      }),
      visible: true
    });

    map.addLayer(nepal);

    // Clean up the map when the component unmounts
    return () => {
      map.dispose();
    };
  }, []); // Only run this effect once when the component mounts

  return <div id="map" className="map" />;
}

export default OpenLayersMap;
