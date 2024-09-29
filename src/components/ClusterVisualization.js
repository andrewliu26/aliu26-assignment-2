import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ClusterVisualization({ data, centroids, assignments, onManualClick, style }) {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const width = 500;
        const height = 500;
        const padding = 20; // Padding to prevent clipping on the edges

        const xScale = d3.scaleLinear()
            .domain([0, 1]) // Keep the domain from 0 to 1 (for normalized data)
            .range([padding, width - padding]); // Apply padding to prevent clipping

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([padding, height - padding]);

        // Draw data points
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', 5) // Radius of data points
            .attr('fill', (d, i) => assignments[i] !== -1 ? d3.schemeCategory10[assignments[i]] : 'black');

        // Draw centroids
        svg.selectAll('rect')
            .data(centroids)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d[0]) - 8) // Increased size for better visibility
            .attr('y', d => yScale(d[1]) - 8)
            .attr('width', 12) // Increased width
            .attr('height', 12) // Increased height
            .attr('fill', (d, i) => d3.schemeCategory10[i])
            .attr('stroke', 'white') // Add black stroke to differentiate
            .attr('stroke-width', 2); // Stroke width to make centroids stand out

        // Handle manual centroid selection
        if (onManualClick) {
            svg.on('click', function (event) {
                const [x, y] = d3.pointer(event);
                const scaledX = xScale.invert(x);
                const scaledY = yScale.invert(y);
                onManualClick(scaledX, scaledY);
            });
        } else {
            svg.on('click', null); // Disable click when not in manual mode
        }
    }, [data, centroids, assignments, onManualClick]);

    return <svg ref={ref} width={500} height={500} style={style}></svg>;
}
