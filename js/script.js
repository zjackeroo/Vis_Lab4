d3.csv('./data/wealth-health-2014.csv', d3.autoType).then(data=>{
    // console.log(data.columns, data[0]);

    d3.select('.chart').append('svg');

    console.log(d3.max(data));

    // tip = d3.tip().attr('class', 'd3-tip').html(function(d) {return d; });
    // visualViewport.call(tip)

    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d=>d.Income))
        .range([0, width]);
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d=>d.LifeExpectancy))
        .range([height, 0]);
    const colorScale = d3
        .scaleOrdinal(d3.schemeTableau10);
    const sizeScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d=>d.Population))
        .range([4, 20]);
    // console.log(xScale(data.Income));
    const legendFont = 10;

    const svg = d3.select('.chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.selectAll('.income')
        .data(data)
        .enter()
        .append('circle')
        // .attr('fill', 'cyan')
        .attr('fill', d=>colorScale(d.Region))
        .attr('class', 'income')
        .attr('stroke', 'black')
        .attr('opacity', 0.8)
        .attr('r', d=>sizeScale(d.Population))
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .on("mouseover", (event, d)=>{
            // console.log('over')
            const pos = d3.pointer(event, window);
            tooltip = d3.select('.tooltip')
                .style('display', 'block')
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style('top', pos[1] + "px")
                .style('left', pos[0] + "px")
                .style('background-color', 'darkgray')
                .style('color', 'white')
                .html(`<p style='font-size:14px;'>Country: ${d.Country} <br> Region: ${d.Region} <br> Population: ${d.Population} <br> Income: ${d.Income} <br> Life expectancy: ${d.LifeExpectancy}</p>`)
        })
        .on("mouseleave", (event, d)=>{
            // console.log('out')
            d3.select('.tooltip')
                .style('display', 'none');
        })
    
    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5, 's')

    svg.append('g')
        .attr('class', 'axis x-axis')
        .call(xAxis)
        .attr('transform', `translate(0, ${height})`)

    const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10)
    
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    
    xLabel = svg.append("text")
                    .attr('x', width - 20)
                    .attr('y', height - margin.bottom / 2) 
                    .attr('alignment-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .attr('font-size',15)
                    .text("Income")

    yLabel = svg.append("text")
                    .attr('x', margin.left + 30)
                    .attr('y', -10)
                    .attr('alignment-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 15)
                    .text("Life Expectancy");

    legend = svg.append("g")
                .attr("transform", 'translate(' + 0.8 * width + ',' + 
                (height - 2.3 * (colorScale.domain().length) * legendFont) + ')')
    
    legend.selectAll('rect')                     
        .data(colorScale.domain())                                   
        .enter()                                                
        .append('rect')                                            
        .attr('class', 'box')
        .attr("height", legendFont) 
        .attr("width", legendFont)
        .attr('x', -20)
        .attr('y', (d,i) => i * 1.8 * legendFont)
        .attr('fill', d => colorScale(d));

    legend.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr('x', legendFont - 15)
        .attr('y', (d,i) => 1 + i * 1.8 * legendFont)
        .attr('font-size', legendFont)
        .attr('text-anchor', 'beginning')
        .attr('alignment-baseline', 'hanging')
        .text(d => d);
    
})
