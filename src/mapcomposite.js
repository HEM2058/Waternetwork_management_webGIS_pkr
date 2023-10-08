import './mapcomposite.css'

import React from 'react';
import Filter from './Filter';
import OpenLayersMap from './map';

function MapComposite() {
    return (
        <div className="map-container">
             <Filter />
            <OpenLayersMap />
        </div>
    );
}

export default MapComposite;
