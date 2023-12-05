import React, { useState } from 'react';
import './FieldCalculator.css'; // Import your CSS file for styling

function FieldCalculator() {
  // State variables to store user inputs
  const [expression, setExpression] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [result, setResult] = useState(null);

  // Sample GIS layer (replace with your actual GIS layer)
  const sampleGisLayer = [
    { id: 1, field1: 10, field2: 20, field3: 30, coordinates: [0, 0] },
    { id: 2, field1: 15, field2: 25, field3: 35, coordinates: [1, 1] },
    // Add more sample data as needed
  ];

  // Features and their descriptions
  const features = [
    { name: 'Flow Rate Calculation', description: 'Calculate and update flow rates in the pipeline.' },
    { name: 'Pressure Drop Calculation', description: 'Estimate pressure drops across the pipeline network.' },
    { name: 'Pipeline Length Calculation', description: 'Calculate the length of the pipeline based on two coordinates.' },
    { name: 'Cost Calculation', description: 'Estimate the cost of the pipeline based on length and user-defined cost per unit length.' },
    // Add more features and descriptions as needed
  ];

  // Event handler for calculation
  const handleCalculate = () => {
    try {
      // Validate inputs
      if (!expression || !selectedField) {
        throw new Error('Please enter a valid expression and select a field.');
      }

      // Sample calculation logic (basic arithmetic operations)
      const calculatedValues = sampleGisLayer.map((feature) => {
        const result = eval(expression); // Using eval for simplicity (consider alternatives for security)
        return { ...feature, [selectedField]: result };
      });

      // Update the GIS layer or perform other relevant actions
      console.log('Calculated Values:', calculatedValues);

      // For demonstration purposes, update the result state
      setResult('Calculation successful!');
    } catch (error) {
      // Handle errors
      console.error('Calculation Error:', error.message);
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="field-calculator-container">
      <div className="field-calculator">
        <h2>Field Calculator</h2>

        {/* Input field for mathematical expression */}
        <label>
          Expression:
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
          />
        </label>

        {/* Dropdown for selecting the field */}
        <label>
          Select Field:
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {/* Replace the options with your actual field names */}
            <option value="field1">Field 1</option>
            <option value="field2">Field 2</option>
            <option value="field3">Field 3</option>
          </select>
        </label>

        {/* Button to trigger the calculation */}
        <button onClick={handleCalculate}>Calculate</button>

        {/* Display the result */}
        {result && <div className="result">{result}</div>}
      </div>

      {/* Features and descriptions on the right side */}
      <div className="feature-list">
        <h3>Features</h3>
        <ul>
          {features.map((feature, index) => (
            <li key={index} title={feature.description}>
              {feature.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FieldCalculator;
