import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Elevation.css';

function Elevation({ elevation_data, onClose }) {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (elevation_data && elevation_data.elevation_data && elevation_data.elevation_data.length > 0) {
      const margin = { top: 20, right: 40, bottom: 50, left: 60 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const minElevation = d3.min(elevation_data.elevation_data, d => d.elevation);
      const maxElevation = d3.max(elevation_data.elevation_data, d => d.elevation);

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

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.elevation));

      svg.append('path')
        .datum(elevation_data.elevation_data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat((d, i) => `${i}`)) // Add x-axis label
        .selectAll('text')
        .attr('dy', '0.5em') // Add spacing between label and axis

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`)
        .text('Sample Location'); // Add x-axis label

      svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .attr('dx', '-0.5em') // Add spacing between label and axis

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${-margin.left + 10}, ${height / 2}) rotate(-90)`)
        .text('Elevation(meters)'); // Add y-axis label

      const closeButton = d3.select(chartContainer.current)
        .append('button')
        .text('Close')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('right', '10px')
        .on('click', onClose);

      return () => {
        d3.select(chartContainer.current).selectAll('*').remove();
      };
    }
  }, [elevation_data, onClose]);

  return (
    <div className="elevation-chart-container" ref={chartContainer}></div>
  );
}

export default Elevation;
