import React, { useState } from 'react';
import './More.css'
const More = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMore = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="more-container">
      <i className="fas fa-ellipsis-h" onClick={toggleMore}></i>
      {isOpen && (
        <div className="more-options">
          {/* Place your additional options here */}
          <button>Option 1</button>
          <button>Option 2</button>
          <button>Option 3</button>
        </div>
      )}
    </div>
  );
};

export default More;
