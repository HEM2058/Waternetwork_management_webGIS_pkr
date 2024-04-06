import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Intro.css';

function Intro() {
    const [issueData, setIssueData] = useState(null);
    const [taskData, setTaskData] = useState(null);

    useEffect(() => {
        // Fetch data for issues
        fetch('http://127.0.0.1:8000/api/location/issue-count/')
            .then(response => response.json())
            .then(data => setIssueData(data))
            .catch(error => console.error('Error fetching issue data:', error));

        // Fetch data for tasks
        fetch('http://127.0.0.1:8000/api/tasks/count')
            .then(response => response.json())
            .then(data => setTaskData(data))
            .catch(error => console.error('Error fetching task data:', error));
    }, []);

    useEffect(() => {
        if (issueData) {
            // Create pie chart for issues
            createPieChart('.issue-details', issueData.issue_counts);
        }
        if (taskData) {
            // Create pie chart for tasks
            createPieChart('.task-details', taskData.task_counts);
        }
    }, [issueData, taskData]);

    const createPieChart = (selector, data) => {
        const width = 150;
        const height = 150;
        const radius = Math.min(width, height) / 2;

        // Check if the pie chart already exists in the specified selector
        if (d3.select(selector + ' .pie-chart svg').empty()) {
            const svg = d3.select(selector + ' .pie-chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            const color = d3.scaleOrdinal()
                .domain(data.map(d => d.status || d.issue_type))
                .range(d3.schemeCategory10);

            const pie = d3.pie()
                .value(d => d.count);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            const arcs = svg.selectAll('arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc');

            arcs.append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.status || d.data.issue_type))
                .attr('class', 'pie-slice');

            // Add text with number in the middle of each arc
            arcs.append('text')
                .attr('transform', d => `translate(${arc.centroid(d)})`)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .text(d => d.data.count);

            // Add legends
            const legend = d3.select(selector + ' .legend');

            legend.selectAll('.legend-item')
                .data(data)
                .enter()
                .append('div')
                .attr('class', 'legend-item')
                .html(d => `
                    <span class="legend-color" style="background-color:${color(d.status || d.issue_type)}"></span>
                    <span class="legend-text">${d.status || d.issue_type}</span>
                `);
        }
    };

    return (
        <div className="intro-container">
            <div className="issue-details shadow">
                <span>Issues</span>
                <div className="pie-chart"></div>
                <div className="legend"></div>
            </div>
            <div className="task-details shadow">
                <span>Task Details</span>
                <div className="pie-chart"></div>
                <div className="legend"></div>
            </div>
        </div>
    );
}

export default Intro;
