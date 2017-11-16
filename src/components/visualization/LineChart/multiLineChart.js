import * as d3 from 'd3';
import colorbrewer from '../../../core/utils/colorbrewer'
/* 
 
 DO: Shape Config, Category Box Config, Alternate Bands, Bar Chart, Sorting, Sequential Color, Legend, Text Overflow, Chart ToolTip, Diverging Color with Threshold, Categorical Colors (30)

 Event Colors: Blue, Orange, Green, Purple , Red, Grey, Pink, Amber, Indigo, Cyan, Deep Orange, Teal, Blue Grey, Brown, Deep Purple, Light Green, Lime

 Good Colorbrewer Range Values GnBu[6], PuBu[7], BuPu[7], Blues[7], YlGnBu[7], Oranges[8], Greys[7], OrRd[8]

*/

let multiLineChart = function () {
	
      var margin = { top: 10, right: 10, bottom: 10, left: 10 }
      	, chartWidth
      	, chartHeight
        , columnNames  = { "eventType": "", "time": "", "eventCnt": "" }
        , tooltipColumns
        , timeLevel = "hour" // "min , day"
        , lineWidth = 1
        , xScale = d3.scaleTime()
        , yScale = d3.scaleLinear()
        , xAxis = d3.axisBottom(xScale)
        , yAxis = d3.axisLeft(yScale)
        , lineColors
        , bandColor = "#F0F0F0"
        , bandStroke = false
        , line = d3.line().x(X).y(Y)
        , bands = false
        , legend = false
        , legendTitle = ""
        , legendParentDiv
        , heatmapParentDiv
        , heatmapdata
        , nest_data
        , heatmapTooltip
        , autoResize = false
        , axisFont = "1.5vmin"
        , axisLines = true
        , axisTransY = margin.top*1.6
        ;

        function chart (selection) {
        	selection.each(function(data) { 

                if ((data.length === 0 || columnNames === undefined) && eventTypes === undefined)
                {
                    console.error("No data available");
                    return;
                }

                try
                {
                    if (this.nodeName !== 'svg' )
                    {
                        if (this.id === undefined || this.id === "") { this.id = "advChartsHeatmap" ;}
                        heatmapParentDiv = "#"+ selection.attr('id');
                    }
                    else {
                        if (this.parentNode.id === undefined || this.id === "") { this.parentNode.id = "advChartsHeatmap" ;}
                        heatmapParentDiv = "#"+ this.parentNode.id;
                    }
                    

                    /* heatmapTooltip = (advCharts.tooltip()
                               .chartContainer(selection.attr('id')) //Chart container ID
                               .element('advChartsHeatmapTooltipBox') //Tooltip Unique ID
                               .enabled(true)   //to enable/Disable
                               .positionFX('fixed')  //can be either Fixed or Absolute
                               .offset(false)
                               )(); */

                    heatmapdata = data;

                    nest_data = d3.nest()
                        .key(function(d) { return d[columnNames.eventType]; })
                        .entries(data);
            
                    yScale
                        .domain(d3.extent(data, function(d) { return d[columnNames.eventCnt]; }))
                        .range([height, 0]);

                    render(heatmapParentDiv);
                    createLegend(legendParentDiv);
                }
                catch (e) { 
                    console.error(e);
                    return ;
                }

                

        	 });

            if (autoResize)
            {
                //advCharts.throttle("resize", "optimizedResize");
                //window.addEventListener("optimizedResize", chart.resize);
            }	
        }

        function render(selection){
            

            if (chartWidth <=0 || chartWidth === undefined || chartHeight <= 0 || chartHeight === undefined )
            {
              try { var parent = d3.select(selection).node().getBoundingClientRect(); } 
              catch (e) { 
                //console.log(e); 
                return; 
              }
              chartWidth = parent.width ;
              chartHeight = parent.height ;
                        
              if ((chartHeight <= 0 || chartHeight === undefined) || (chartWidth <= 0 || chartWidth === undefined)) { 
                //console.log("Width, Height is Zero or Undefined") ; 
                return; }
            }

            var //posProp = getPosProperties(chartWidth, chartHeight),
            //margin = { top: posProp.topMargin, right: chartWidth*0.03, bottom: chartHeight*0.03, left: chartWidth*0.02 },
            width = chartWidth,
            height = chartHeight - margin.bottom;

            
            var timeHeight = height*0.055;
            var eventsWidth = width - margin.left - margin.right ;
            var timeY = margin.top ;
    


            var eventDomain = d3.extent(heatmapdata, function(d) { return +d[columnNames.eventCnt]; });
            eventDomain[0] = eventDomain[0] == 0? 1: eventDomain[0];

            xScale
                .domain([startTime, endTime])
                .range([0, eventsWidth*0.96]);

            var axisTickSize = axisLines? -timeY+7 : -1;

            xAxis
                .tickSize(axisTickSize)
                .tickPadding(10)
                .tickFormat(timeFormat());

            //if(timeLevel == "day") {  timeDataRows < 12? xAxis.ticks(d3.time.days,1): xAxis.ticks(d3.time.days,3) ; }

            d3.select(selection).select("svg").selectAll('*').remove();

            var container;
            if (d3.select(selection).select("svg").node().nodeName === 'svg' )
            {
                container = d3.select(selection).select("svg")
                .attr('width',width)
                .attr('height',height); 
            }
            else {
                container = d3.select(selection)
                .append("svg")
                .attr('width',width)
                .attr('height',height);
            }

            var svg =   container.append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

           /*  var axis = svg.append('g')
                            .attr("class", "advCharts adv-xAxis")
                            .attr("transform", "translate(" + (margin.left + blockWidth + eventsPadding)  + ", " + (axisTransY) + ")")
                            .call(xAxis);

            d3.selectAll('.advCharts.adv-xAxis text ').style('font-size', axisFont);
                        
            var box = svg.selectAll(".advCharts.adv-heatmapBlocks").data(nest_data).enter()
                        .append('g')
                            .attr('class', "advCharts adv-heatmapBlocks" )
                            .attr('transform', function(d,i) { 
                            return 'translate(' + 0 + ',' + i*(blockHeight+blockPadding) + ')'; });

            if (bands) {
                var bandBox = box.append('rect')
                                    .attr('class', 'advCharts adv-event-band')
                                    .attr('x', 10 )
                                    .attr('y', 10)
                                    .attr('width', width - margin.left - margin.right)
                                    .attr('height', blockHeight)
                                    .style('fill', function(d,i) { return (i+1)%2? bandColor : "rgba(255,255,255,0.5)";});

                if (bandStroke)
                {
                    bandBox
                        .style('stroke', "#dedede")
                        .style('stroke-width', function(d,i) { return (i+1)%2? '0.8px' : '0px';})
                        .style('stroke-dasharray', '3 3');
                }

                svg.append('line')
                    .attr('x1', 10)
                    .attr('y1', 0)
                    .attr('x2', 10)
                    .attr('y2', (blockHeight+blockPadding)* (nest_data.length+1))
                    .style('stroke', "rgba(151,151,151,0.5)")
                    .style('stroke-width', '0.8px');

                svg.append('line')
                    .attr('x1', 10 + blockWidth)
                    .attr('y1', 0)
                    .attr('x2', 10 + blockWidth)
                    .attr('y2', (blockHeight+blockPadding)* (nest_data.length+1))
                    .style('stroke', "rgba(151,151,151,0.2)")
                    .style('stroke-width', '0.8px');
            } */

            if (showTimeChart)
            {
                var lable3 = "Total Events / Time";
                var label3PosY = margin.top + timeY + timeHeight/2 ; //+ posProp.timeChartLabelPosY;
                var label3PosX = margin.left+blockWidth*0.4 - lable3.length;
                //label(container, lable3 ,label3PosX ,label3PosY, 0, "advCharts adv-heatmapLabel");
                timeChart(svg, nest_data, height, width, margin.left, margin.top);
            }
        
                
    }

    function createLegend(){
        if (legend & legendParentDiv !== undefined)
        {
            /* var posX = (legendPos == null || legendPos == undefined) ? width/3 : legendPos;
            
            root.append("g")
            .attr("class", "advCharts multiBarChart legend")
            .attr('transform', 'translate(' + posX  + ',' + 0 + ')');

            var legendOrdinal = legend.legendColor()
            .shape("rect")
            .shapePadding(legendPadding)
            .orient("horizontal")
            .labelAlign("start")
            .scale(color);
                    
            root.select(".advCharts.multiBarChart.legend")
            .call(legendOrdinal);

            root.select(".advCharts.multiBarChart.legend")
            .selectAll("text")
            .attr('transform', 'translate(' + 20  + ',' + 13 + ')'); */
        }
                
    }

    function getTooltipData(d){

        var tooltipdata = { "Type": d[columnNames.eventType], "Time": timeFormat(new Date(d[columnNames.time])), "Events": numberFormat(d[columnNames.eventCnt],0) } ;
        return tooltipdata;
        
    }

    function timeDiff(start,end){
        var days = Math.floor((end-start)/timeDivider("day")),
            hours = Math.floor((end-start)/timeDivider("hour") - 24*days),
            min = Math.floor((end-start)/timeDivider("min") - hours*60 - days*24*60);
        return { "days": days, "hours": hours, "min": min };
    }

    function timeChart(selection, data, height, width, posX, posY){

        var timeLine = selection.append('g')
                                .attr("class", "advCharts adv-timeLine")
                                .attr("transform", "translate(" + posX  + ", " + posY + ")");

            x1Scale
                //.domain(d3.extent(data, function(d) { return d.key; }))
                .domain([startTime + timeDivider(timeLevel), endTime])
                .range([0, width]);

            y1Scale
                .domain([0, d3.max(data, function(d) { return d.values; })])
                .range([height,0]);

            /* timeLine.append('rect')
                .attr('class', 'timeLineBorder')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('stroke', '#E0DCDC')
                .style('stroke-width', '0.5px');*/

            var lineChart = timeLine.append("path")
                                    .datum(data)
                                    .attr('class',"line")
                                    .attr('d', line)
                                    .style('stroke', lineColor)
                                    .style('stroke-width', lineWidth)
                                    .style('fill', 'none');

            /*  var areaChart = timeLine.append("path")
                                        .datum(data)
                                        .attr('class',"area")
                                        .attr('d', area.y0(y1Scale.range()[0]))
                                        .style('fill', fillColor); */

    }

  

    function label(selection, text, posX, posY, rotation, cssClass) {

        if (rotation === -90)
        {
            posY += text.length*2.5;
        }
        selection.append('text')
            .attr('class', cssClass)
            .attr('text-align', 'center')
            .attr('transform', "translate(" + posX + "," + posY + ")  rotate(" + rotation + ")")
            .text(text);
    }

    function timeFormat(value){ 

        var format, value = value || -1;

        if (timeLevel==="hour")
        {
            format = d3.timeFormat("%-I %-p");

        }
        else if (timeLevel==="min")
        {
            format = d3.timeFormat("%-H:%-M");
        }
        else if (timeLevel==="day")
        {
            format = d3.timeFormat("%-d/%-m");
        }

        if (value === -1)
            {return format;}
        else
            {return format(value);}             
                
    }

    var numberFormat = function (num, fixed) {
   
      var fmt = d3.format('.' + fixed + 'f');
      if (num < 1000) {
          return (isInteger(num)? num: fmt(num));
      } else if (num < 10000000) {
          var val = num / 1000;
          return (isInteger(val)? val: fmt(val)) + 'K';
      } else if (num < 1000000000) {
          var val = num /1000000;
          var formatVal = (isInteger(val)? val: fmt(val));
          return (isInteger(val)? val: fmt(val)) + 'M';
      } else if (num < 1000000000000) {
          var val = num /1000000000;
          return (isInteger(val)? val: fmt(val)) + 'B';
      }
    };

    var isInteger = function(value) {
      var integerType =  typeof value === 'number' && 
        isFinite(value) && 
        Math.floor(value) === value;
        return integerType;
    };
   

    function X(d) { return x1Scale(d.key);}
    function Y(d) { return y1Scale(d.values);}

    function resizeChart(selection){
        if (selection !== undefined && nest_data !== undefined && heatmapdata !== undefined && timePaddedData !== undefined)
        {
            d3.select(heatmapParentDiv).selectAll('svg').remove();
            d3.select(legendParentDiv).selectAll('svg').remove();
            render(selection);
            createLegend();
        }
    };

    chart.margin = function (_) {
    	if (!arguments.length) {return margin;}
    	if (_ !== undefined){ margin = _ ;}
    	return chart;
    };

    chart.width = function (_) {
    	if (!arguments.length) {return chartWidth;}
    	if (_ !== undefined){ chartWidth = _;}
    	return chart;
    };

    chart.height = function (_) {
    	if (!arguments.length) {return chartHeight;}
    	if (_ !== undefined){ chartHeight = _;}
    	return chart;
    };

    chart.columnNames = function (_) {
        if (!arguments.length) {return columnNames;}
        if (_ !== undefined){ columnNames = _;}
        return chart;
    };

    chart.timeLevel = function (_) {
        if (!arguments.length) {return timeLevel;}
        if (_ !== undefined){ timeLevel = _;}
        return chart;
    };

    chart.startTime = function (_) {
        if (!arguments.length) {return startTime;}
        if (_ !== undefined){ startTime = _;}
        return chart;
    };

    chart.endTime = function (_) {
        if (!arguments.length) {return endTime;}
        if (_ !== undefined){ endTime = _;}
        return chart;
    };


    chart.bands = function (_) {
        if (!arguments.length) {return bands;}
        if (_ !== undefined){ bands = _;}
        return chart;
    };

    chart.colorScheme = function (_) {
        if (!arguments.length) {return colorScheme;}
        if (_ !== undefined){ colorScheme = _;}
        return chart;
    };

    chart.colorbrewerRange = function (_) {
        if (!arguments.length) {return colorbrewerRange;}
        if (_ !== undefined){ colorbrewerRange = _;}
        return chart;
    };

    chart.eventColors = function (_) {
        if (!arguments.length) {return eventColors;}
        if (_ !== undefined){ eventColors = _;}
        return chart;
    };

    chart.lineColor = function (_) {
        if (!arguments.length) {return lineColor;}
        if (_ !== undefined){ lineColor = _;}
        return chart;
    };

    chart.lineWidth = function (_) {
        if (!arguments.length) {return lineWidth;}
        if (_ !== undefined){ lineWidth = _;}
        return chart;
    };

    chart.fillColor = function (_) {
        if (!arguments.length) {return fillColor;}
        if (_ !== undefined){ fillColor = _;}
        return chart;
    };


    chart.legend = function (_) {
        if (!arguments.length) {return legend;}
        if (_ !== undefined){ legend = _;}
        return chart;
    };

    chart.legendParentDiv = function (_) {
        if (!arguments.length) {return legendParentDiv;}
        if (_ !== undefined){ legendParentDiv = _;}
        return chart;
    };

    chart.legendTitle = function (_) {
        if (!arguments.length) {return legendTitle;}
        if (_ !== undefined){ legendTitle = _;}
        return chart;
    };

    chart.bins = function (_) {
        if (!arguments.length) {return bins;}
        if (_ !== undefined){ bins = _;}
        return chart;
    };

    chart.colorReverse = function (_) {
        if (!arguments.length) {return colorReverse;}
        if (_ !== undefined){ colorReverse = _;}
        return chart;
    };

    chart.autoResize = function (_) {
        if (!arguments.length) {return autoResize;}
        if (_ !== undefined){ autoResize = _;}
        return chart;
    };

    chart.showTimeChart = function (_) {
        if (!arguments.length) {return showTimeChart;}
        if (_ !== undefined){ showTimeChart = _;}
        return chart;
    };

    chart.bandColor = function (_) {
        if (!arguments.length) {return bandColor;}
        if (_ !== undefined){ bandColor = _;}
        return chart;
    };

    chart.bandStroke = function (_) {
        if (!arguments.length) {return bandStroke;}
        if (_ !== undefined){ bandStroke = _;}
        return chart;
    };

    chart.axisLines = function (_) {
        if (!arguments.length) {return axisLines;}
        if (_ !== undefined){ axisLines = _;}
        return chart;
    };

    chart.axisFont = function (_) {
        if (!arguments.length) {return axisFont;}
        if (_ !== undefined){ axisFont = _;}
        return chart;
    };

    chart.axisTransY = function (_) {
        if (!arguments.length) {return axisTransY;}
        if (_ !== undefined){ axisTransY = _;}
        return chart;
    };

    chart.resize = function () {
        //console.log("resize Triggered");
        resizeChart(heatmapParentDiv);
    };
       
    chart.dispatch = dispatch;

    return chart;

};

export default multiLineChart;
