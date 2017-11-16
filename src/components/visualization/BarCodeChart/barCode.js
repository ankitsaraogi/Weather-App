import * as d3 from 'd3';
import colorbrewer from '../../../core/utils/colorbrewer'
/* 
 
 DO: Shape Config, Category Box Config, Alternate Bands, Bar Chart, Sorting, Sequential Color, Legend, Text Overflow, Chart ToolTip, Diverging Color with Threshold, Categorical Colors (30)

 Event Colors: Blue, Orange, Green, Purple , Red, Grey, Pink, Amber, Indigo, Cyan, Deep Orange, Teal, Blue Grey, Brown, Deep Purple, Light Green, Lime

 Good Colorbrewer Range Values GnBu[6], PuBu[7], BuPu[7], Blues[7], YlGnBu[7], Oranges[8], Greys[7], OrRd[8]

*/

let barCode = function () {
	
      var margin = { top: 0, right: 10, bottom: 10, left: 10 }
      	, width = null
      	, height = null
        , columnNames  = { "time": "", "eventCnt": "" }
        , timeLevel = "hour" // "min , day"
        , xScale = d3.scaleTime()
        , yScale = d3.scaleLinear()
        , x1Scale = d3.scaleLinear()
        , circleSizeScale = d3.scaleLinear()
        , rectSizeScale = d3.scaleLinear()
        , y1Scale = d3.scaleLinear()
        , xAxis = d3.axisBottom(xScale)
        , colorbrewerRange = ["GnBu",6]
        , colorQScale = d3.scaleQuantize()
        , timeMultiple = function(timeLevel){ return timeLevel === "hour"? 24: timeLevel === "min"? 1: timeLevel === "day"? 7*24:0; }
        , timeDivider = function(timeLevel){ return timeLevel === "hour"? 1000* 60 * 60: timeLevel === "min"? 1000* 60: timeLevel === "day"? 1000* 60 * 60*24:1;}
        , endTime = +new Date()
        , startTime = endTime - timeMultiple(timeLevel) * 1000* 60 * 60
        , dispatch = d3.dispatch("advChartsBarCodeClick", "advChartsBarCodeDblClick")
        , shape = "rect" // circle
        , sizeEncoding = false
        , colorScheme = "sequential"
        , colorReverse = false
        , legend = false
        , bins = undefined
        , legendTitle = ""
        , legendSelection = []
        , legendParentDiv
        , barcodeParentDiv
        , barcodedata
        , nest_data
        , timePaddedData = []
        , timeDataRows
        , barcodeTooltip
        , autoResize = false
        , eventTypes
        , shapeMaxSize = -1
        , shapeMinSize = -1
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
                        if (this.id === undefined || this.id === "") { this.id = "advChartsBarcode" ;}
                        barcodeParentDiv = "#"+ selection.attr('id');
                    }
                    else {
                        if (this.parentNode.id === undefined || this.id === "") { this.parentNode.id = "advChartsBarcode" ;}
                        barcodeParentDiv = "#"+ this.parentNode.id;
                    }
                    

                    /* barcodeTooltip = (advCharts.tooltip()
                               .chartContainer(selection.attr('id')) //Chart container ID
                               .element('advChartsBarcodeTooltipBox') //Tooltip Unique ID
                               .enabled(true)   //to enable/Disable
                               .positionFX('fixed')  //can be either Fixed or Absolute
                               .offset(false)
                               )(); */

                    if (eventTypes !== undefined){
                       //console.log("Old data:", data);
                       data = dataPadding(data);
                       //console.log("New data:", data);
                    }

                    barcodedata = data;

                    var time_data = d3.nest()
                            .key(function(d) { return d[columnNames.time]; })
                            .sortKeys(d3.ascending)
                            .rollup(function(events) { return d3.sum(events, function(d) { return d[columnNames.eventCnt]; }); })
                            .entries(data);

                    // Created Time Padding wherever there are no events
                    timeDataRows = (endTime-startTime)/timeDivider(timeLevel);

                    for (var i = 0 ; i < timeDataRows; i++)
                    {
                        var padding = true;
                        for (var j =0; j < time_data.length; j++) {
                            var timeDiff = (startTime + (i+1) * timeDivider(timeLevel)) - parseInt(time_data[j].key);
                            if (timeDiff >= 0 && timeDiff < timeDivider(timeLevel)) {

                                timePaddedData[i] =  { "key": parseInt(time_data[j].key), "values":time_data[j].values };
                                padding = false;
                                break;
                            }
                        }
                        if (padding) {
                            timePaddedData[i] = { "key": (startTime + (i+1) * timeDivider(timeLevel)), "values": 0 };
                        }
                    }

                    //console.log(time_data);
                    //console.log(timePaddedData);
                    
                    //data.forEach(function(d, i) { d[columnNames.time] = new Date(d[columnNames.time]) ; });

                    nest_data = d3.nest()
                            .key(function(d) { return d[columnNames.eventType]; })
                            .entries(data);

                    //console.log(nest_data);

                    var colorDomain = [] ;
                    colorDomain.push(d3.min(data, function(d) { return +d[columnNames.eventCnt]; }));
                    colorDomain.push(d3.max(data, function(d) { return +d[columnNames.eventCnt]; }));
                    if (colorDomain[0] === 0){ colorDomain[0] = 1 ;}
                    if (colorDomain[1] === 1){ colorDomain[1] = 2 ;}
                    if (colorDomain[1] < bins) {colorbrewerRange[1] = colorDomain[1] <= 3 ? 3 : colorDomain[1];}


                    var colorRange;
                    
                    if (colorScheme === "sequential")
                    {
                        colorRange = colorbrewer[colorbrewerRange[0]][colorbrewerRange[1]+2] ;//.slice(1,10-colorbrewerRange[1]); //9-colorbrewerRange[1],9
                        colorRange = colorRange.slice(2,colorbrewerRange[1]+2);
                    }
                    else if (colorScheme == "diverging")
                    {
                        colorRange = colorbrewer[colorbrewerRange[0]][11].slice(5-Math.floor(colorbrewerRange[1]/2), 5 + Math.ceil(colorbrewerRange[1]/2));
                    }
                    
                    colorRange = colorReverse? colorRange.reverse() : colorRange ;

                    colorQScale
                        .domain(colorDomain)
                        .range(colorRange);

                    yScale
                        .domain(d3.extent(data, function(d) { return d[columnNames.eventCnt]; }))
                        .range([0,1]);

                    render(barcodeParentDiv);
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
            

            if (width <=0 || width == undefined || height <= 0 || height == undefined )
            {
              try { var parent = d3.select(selection).node().getBoundingClientRect(); } 
              catch (e) { 
                //console.log(e); 
                return; 
              }
              width = parent.width ;
              height = parent.height ;
                        
              if ((height <= 0 || height === undefined) || (width <= 0 || width === undefined)) { 
                //console.log("Width, Height is Zero or Undefined") ; 
                return; }
            }

            //var posProp = getPosProperties(width, height),
            //margin = { top: posProp.topMargin, right: width*0.03, bottom: height*0.03, left: width*0.02 },
            height = height - margin.bottom;
            
            
            var blockPadding = 0;
            var blockHeight =  height -margin.top - margin.bottom -12; //Math.min(((height- (nest_data.length-1)*blockPadding - margin.top -9 -height*0.08) / nest_data.length),60) ;
            var blockWidth = Math.min(width*0.2, 210);
            var eventsPadding = 0;
            var eventsPeriod = barcodedata.length/ nest_data.length;
            var eventsWidth = width - margin.left - margin.right - eventsPadding;
            var eventHeight = blockHeight-blockPadding;
            var eventWidth = eventsWidth/(timeDataRows) - eventsPadding ; 

            //console.log(eventsWidth,eventHeight, eventWidth, eventSpacing);
            //console.log(eventsWidth);

            var eventDomain = d3.extent(barcodedata, function(d) { return +d[columnNames.eventCnt]; });
            eventDomain[0] = eventDomain[0] == 0? 1: eventDomain[0];

            xScale
                .domain([startTime, endTime])
                .range([0, eventsWidth*0.96]);

            var maxCircleSpace = Math.min(eventHeight/2, eventsWidth/(2*timeDataRows));
            var minCircleSize = shapeMinSize !== -1 ? Math.min(shapeMinSize,maxCircleSpace) : 4;
            var maxCircleSize = shapeMaxSize !== -1 ? Math.min(shapeMaxSize,maxCircleSpace): maxCircleSpace;

            circleSizeScale
                .domain(eventDomain)
                .range([minCircleSize, maxCircleSize]);

            var minRectSize = shapeMinSize !== -1 ? Math.min(shapeMinSize,eventHeight) : 2;
            var maxRectSize = shapeMaxSize !== -1 ? Math.min(shapeMaxSize,eventHeight): eventHeight;

            var rectSizeRange = [eventHeight, 2] ;

            rectSizeScale
                .domain(eventDomain)
                .range(rectSizeRange);

            var axisTickSize =  3;

            xAxis
                .ticks(5)
                //.tickValues(["1AM", "12PM", "12AM"])
                .tickSize(axisTickSize)
                //.tickPadding(10)
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

            var axis = svg.append('g')
                            .attr("class", "advCharts adv-xAxis")
                            .attr("transform", "translate(" + (margin.left + eventsPadding)  + ", " + (height-margin.bottom-10) + ")")
                            .call(xAxis);

            d3.selectAll('.advCharts.adv-xAxis text ').style('font-size', axisFont);
                        
            var box = svg.selectAll(".advCharts.adv-barcodeBlocks").data(nest_data).enter()
                        .append('g')
                            .attr('class', "advCharts adv-barcodeBlocks" )
                            .attr('transform', function(d,i) { 
                            return 'translate(' + 0 + ',' + i*(blockHeight+blockPadding) + ')'; });

            box.append('rect')
                .attr('class', 'advCharts adv-event-block')
                .attr('x', 10 )
                .attr('y', 0)
                .attr('width', eventsWidth)
                .attr('height', blockHeight)
                .style('fill', function(d,i) { return "rgba(155,155,155,0.1)";});
            
            var g = box.append('g')
                    .attr('transform', 'translate(' + (eventsPadding) + ',' + 0 + ')');

           var eventShape;
           if (shape === "circle")
           {
                eventShape =  g.selectAll('circle').data(function(d) { return d.values;})
                .enter().append('circle')
                .attr('class', 'advCharts adv-event')
                .attr('cx', function(d, i) { return xScale(d[columnNames.time]) ; } )
                .attr('cy', eventHeight/2)
                .attr('r', function(d) { 
                    if (d[columnNames.eventCnt] == 0) { return 0; }
                    else { return sizeEncoding? circleSizeScale(d[columnNames.eventCnt]) : maxCircleSize;}
                });
            }
            else {

                eventShape =  g.selectAll('rect').data(function(d) { return d.values;})
                .enter().append('rect')
                .attr('class', 'advCharts adv-event')
                .attr('x', function(d, i) { return xScale(d[columnNames.time]) ; } )
                .attr('y', function(d) { return sizeEncoding? rectSizeScale(d[columnNames.eventCnt]) : 0;})
                .attr('width', eventWidth)
                .attr('height', function(d) { 
                    if (d[columnNames.eventCnt] == 0) { return 0; }
                    else { return sizeEncoding? eventHeight - rectSizeScale(d[columnNames.eventCnt]): maxRectSize; }
                });

            }
            
            if (colorScheme !== "qualitative")
            {
                eventShape.style('fill', function(d) { return colorQScale(d[columnNames.eventCnt]);});
            }
            else {
                eventShape
                    .style('fill', function(d, i) { return d3.select(this.parentNode).datum().eventColor; })
                    .style('opacity', function(d) { return yScale(d[columnNames.eventCnt]);});
            }

            eventShape
                //.style('cursor', function(d, i) { return +d[columnNames.eventCnt] !== 0 ? 'pointer': 'auto'; })
                .style('cursor', 'pointer')
                .on("mouseenter", function(d,i) { 
                    if (true)//+d[columnNames.eventCnt] !== 0)
                    {
                        var eventPos = d3.select(this).node().getBoundingClientRect();
                        //console.log(eventPos, d3.event.pageX, d3.event.pageY, tooltip.position());
                        var posX =  eventPos.left + eventPos.width, //d3.event.pageX ,
                            posY =  eventPos.top + eventPos.height*0.5; //d3.event.pageY + 10;
                        //barcodeTooltip.position({"left": posX, "top": posY}).data(getTooltipData(d)).show();
                    }
                })
                //.on("mouseleave", function(d) { barcodeTooltip.hide(); })
                .on("click", function(d, i) { 
                    var clickData = { "type": d[columnNames.eventType], "time": d[columnNames.time], "count": d[columnNames.eventCnt] };
                    dispatch.advChartsBarcodeEventClick(clickData);
                });
                //.on("dblclick", function(d, i) { dispatch.advChartsBarcodeEventDblClick(getTooltipData(d));});

            //window.addEventListener('scroll', function() { barcodeTooltip.hide() ;});

                
    }

    function createLegend() {

        if (legend & legendParentDiv !== undefined)
        {
            var nest_events = d3.nest()
                    .key(function(d) { return d[columnNames.eventCnt];})
                    .rollup(function(events) { return events.length; })
                    .entries(barcodedata);

            //console.log(nest_events);
            
            var eventRange = [];
            eventRange.push(d3.min(barcodedata, function(d) { return +d[columnNames.eventCnt]; }));
            eventRange.push(d3.max(barcodedata, function(d) { return +d[columnNames.eventCnt]; }));
            if (eventRange[0] == 0) { eventRange[0] = 1;}
            if (eventRange[1] == 1) { eventRange[1] = 2;}

            if (bins !== undefined && typeof(bins) !== "number")
            {

                var dataBins = advCharts.dataBins()
                    .bins(bins)
                    .range(eventRange)
                    .size(barcodedata.length)(nest_events);
            }
            else {

                var dataBins = [], total = 3,
                midVal = Math.round(((eventRange[1]-eventRange[0]) % 2 == 0 ? eventRange[1] : (eventRange[1]-eventRange[0]))/2);
                if (midVal < 1  || (eventRange[1] == 2)) { 
                    midVal = 1; total = eventRange[1] ; 
                    dataBins.push( { x2: eventRange[0] });
                    dataBins.push( { x2: eventRange[1] });
                }
                else {
                    dataBins.push( { x2: eventRange[0] });
                    dataBins.push( { x2: midVal });
                    dataBins.push( { x2: eventRange[1] });
                }
               
                
                

                /*var dataBins = advCharts.dataBins()
                    .range(eventRange)
                    .size(barcodedata.length)(nest_events);*/
            }
            
            //console.log(dataBins);

            var legendLinear = advCharts.legend()
                .shape(shape)
                .shapePadding(2)
                .sizeEncoding(sizeEncoding)
                .color(colorbrewerRange)
                .title(legendTitle)
                .classPrefix("advCharts barcodelegendLinear")
                .shapeRadius(8)
                .shapePadding(5)
                .colorScheme(colorScheme)
                .margin({ top: 25, right: 10, bottom: 20, left: 120 })
                .colorReverse(colorReverse)
                .bins(false)
                .domain(eventRange);

            d3.select(legendParentDiv)
                .datum(dataBins)
                .call(legendLinear);
        }

    }

    function dataPadding(data){

        var newData = [];
        var assigned = false;

        //console.log(eventTypes);

        eventTypes.forEach(function(event) {
            assigned = false;
            data.forEach(function(d,i) {  
                if (d[columnNames.eventType] == event){ 
                    var newRow ={};
                    newRow[columnNames.eventType] =  event ; newRow[columnNames.time] = d[columnNames.time]; newRow[columnNames.eventCnt] = d[columnNames.eventCnt];
                    newData.push(newRow);
                    assigned = true;
                };
            }); 
            if (!assigned){
                var newEmptyRow ={};
                newEmptyRow[columnNames.eventType] =  event ; newEmptyRow[columnNames.time] = 0; newEmptyRow[columnNames.eventCnt] = 0 ;
                newData.push(newEmptyRow);
            }  
        });

        //console.log(newData);

        /*var diff = function(a,b) { return b.filter(function(i) {return a.indexOf(i) < 0;}); };
        var eventKeys = d3.map(data,function(d) { return d[columnNames.eventType]; }).keys()
        console.log(eventKeys);
        var eventAddList = diff(eventKeys,eventTypes);
        var eventRemList = diff(eventTypes,eventKeys);
        console.log(eventAddList, eventRemList);
        eventAddList.forEach(function(event) { 
            var newRow ={}
            newRow[columnNames.eventType] =  event ; newRow[columnNames.time] = 0; newRow[columnNames.eventCnt] = 0 ;
            data.push(newRow);
        });
        eventRemList.forEach(function(event) { 
            data.forEach(function(d,i) {  
                if(d[columnNames.eventType] == event){ 
                    data.splice(i,1);
                };
            });
        });
        //remove 2nd loop below
        eventRemList.forEach(function(event) { 
            data.forEach(function(d,i) {  
                if(d[columnNames.eventType] == event){ 
                    data.splice(i,1);
                };
            });
        });*/

        //console.log(d3.map(data,function(d) { return d[columnNames.eventType]; }).keys());
        return newData;
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
        if (selection !== undefined && nest_data !== undefined && barcodedata !== undefined && timePaddedData !== undefined)
        {
            d3.select(barcodeParentDiv).selectAll('svg').remove();
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
    	if (!arguments.length) {return width;}
    	if (_ !== undefined){ width = _;}
    	return chart;
    };

    chart.height = function (_) {
    	if (!arguments.length) {return height;}
    	if (_ !== undefined){ height = _;}
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

    chart.partition = function (_) {
        if (!arguments.length) {return partition;}
        if (_ !== undefined){ partition = _; }
        return chart;
    };

    chart.partitionLevel = function (_) {
        if (!arguments.length) {return partitionLevel;}
        if (_ !== undefined){ partitionLevel = _;}
        return chart;
    };

    chart.partitionNames = function (_) {
        if (!arguments.length) {return partitionNames;}
        if (_ !== undefined){ partitionNames = _;}
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

    chart.shape = function (_) {
        if (!arguments.length) {return shape;}
        if (_ !== undefined){ shape = _;}
        return chart;
    };

    chart.sizeEncoding = function (_) {
        if (!arguments.length) {return sizeEncoding;}
        if (_ !== undefined){ sizeEncoding = _;}
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

    chart.eventTypes = function (_) {
        if (!arguments.length) {return eventTypes;}
        if (_ !== undefined){ eventTypes = _;}
        return chart;
    };

    chart.showTimeChart = function (_) {
        if (!arguments.length) {return showTimeChart;}
        if (_ !== undefined){ showTimeChart = _;}
        return chart;
    };

    chart.shapeMinSize = function (_) {
        if (!arguments.length) {return shapeMinSize;}
        if (_ !== undefined){ shapeMinSize = _;}
        return chart;
    };

    chart.shapeMaxSize = function (_) {
        if (!arguments.length) {return shapeMaxSize;}
        if (_ !== undefined){ shapeMaxSize = _;}
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
        resizeChart(barcodeParentDiv);
    };
       
    chart.dispatch = dispatch;

    return chart;

};

export default barCode;
