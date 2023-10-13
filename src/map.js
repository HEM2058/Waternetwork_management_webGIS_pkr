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
import './map.css';

function OpenLayersMap() {
  useEffect(() => {
    // Fetch the GeoJSON data from the API endpoint
    fetch('http://127.0.0.1:2500/geojson-features/')
      .then((response) => response.json())
      .then((data) => {
        const geojson = data[0].geojson; // Extract the GeoJSON data
        console.log('Fetched GeoJSON data:', geojson);

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

        if (geojson) {
          const vectorSource = new VectorSource({
            format: new GeoJSON(),
            features: new GeoJSON().readFeatures(geojson), // Use the fetched GeoJSON data
          });
          console.log('Vector Source:', vectorSource);

          const vectorLayer = new VectorLayer({
            source: vectorSource,
          });
          console.log('Vector Layer:', vectorLayer);

          map.addLayer(vectorLayer);
        } else {
          console.log('No GeoJSON data available.');
        }

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
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON data:', error);
      });

    return () => {
      // Clean up code as needed
    };
  }, []);

  return (
    <div>
      <div id="map" className="map" />
      <div id="popup" className="popup" />
    </div>
  );
}

export default OpenLayersMap;
