import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import streetBaselayer from './assets/streets-v2.png';
import satelliteBaselayer from './assets/satellite.png';
import serviceAreaGeoJSON from './assets/servicearea.geojson'; // Import local GeoJSON data

import './ClientPage.css';

function ClientPage() {
    const [map, setMap] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientPhoneNumber, setClientPhoneNumber] = useState('');
    const [description, setDescription] = useState('');
    const [issueType, setIssueType] = useState(''); // New state for selected issue type
    const [activeBaselayer, setActiveBaselayer] = useState('street');
    const mapContainer = useRef(null);

    useEffect(() => {
        const initializeMap = () => {
            const newMap = new maplibregl.Map({
                container: mapContainer.current,
                style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB',
                center: [83.97517583929165, 28.204732103900108],
                zoom: 12,
                pitch: 35,
            });

            newMap.addControl(new maplibregl.ScaleControl(), 'bottom-right');
            newMap.addControl(new maplibregl.NavigationControl(), 'bottom-right');
            newMap.addControl(new maplibregl.FullscreenControl(), 'top-right');
            setMap(newMap);

            newMap.on('click', (e) => {
                const { lng, lat } = e.lngLat;
                setLatitude(lat.toFixed(6));
                setLongitude(lng.toFixed(6));
            });

            newMap.once('style.load', () => {
                if (serviceAreaGeoJSON) {
                    newMap.addSource('service-area-data', {
                        type: 'geojson',
                        data: serviceAreaGeoJSON,
                    });

                    newMap.addLayer({
                        id: 'service-area-layer',
                        type: 'fill',
                        source: 'service-area-data',
                        paint: {
                            'fill-color': 'red',
                            'fill-opacity': 0.2,
                        },
                    });
                }
            });
        };

        if (!map) initializeMap();

        return () => map?.remove();
    }, [map]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', { clientName, clientPhoneNumber, description, latitude, longitude, issueType }); // Include issueType in the submitted data
    };

    const resetMap = () => {
        map.flyTo({
            center: [83.97517583929165, 28.214732103900108],
            zoom: 11.5,
        });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    map.flyTo({
                        center: [longitude, latitude],
                        zoom: 25,
                    });

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

                    map.addSource('current-location', {
                        type: 'geojson',
                        data: pointFeature,
                    });

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

    const handleBaselayerToggle = (baselayer) => {
        setActiveBaselayer(baselayer);
        if (baselayer === 'street') {
            map.setStyle('https://api.maptiler.com/maps/streets-v2/style.json?key=Otbh9YhFMbwux7HyoffB');
        } else if (baselayer === 'satellite') {
            map.setStyle('https://api.maptiler.com/maps/satellite/style.json?key=Otbh9YhFMbwux7HyoffB');
        }
    };

    return (
        <div className="client-page-container">
            <div className="map-container" ref={mapContainer}></div>
            {loading && <div className="loading-overlay">Loading...</div>}
            <form className="overlay-form" onSubmit={handleSubmit}>
            <h2>Water Issue Reporting</h2>

                <div className="form-group">
                    <label htmlFor="clientName">Name:</label>
                    <input
                        type="text"
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="clientPhoneNumber">Phone Number:</label>
                    <input
                        type="text"
                        id="clientPhoneNumber"
                        value={clientPhoneNumber}
                        onChange={(e) => setClientPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description of issue:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="issueType">Type of Issue:</label>
                    <select id="issueType" value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                        <option value="LEAKAGE">Leakage Detected Point</option>
                        <option value="WATER_ISSUE">Water Supply Issue</option>
                        <option value="PIPE_INSTALLATION">Requested New Location for Pipe Installation</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Latitude:</label>
                    <input
                        type="text"
                        id="latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Longitude:</label>
                    <input
                        type="text"
                        id="longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        disabled
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="button-container">
                <button onClick={getCurrentLocation} title="Get Current Location">
                    <i className="fas fa-location-arrow"></i>
                </button>
                <button id="reset-button" onClick={resetMap} title="Reset Map View">
                    <i className="fas fa-undo"></i>
                </button>
            </div>
            <div className='baselayer_toggle-client'>
                <button
                    title='Switch to street baselayer'
                    className={activeBaselayer === 'street' ? 'active' : ''}
                    onClick={() => handleBaselayerToggle('street')}
                >
                    <img src={streetBaselayer} alt="Street Basemap" />
                </button>
                <button
                    title='Switch to satellite baselayer'
                    className={activeBaselayer === 'satellite' ? 'active' : ''}
                    onClick={() => handleBaselayerToggle('satellite')}
                >
                    <img src={satelliteBaselayer} alt="Satellite Basemap" />
                </button>
            </div>
        </div>
    );
}

export default ClientPage;
