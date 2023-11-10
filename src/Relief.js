import React from 'react';
import './Relief.css';
import ReliefImg from './assets/Relief.jpg';

function Relief() {
  return (
    <div className="relief-container">
      <h1>राहत सहयोगको लागि अनुरोध</h1>
      <div className='TextImg'>
      <div className="description">
        <p>
        यदि तपाईंले भर्खरै प्रकोप अनुभव गर्नुभएको छ भने, हामी तपाईंलाई सहयोग गर्न यहाँ छौं। कृपया फारम भर्नुहोस् र "अर्को" बटन क्लिक गरेर आफ्नो जानकारी पेश गर्नुहोस्। आफ्नो स्थान सहित आफ्नो बारेमा विवरण प्रदान गर्नुहोस्। थप रूपमा, हामीलाई तपाईंको अवस्था राम्रोसँग बुझ्न मद्दत गर्न बाढी वा भूकम्पबाट प्रभावित तपाईंको घरको छविहरू संलग्न गर्नुहोस्।
        </p>
        <p>
        हामीले तपाईंको अनुरोध प्राप्त गरेपछि, हाम्रो टोलीले यसलाई तुरुन्तै प्रशोधन गर्नेछ। पेस गरेपछि आवश्यक राहत तपाईंको स्थानीय नगरपालिका वा वार्डले प्रदान गर्नेछ।
        </p>
      </div>
      <div className="image-container">
        <img src={ReliefImg} alt="Relief" />
      </div>
      </div>
     

    

      <div className="relief-button-container">
        <button type="button" className="back-button">
          Back
        </button>
        <button type="submit" className="next-button">
          Next 
        </button>
      </div>
    </div>
  );
}

export default Relief;
