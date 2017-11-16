import * as d3 from 'd3';
let colBarChart = function () {
	
      var margin = {top: 25, right: 0, bottom: 0, left: 5}
      	, width = null
      	, height = null
        , columnNames = null
      	, fillColor = "rgba(51,192,205,1)"
        , negValColor = "#EF5350"
        , fillBack = true
        , fillBackColor = "rgba(155,155,155,0.1)"
      	, barHeight = 8
        , labels = true
        , lablePosX = "right"  // left
        , lablePosY = "top"  // center, bottom
      	, numberFormat = "percent" // percent, byMax, d3 format
      	, maxValue = 100
       	, xScale = d3.scaleLinear()
        , yScale = d3.scaleLinear()
        , xValue = function(d) { return d[columnNames.count];}
        , yValue = function(d) { return d[columnNames.category];}
        , autoResize = false
        , colBarChartParentDiv
        ;


        function chart (selection) {
        	colBarChartParentDiv = selection;
            colBarChartParentDiv.each(function(data) { 
                if (data.length === 0)
                {
                    //console.error("No data available");
                    return;
                }
                try {
                    render(this, data);
                }
                catch (e){ return ;}
                    
        	 });

            if(autoResize)
            {
                //advCharts.throttle("resize", "optimizedResize");
                //window.addEventListener("optimizedResize", chart.resize);
            }
        	
        }

        function render(selection, data){
            

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


            var leftPadding = width*0.3,
            rightPadding = width*0.05,
            dataLength = Math.max(data.length,5);
            
            barHeight = height / dataLength - height*0.11;
            margin = {top: (1/dataLength)*height*0.65, right:10, bottom: 0, left:5};

            //data.forEach(function(d) { d[columnNames.count] = +d[columnNames.count]; });

            data.sort( srt({key:columnNames.count,string:false}, true) );

            xScale
                .domain([0,maxValue])
                .range([0, width - margin.left - margin.right -rightPadding-leftPadding]);

            yScale
                .domain([0, data.length])
                .range([0, height - margin.top - margin.bottom]);

            d3.select(selection).selectAll('svg').remove();
            d3.select(selection).selectAll('g').remove();
            var root
            if(selection.nodeName !== 'svg' )
            {
                root = d3.select(selection)
                            .append("svg")
                            .attr('width', width)
                            .attr('height', height);
            }
            else {
                root = d3.select(selection)
                        .attr('width', width)
                        .attr('height', height);
            }

            var svg = root.append('g')
                          .attr('transform','translate('+margin.left+','+margin.top+')');

            var barGroup = svg.append('g')
                                .attr('transform','translate('+leftPadding+','+0+')');

            var group = barGroup.selectAll('.advCharts.adv-colbar')
                            .data(data)
                            .enter()
                            .append("rect")
                                .attr('class',"advCharts adv-colbar")
                                .attr('x', 0)
                                .attr('y', function(d, i) { return yScale(i); })
                                .attr('width',function(d) { 
                                    return  d[columnNames.count] < 0 ? xScale(-d[columnNames.count]): xScale(d[columnNames.count]); 
                                })
                                .attr('height', barHeight)
                                .style('fill', function(d) { return d[columnNames.count] < 0 ? negValColor : fillColor ; });

            if(fillBack)
            {
                
                barGroup.selectAll('.advCharts.adv-colBackBar')
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr('class',"advCharts adv-colBackBar")
                        .attr('x',0)
                        .attr('y', function(d, i) { return yScale(i); })
                        .attr('width', xScale(maxValue))
                        .attr('height', barHeight)
                        .style('fill', fillBackColor);
                    
            }

           barGroup.selectAll('.advCharts.colBar.dataLabel')
                    .data(data)
                    .enter()
                    .append('text')
                        .attr('x', xScale(maxValue)-18)
                        .attr('y', function(d, i) { return yScale(i) + barHeight*0.85; })
                        .attr('class', 'advCharts colBar dataLabel')
                        .attr('text-align', 'end')
                        .text(dataLabel(numberFormat));


            svg.selectAll('.advCharts.colBar.yAxisLabel')
                    .data(data)
                    .enter()
                    .append('text')
                        .attr('x', 5)
                        .attr('y', function(d, i) { return yScale(i) + barHeight*0.85; })
                        .attr('class', 'advCharts colBar yAxisLabel')
                        .attr('text-align', 'end')
                        .text(function(d) { return d[columnNames.category]; });

            /* svg.append('line')
                .attr('x1', width*0.35 )
                .attr('y1', -margin.top)
                .attr('x2', width*0.55)
                .attr('y2', -margin.top)
                .style('stroke', '#000'); */
        }

        function srt(on,descending) {
             on = on && on.constructor === Object ? on : {};
             return function(a,b){
               if (on.string || on.key) {
                 a = on.key ? a[on.key] : a;
                 a = on.string ? String(a).toLowerCase() : a;
                 b = on.key ? b[on.key] : b;
                 b = on.string ? String(b).toLowerCase() : b;
                 // if key is not present, move to the end 
                 if (on.key && (!b || !a)) {
                  return !a && !b ? 1 : !a ? 1 : -1;
                 }
               }
               return descending ? ~~(on.string ? b.localeCompare(a) : a < b)
                                 : ~~(on.string ? a.localeCompare(b) : a > b);
              };
        }

        function dataLabel(numberFormat) {

            var format, labelValue;
            if(numberFormat === "percent")
            {
                format = d3.format("%");
                labelValue = function(d) { return format(d[columnNames.count]/maxValue); };
                return labelValue;
            }

            else if(numberFormat === "byMax")
            {
                labelValue = function(d) {
                        return d[columnNames.count].toString() + "/" + maxValue.toString(); 
                    };
                return labelValue;
            }

            else if(numberFormat === "value")
            {
                labelValue = function(d) { return d[columnNames.count]; };
                return labelValue;
            }

            else
            {
                format = d3.format(numberFormat);
                labelValue = function(d) { return format(d[columnNames.count]); };
                return labelValue;
            }

        }


        chart.margin = function (_) {
        	if(!arguments.length) return margin;
        	if(_ !== undefined) margin = _;
        	return chart;
        }

        chart.width = function (_) {
        	if(!arguments.length) return width;
        	if(_ !== undefined) width = _;
        	return chart;
        }

        chart.height = function (_) {
        	if(!arguments.length) return height;
        	if(_ !== undefined) height = _;
        	return chart;
        }

        chart.fillColor = function (_) {
        	if(!arguments.length) return fillColor;
        	if(_ !== undefined) fillColor = _;
        	return chart;
        }

        chart.negValColor = function (_) {
        	if(!arguments.length) return negValColor;
        	if(_ !== undefined) negValColor = _;
        	return chart;
        }

        chart.fillBack = function (_) {
        	if(!arguments.length) return fillBack;
        	if(_ !== undefined) fillBack = _;
        	return chart;
        }

        chart.fillBackColor = function (_) {
        	if(!arguments.length) return fillBackColor;
        	if(_ !== undefined) fillBackColor = _;
        	return chart;
        }

        chart.barHeight = function (_) {
        	if(!arguments.length) return barHeight;
        	if(_ !== undefined) barHeight = _;
        	return chart;
        }

        chart.numberFormat = function (_) {
        	if(!arguments.length) return numberFormat;
        	if(_ !== undefined) numberFormat = _;
        	return chart;
        }

        chart.maxValue = function (_) {
        	if(!arguments.length) return maxValue;
        	if(_ !== undefined) maxValue = _;
        	return chart;
        }

        chart.labels = function (_) {
            if(!arguments.length) return labels;
            if(_ !== undefined) labels = _;
            return chart;
        }

        chart.lablePosX = function (_) {
            if(!arguments.length) return lablePosX;
            if(_ !== undefined) lablePosX = _;
            return chart;
        }

        chart.lablePosY = function (_) {
            if(!arguments.length) return lablePosY;
            if(_ !== undefined) lablePosY = _;
            return chart;
        }

        chart.columnNames = function (_) {
            if(!arguments.length) return columnNames;
            if(_ !== undefined) columnNames = _;
            return chart;
        }

        chart.autoResize = function (_) {
            if(!arguments.length) return autoResize;
            if(_ !== undefined) autoResize = _;
            return chart;
        }

        chart.resize = function () {
            //console.log("resize triggered");
            if(colBarChartParentDiv !== undefined)
            {
                colBarChartParentDiv.each(function(data) {
                    d3.select(this).selectAll('svg').remove();
                    if(data.length == 0) { return; }
                    render(this, data);    
                });
            }
        };

        return chart;


}

export default colBarChart;