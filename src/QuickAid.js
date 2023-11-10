import React, { useState } from 'react';
import './QuickAid.css'; // Import the CSS file 
import OpenLayersMap from './map';

const QuickAid = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="quick-aid-form-unique">
      {currentPage === 1 && (
        <div className="column-unique column-left-unique">
          <h1 className="quick-aid-heading">राहत सहयोगको लागि अनुरोध- पृष्ठ 1</h1> {/* सहायता अनुरोध गर्नुहोस् - पृष्ठ 1 */}
          <div className="form-section-unique">
            <label htmlFor="name-unique">नाम (Name)*</label> {/* नाम * */}
            <input type="text" id="name-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="phone-unique"> फोन (Phone) *</label> {/* फोन * */}
            <input type="tel" id="phone-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="citizenship-unique">नागरिकता नं (Citizenship No ) *</label> {/* नागरिकता नं * */}
            <input type="text" id="citizenship-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="house-unique">घर नं (House No)*</label> {/* घर नं * */}
            <input type="text" id="house-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="reliefFrom-unique">सहायता बाट (Relief From Disaster) *</label> {/* सहायता बाट * */}
            <select id="reliefFrom-unique">
              <option value="earthquake">भूकम्प (Earthquake ) </option> {/* भूकम्प */}
              {/* ... Other options ... (अन्य विकल्पहरू) */}
            </select>
          </div>
          <div className="form-section-unique">
            <label htmlFor="file-unique">तस्वीर अपलोड गर्नुहोस् (Upload Image) *</label> {/* तस्वीर अपलोड गर्नुहोस् * */}
            <input type="file" id="file-unique" />
            <p className="note-text">
            कृपया तपाईंको सम्पत्ति वा घरमा, प्रकोपको प्रभावको तस्वीर अपलोड गर्नुहोस्
              {/* कृपया आपको घरमा गरेको प्राकृतिक आपदाको प्रभाव जस्तो ल्यान्डस्लाइडको प्रभावलाई दस्तावेज गर्न तस्वीर अपलोड गर्नुहोस्। */}
            </p>
          </div>
          <button type="button" onClick={nextPage}>
            Next {/* अरू */}
          </button>
        </div>
      )}

      {currentPage === 2 && (
        <div className="column-unique column-right-unique">
          <h1 className="quick-aid-heading">राहत सहयोगको लागि अनुरोध- पृष्ठ 2 </h1> {/* सहायता अनुरोध गर्नुहोस् - पृष्ठ 2 */}
          <div className="form-section-unique">
            <label htmlFor="municipality-unique">Palika (नगरपालिका) *</label> {/* नगरपालिका * */}
            <input type="text" id="municipality-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="ward-unique">Ward (वार्ड) *</label> {/* वार्ड * */}
            <input type="text" id="ward-unique" />
          </div>
          <div className="form-section-unique">
            <label htmlFor="location-unique">Location (स्थान) *</label> {/* स्थान * */}
            <input type="text" id="location-unique" />
          </div>
          <div id="map-unique">
            <OpenLayersMap />
          </div>
          <button type="button" onClick={prevPage}>
            Back {/* पछाडि */}
          </button>
          <button className="submit-button-unique">Submit</button> {/* पेश गर्नुहोस् */}
        </div>
      )}
    </div>
  );
};

export default QuickAid;
