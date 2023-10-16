import React, { useEffect } from 'react';
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
import './map.css';

function OpenLayersMap() {
  useEffect(() => {
    // URL to the GeoJSON data
    const geoJSONUrl = '/data/bajhanga.geojson';

    // Set up the map once the GeoJSON data is available
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([81.2519, 29.7767]),
        zoom: 10,
      }),
      controls: [],
    });

    map.getViewport().classList.add('map-pointer-cursor');

    // Create a vector source with the GeoJSON URL
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: geoJSONUrl, // Use the URL to load GeoJSON data
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        // Assign a unique color to each feature based on its properties
        const properties = feature.getProperties();
        const local = properties.LOCAL;
        const color = getRandomColor(local); // Use a custom function to get a unique color

        return new Style({
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
          text: new Text({
            text: local,
            fill: new Fill({
              color: 'black',
            }),
          }),
        });
      },
    });

    map.addLayer(vectorLayer);

    const popup = new Overlay({
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    map.addOverlay(popup);

    map.on('click', function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        const properties = feature.getProperties();

        if (properties.TYPE === 'Gaunpalika') {
          const content = `
            <div class="popup-content">
              <button class="close-button" onclick="closePopup()">X</button>
              <strong>${properties.LOCAL}</strong> (${properties.TYPE})
              <br>
              District: ${properties.DISTRICT}
              <br>
              Province: ${properties.PROVINCE} (${properties.PR_NAME})
            </div>
          `;

          const coordinate = event.coordinate;

          popup.getElement().innerHTML = content;
          popup.setPosition(coordinate);
        }
      });
    });

    return () => {
      // Clean up code as needed
    };
  }, []);

  // Function to generate a unique color based on the feature's local property
  function getRandomColor(local) {
    const colorHash = {};
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    if (!colorHash[local]) {
      colorHash[local] = randomColor;
    }
    return colorHash[local];
  }

  return (
    <div>
      <div id="map" className="map" />
      <div id="popup" className="popup" />
    </div>
  );
}

export default OpenLayersMap;
