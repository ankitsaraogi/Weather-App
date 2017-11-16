import * as d3 from 'd3';
let sparkline = function () {
	
      var margin = {top: 10, right: 10, bottom: 10, left: 10}
      	, width = undefined
      	, height = undefined
      	, lineColor = "#33C0CD"
      	, fill = false
      	, fillColor = "#c0d0f0"
      	, lineWidth = 1
      	, showMinMaxPoints = false
      	, minPointColor = "#f02020"
      	, maxPointColor = "#f02020"
      	, showStartEndPoints = false
      	, startPointColor = "#f08000"
      	, endPointColor = "#f08000"
        , highlightColor = "#f02020"
      	, pointRadius = 1.5
      	, normalBand = false
      	, normalColor = "#c0c0c0"
      	, referenceLine = false
      	, referenceColor = "f02020"
        , numberFormat = "number" // bytes
        , tooltip = false
        , tooltipPointerColor = "red"
      	, xScale = d3.scaleLinear()
        , yScale = d3.scaleLinear()
        , xValue = function(d) { return d[0];}
        , yValue = function(d) { return d[1];}
        , hValue = function(d) { return d[2];}
        , xDomain
        , yDomain
        , xRange
        , yRange
        , line = d3.line().x(X).y(Y)
        , area = d3.area().x(X).y1(Y)
        , sparklineParentDiv
        , autoResize = false
        ;

        function pointsData(xData, yData) {
            var minPoint = [ xData[yData.lastIndexOf(d3.min(yData))], d3.min(yData)],
            maxPoint = [ xData[yData.lastIndexOf(d3.max(yData))], d3.max(yData)],
            startPoint = [xData[0], yData[0]],
            endPoint = [xData[xData.length-1], yData[yData.length-1]]
                    
            return [minPoint, maxPoint, startPoint, endPoint];

        }

        function chart (selection) {
        	sparklineParentDiv = selection;
            sparklineParentDiv.each(function(data) { 

                if(data.length === 0)
                {
                    //console.error("No data available");
                    return;
                }
                try { 
                    render(this, data);
                } 
                catch(e) { 
                    //console.log(e); 
                    return; 
                }
        	 });

            if(autoResize)
            {
                //advCharts.throttle("resize", "optimizedResize");
                //window.addEventListener("optimizedResize", chart.resize);
            }
        }

        function render(selection, data) {

            if(width <=0 || width == undefined || height <= 0 || height == undefined )
            {
                try { var parent = d3.select(selection).node().getBoundingClientRect(); } 
                catch(e) { 
                    //console.log(e); 
                    return; 
                }
                width = parent.width ;
                height = parent.height ;
                
                if((height <= 0 || height === undefined) || (width <= 0 || width === undefined)) { 
                    //console.log("Sparkline Width, Height is Zero or Undefined") ; 
                    return; }
            }

            data = data.map(function(d, i) { 
                return [xValue.call(data,d,i), yValue.call(data,d,i), hValue.call(data,d,i)];
            });

            //console.log(data);

            xScale
                .domain(d3.extent(data, function(d){ return d[0]; }))
                .range([0, width - margin.left - margin.right]);

            yScale
                .domain([0, d3.max(data, function(d) { return d[1]; })])
                .range([height - margin.top - margin.bottom,0]);

            d3.select(selection).selectAll('svg').remove();
            d3.select(selection).selectAll('g').remove();
            var svg
            
            if(selection.nodeName !== 'svg' )
            {
                svg = d3.select(selection).selectAll("svg").data([data])
                        .enter()
                        .append("svg")
                            .attr('width', width)
                            .attr('height', height);
            }
            else {
                svg = d3.select(selection).data([data])
                        .attr('width', width)
                        .attr('height', height);
            }

            var group = svg.append("g")
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            group.append("path")
                    .attr('class',"advCharts sparkline")
                    .attr('d', line)
                    .style('stroke', lineColor)
                    .style('stroke-width', lineWidth)
                    .style('fill', 'none');

            if(fill)
            {
                group.append("path")
                    .attr('class',"advCharts sparklineArea")
                    .attr('d', area.y0(yScale.range()[0]))
                    .style('fill', fillColor);
            }

            if(showMinMaxPoints || showStartEndPoints)
            {
                
                var xData = data.map(function(d) { return d[0] });
                var yData = data.map(function(d) { return d[1] });
                var points = pointsData(xData, yData);

               if(showMinMaxPoints)
               {
                    group.append("circle")
                        .attr('class',"advCharts sparklineMin")
                        .attr('cx', xScale(points[0][0]))
                        .attr('cy', yScale(points[0][1]))
                        .attr('r', pointRadius )
                        .style('fill', minPointColor);


                    group.append("circle")
                        .attr('class',"advCharts sparklineMax")
                        .attr('cx', xScale(points[1][0]))
                        .attr('cy', yScale(points[1][1]))
                        .attr('r', pointRadius )
                        .style('fill', maxPointColor);
                }
                if(showStartEndPoints)
                {
                    group.append("circle")
                        .attr('class',"advCharts sparklineStart")
                        .attr('cx', xScale(points[2][0]))
                        .attr('cy', yScale(points[2][1]))
                        .attr('r', pointRadius )
                        .style('fill', startPointColor);


                    group.append("circle")
                        .attr('class',"advCharts sparklineEnd")
                        .attr('cx', xScale(points[3][0]))
                        .attr('cy', yScale(points[3][1]))
                        .attr('r', pointRadius )
                        .style('fill', endPointColor);
                }                    

            }


            /* Tooltip Code */
            if(tooltip)
            {
                var bisectX = d3.bisector(function(d) { return d[0]; }).left

                var focus = group.append("g")
                      .attr("class", "focus")
                      .style("display", "none");

                focus.append("circle")
                      .attr('class', "tipmarker")
                      .attr("r", 3)
                      .style('fill', 'none')
                      .style('stroke', tooltipPointerColor)
                      .style('stroke-width', '0.5px');

                /* focus.append('line')
                    .attr('x1', 0)
                    .attr('y1', -margin.top)
                    .attr('x2', 0)
                    .attr('y2', height/4)
                    .style('stroke', 'red')
                    .style('stroke-width', '0.5px'); */

                focus.append('text').attr('class', 'advCharts tooltip')
                    .attr('x', +10)
                    .attr('y', 3)
                    .attr('text-anchor', 'end')
                    .attr('dy', '.9em')
                    .attr('font-size',"10px")
                    .text("text");

                  svg.append("rect")
                      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                      .attr("class", "overlay")
                      .attr("width", width)
                      .attr("height", height)
                      .style('fill', 'none')
                      .style('pointer-events', 'all')
                      .on("mouseover", function() { focus.style("display", null); })
                      .on("mouseout", function() { focus.style("display", "none"); })
                      .on("mousemove", mousemove);

                  function mousemove() {
                    var x0 = xScale.invert(d3.mouse(this)[0]),
                        y0 = yScale.invert(d3.mouse(this)[1]),
                        i = bisectX(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = null;
                        if(d0 && d1)
                        {
                            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
                            focus.attr("transform", "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")");
                            focus.select("text").text(function() { 
                                //console.log(d[1], +calcUnits(d[1]));
                                return  numberFormat === "bytes" ? bytesToString(d[1]) : calcUnits(d[1]); 
                            });
                        }
                    
                  } 

            }

            showHighlights(data,group);

        }

        var showHighlights = function(data, selection) {

            var highlightData = data.filter(function(d) { return d[2] === true; });

                selection.selectAll('.advCharts.sparklineHighLights')
                        .data(highlightData)
                        .enter()
                        .append("circle")
                            .attr('class',"advCharts sparklineHighLights")
                            .attr('cx', function(d) { return xScale(d[0]); })
                            .attr('cy', function(d) { return yScale(d[1]); })
                            .attr('r', pointRadius )
                            .style('fill', highlightColor);

        }

        var bytesToString = function (bytes) {
   
            var fmt = d3.format('.0f');
            if (bytes < 1024) {
                return fmt(bytes) + ' B';
            } else if (bytes < 1024 * 1024) {
                return fmt(bytes / 1024) + ' KB';
            } else if (bytes < 1024 * 1024 * 1024) {
                return fmt(bytes / 1024 / 1024) + ' MB';
            } else if (bytes < 1024 * 1024 * 1024*1024) {
                return fmt(bytes / 1024 / 1024/1024) + ' GB';
            } else {
                return fmt(bytes / 1024 / 1024 / 1024 / 1024) + ' TB';
            }
        };

        var calcUnits = function(num){

            if(Math.abs(num)<1000)
                return parseFloat(num).toFixed(1);
            if(Math.abs(num)<10000000)
                return parseFloat(num/1000).toFixed(1)+'K';
            if(Math.abs(num)<1000000000)
                return parseFloat(num/1000000).toFixed(1)+'M';
            if(Math.abs(num)<1000000000000)
                return parseFloat(num/1000000000).toFixed(1)+'B';
                                    
        }; 

        var resTimeFormat = function(num){

            if(Math.abs(num)<1000)
                return parseFloat(num).toFixed(1);
            if(Math.abs(num)<59000)
                return parseFloat(num/1000).toFixed(1)+'S';
            if(Math.abs(num)<3540000)
                return parseFloat(num/60000).toFixed(1)+'M';
            if(Math.abs(num)<82800000)
                return parseFloat(num/360000).toFixed(1)+'H';
                                    
        }; 


        function X(d) { return xScale(d[0]);}
        function Y(d) { return yScale(d[1]);}

        chart.x = function(_) {
        	if(!arguments.length) return xValue;
        	if(_ !== undefined) xValue = _;
        	return chart;
        };

        chart.y = function(_) {
        	if(!arguments.length)  return yValue;
        	if(_ !== undefined) yValue = _;
        	return chart;
        };

        chart.h = function(_) {
            if(!arguments.length)  return hValue;
            if(_ !== undefined) hValue = _;
            return chart;
        };

        chart.margin = function (_) {
        	if(!arguments.length) return margin;
        	if(_ !== undefined) margin = _;
        	return chart;
        };

        chart.width = function (_) {
        	if(!arguments.length) return width;
        	if(_ !== undefined) width = _;
        	return chart;
        };

        chart.height = function (_) {
        	if(!arguments.length) return height;
        	if(_ !== undefined) height = _;
        	return chart;
        };

        chart.lineColor = function (_) {
        	if(!arguments.length) return lineColor;
        	if(_ !== undefined) lineColor = _;
        	return chart;
        };

        chart.fill = function (_) {
        	if(!arguments.length) return fill;
        	if(_ !== undefined) fill = _;
        	return chart;
        };

        chart.fillColor = function (_) {
        	if(!arguments.length) return fillColor;
        	if(_ !== undefined) fillColor = _;
        	return chart;
        };

        chart.lineWidth = function (_) {
        	if(!arguments.length) return lineWidth;
        	if(_ !== undefined) lineWidth = _;
        	return chart;
        };

        chart.showMinMaxPoints = function (_) {
        	if(!arguments.length) return showMinMaxPoints;
        	if(_ !== undefined) showMinMaxPoints = _;
        	return chart;
        };

        chart.minPointColor = function (_) {
        	if(!arguments.length) return minPointColor;
        	if(_ !== undefined) minPointColor = _;
        	return chart;
        };

        chart.maxPointColor = function (_) {
        	if(!arguments.length) return maxPointColor;
        	if(_ !== undefined) maxPointColor = _;
        	return chart;
        };

        chart.showStartEndPoints = function (_) {
        	if(!arguments.length) return showStartEndPoints;
        	if(_ !== undefined) showStartEndPoints = _;
        	return chart;
        };

        chart.startPointColor = function (_) {
        	if(!arguments.length) return startPointColor;
        	if(_ !== undefined) startPointColor = _;
        	return chart;
        };

        chart.endPointColor = function (_) {
        	if(!arguments.length) return endPointColor;
        	if(_ !== undefined) endPointColor = _;
        	return chart;
        };

        chart.highlightColor = function (_) {
        	if(!arguments.length) return highlightColor;
        	if(_ !== undefined) highlightColor = _;
        	return chart;
        };

        chart.pointRadius = function (_) {
        	if(!arguments.length) return pointRadius;
        	if(_ !== undefined) pointRadius = _;
        	return chart;
        };

        chart.normalBand = function (_) {
        	if(!arguments.length) return normalBand;
        	if(_ !== undefined) normalBand = _;
        	return chart;
        };

        chart.normalColor = function (_) {
        	if(!arguments.length) return normalColor;
        	if(_ !== undefined) normalColor = _;
        	return chart;
        };

        chart.referenceLine = function (_) {
        	if(!arguments.length) return referenceLine;
        	if(_ !== undefined) referenceLine = _;
        	return chart;
        };

        chart.referenceColor = function (_) {
        	if(!arguments.length) return referenceColor;
        	if(_ !== undefined) referenceColor = _;
        	return chart;
        };

        chart.numberFormat = function (_) {
            if(!arguments.length) return numberFormat;
            if(_ !== undefined) numberFormat = _;
            return chart;
        };

        chart.tooltip = function (_) {
            if(!arguments.length) return tooltip;
            if(_ !== undefined) tooltip = _;
            return chart;
        };

        chart.autoResize = function (_) {
            if(!arguments.length) return autoResize;
            if(_ !== undefined) autoResize = _;
            return chart;
        };

        chart.resize = function () {
            //console.log("resize triggered");
            if(sparklineParentDiv !== undefined)
            {
                sparklineParentDiv.each(function(data) {
                    d3.select(this).selectAll('svg').remove();
                    if(data.length === 0) { return; }
                    render(this, data);    
                });
            }
            
        };

        return chart;


}

export default sparkline;