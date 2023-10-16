import React, { useEffect, useState } from 'react';
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
  const [colorHash, setColorHash] = useState({});

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
        // Assign a unique color with 50% opacity to each feature based on its properties
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

    // Function to zoom into a specific polygon
    function zoomToFeature(feature) {
      const extent = feature.getGeometry().getExtent();
      map.getView().fit(extent, {
        duration: 1000, // Animation duration in milliseconds
        padding: [50, 50, 50, 50], // Padding around the extent
      });
    }

    map.on('click', function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        const properties = feature.getProperties();

        if (properties.TYPE === 'Gaunpalika') {
          // Zoom to the clicked polygon
          zoomToFeature(feature);

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

    // Function to generate a unique color with 50% opacity based on the feature's local property
    function getRandomColor(local) {
      // Check if the color is already assigned to this feature
      if (colorHash[local]) {
        return colorHash[local];
      }

      // Generate a new random color with 50% opacity (alpha: 0.5)
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.6)`;
      colorHash[local] = randomColor;

      return randomColor;
    }
  }, []);

  return (
    <div>
      <div id="map" className="map" />
      <div id="popup" className="popup" />
    </div>
  );
}

export default OpenLayersMap;
