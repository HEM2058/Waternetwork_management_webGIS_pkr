import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Elevation.css';

function Elevation({ elevation_data }) {
  const chartContainer = useRef(null);
console.log(elevation_data)
useEffect(() => {
    if (elevation_data && elevation_data.elevation_data && elevation_data.elevation_data.length > 0) {
      console.log('Elevation data received:', elevation_data);
  
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
  
      console.log('Width:', width);
      console.log('Height:', height);
  
      // Calculate the minimum and maximum elevation values
      const minElevation = d3.min(elevation_data.elevation_data, d => d.elevation);
      const maxElevation = d3.max(elevation_data.elevation_data, d => d.elevation);
  
      console.log('Min Elevation:', minElevation);
      console.log('Max Elevation:', maxElevation);
  
      const svg = d3.select(chartContainer.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
      const x = d3.scaleLinear()
        .domain([0, elevation_data.elevation_data.length - 1])
        .range([0, width]);
  
      const y = d3.scaleLinear()
        .domain([minElevation, maxElevation])
        .range([height, 0]);
  
      console.log('X scale:', x);
      console.log('Y scale:', y);
  
      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.elevation));
  
      console.log('Line function:', line);
  
      svg.append('path')
        .datum(elevation_data.elevation_data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('d', line);
  
      console.log('Path added');
  
      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
      console.log('X-axis added');
  
      svg.append('g')
        .call(d3.axisLeft(y));
  
      console.log('Y-axis added');
  
      return () => {
        d3.select(chartContainer.current).selectAll('*').remove();
        console.log('Chart cleanup');
      };
    } else {
      console.log('No elevation data');
    }
  }, [elevation_data]);
  
  
  return (
    <div className="elevation-chart-container" ref={chartContainer}></div>
  );
}

export default Elevation;
