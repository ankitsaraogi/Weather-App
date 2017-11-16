import * as d3 from 'd3';
import colorbrewer from '../../../core/utils/colorbrewer'
/* 
 
 DO: Shape Config, Category Box Config, Alternate Bands, Bar Chart, Sorting, Sequential Color, Legend, Text Overflow, Chart ToolTip, Diverging Color with Threshold, Categorical Colors (30)

 Event Colors: Blue, Orange, Green, Purple , Red, Grey, Pink, Amber, Indigo, Cyan, Deep Orange, Teal, Blue Grey, Brown, Deep Purple, Light Green, Lime

 Good Colorbrewer Range Values GnBu[6], PuBu[7], BuPu[7], Blues[7], YlGnBu[7], Oranges[8], Greys[7], OrRd[8]

*/

let activityHeatmap = function () {
	
      var margin = { top: 10, right: 10, bottom: 10, left: 10 }
      	, chartWidth
      	, chartHeight
        , columnNames  = { "eventType": "", "time": "", "eventCnt": "" }
        , timeLevel = "hour" // "min , day"
        , partition = false
        , partitionLevel = -1
        , partitionNames = []
        , lineColor = "#4eb3d3"
        , fillColor =  "#4eb3d3" //"#C9E3F3"
        , lineWidth = 1
        , xScale = d3.scaleTime()
        , yScale = d3.scaleLinear()
        , x1Scale = d3.scaleLinear()
        , circleSizeScale = d3.scaleLinear()
        , rectSizeScale = d3.scaleLinear()
        , y1Scale = d3.scaleLinear()
        , xAxis = d3.axisTop(xScale)
        , eventColors = ['#3F51B5', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#9E9E9E',
                         '#E91E63', '#FFC107', '#2196F3', '#00BCD4', '#FF5722', '#009688',
                         '#607D8B', '#795548', '#673AB7', '#8BC34A', '#CDDC39'
                        ]
        , colorbrewerRange = ["GnBu",6]
        , bandColor = "#F0F0F0"
        , bandStroke = false
        , colorQScale = d3.scaleQuantize()
        , line = d3.line().x(X).y(Y)
        , area = d3.area().x(X).y1(Y)
        , screenWidth = window.innerWidth
        , screenHeight = window.innerHeight
        , timeMultiple = function(timeLevel){ return timeLevel === "hour"? 24: timeLevel === "min"? 1: timeLevel === "day"? 7*24:0; }
        , timeDivider = function(timeLevel){ return timeLevel === "hour"? 1000* 60 * 60: timeLevel === "min"? 1000* 60: timeLevel === "day"? 1000* 60 * 60*24:1;}
        , endTime = +new Date()
        , startTime = endTime - timeMultiple(timeLevel) * 1000* 60 * 60
        , dispatch = d3.dispatch("advChartsHeatmapEventClick", "advChartsHeatmapEventDblClick")
        , shape = "rect" // circle
        , sizeEncoding = false
        , bands = false
        , colorScheme = "sequential"
        , colorReverse = false
        , legend = false
        , bins = undefined
        , legendTitle = ""
        , legendSelection = []
        , legendParentDiv
        , heatmapParentDiv
        , heatmapdata
        , nest_data
        , timePaddedData = []
        , timeDataRows
        , heatmapTooltip
        , autoResize = false
        , eventTypes
        , showTimeChart = true
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

                    if (eventTypes !== undefined){
                       //console.log("Old data:", data);
                       data = dataPadding(data);
                       //console.log("New data:", data);
                    }

                    heatmapdata = data;

                    var time_data = d3.nest()
                            .key(function(d) { return d[columnNames.time]; })
                            .sortKeys(d3.ascending)
                            .rollup(function(events) { return d3.sum(events, function(d) { return d[columnNames.eventCnt]; }); })
                            .entries(data);

                    // Created Time Padding wherever there are no events
                    timeDataRows = (endTime-startTime)/timeDivider(timeLevel);
                    //console.log(timeDataRows);
                    //var timePaddedData = [];

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


                    if (colorScheme === "qualitative")
                    {
                        nest_data.forEach(function(d, i) { 
                            d.eventColor = eventColors[i];
                        });
                    }
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

                    //console.log(colorDomain);
                    colorQScale
                        .domain(colorDomain) //d3.extent(data, function(d) { return d[columnNames.eventCnt]; }))
                        .range(colorRange);

                    yScale
                        .domain(d3.extent(data, function(d) { return d[columnNames.eventCnt]; }))
                        .range([0,1]);

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

            var posProp = getPosProperties(chartWidth, chartHeight),
            margin = { top: posProp.topMargin, right: chartWidth*0.03, bottom: chartHeight*0.03, left: chartWidth*0.02 },
            width = chartWidth,
            height = chartHeight - margin.bottom;

            
            var timeHeight = height*0.055;
            var blockPadding = 2;
            var blockHeight = Math.min(((height- (nest_data.length-1)*blockPadding - margin.top -9 -height*0.08) / nest_data.length),60) ;
            var blockWidth = Math.min(width*0.2, 210);
            var eventsPadding = 10;
            var eventsPeriod = heatmapdata.length/ nest_data.length;
            var eventsWidth = width - margin.left - margin.right - blockWidth - eventsPadding;
            var timeY = (blockHeight+blockPadding)*nest_data.length + 9 + posProp.timeChartPosY; //debug this
            var eventHeight = blockHeight-blockPadding;
            var eventWidth = eventHeight/4 ; 
            //var eventSpacing = 1.25*((eventsWidth - eventWidth*eventsPeriod) / (eventsPeriod-2));
            //console.log(eventsWidth,eventHeight, eventWidth, eventSpacing);

            //console.log(eventsWidth);

            var eventDomain = d3.extent(heatmapdata, function(d) { return +d[columnNames.eventCnt]; });
            eventDomain[0] = eventDomain[0] == 0? 1: eventDomain[0];

            xScale
                //.domain(d3.extent(data, function(d) { return d[columnNames.time]; }))
                //.domain([startTime + timeDivider(timeLevel), endTime])
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

            var axis = svg.append('g')
                            .attr("class", "advCharts adv-xAxis")
                            .attr("transform", "translate(" + (margin.left + blockWidth + eventsPadding)  + ", " + (showTimeChart? -posProp.axisPosY: axisTransY) + ")")
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
            }

            else {

                box.append('rect')
                .attr('class', 'advCharts adv-event-block')
                .attr('x', 10 )
                .attr('y', 10)
                .attr('width', blockWidth)
                .attr('height', blockHeight);

            }

            box.append('text')
                .attr('class', 'advCharts adv-event-type')
                .attr('x', blockWidth*0.12)
                //.attr('y', Math.min(blockHeight,40))
                .attr('y', function(d) { return 10 + blockHeight*(nest_data.length > 15 ? 0.8:0.6); })
                .text(function(d) { return d.key; })
                .style('fill', function(d) { return bands? "#4a4a4a": "#FFFFFF";})
                .style('font-family', function(d) { return bands? "citrixsans-semibold": "citrixsans-regular";})
                .style('font-weight', function(d) { return bands? 900: 200;});

            
            var g = box.append('g')
                    .attr('transform', 'translate(' + (margin.left + blockWidth + eventsPadding) + ',' + 12 + ')');

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
                        //heatmapTooltip.position({"left": posX, "top": posY}).data(getTooltipData(d)).show();
                    }
                })
                //.on("mouseleave", function(d) { heatmapTooltip.hide(); })
                .on("click", function(d, i) { 
                    var clickData = { "type": d[columnNames.eventType], "time": d[columnNames.time], "count": d[columnNames.eventCnt] };
                    dispatch.advChartsHeatmapEventClick(clickData);
                });
                //.on("dblclick", function(d, i) { dispatch.advChartsHeatmapEventDblClick(getTooltipData(d));});

            //window.addEventListener('scroll', function() { heatmapTooltip.hide() ;});


            if (partition)
            {
                if (!bands){
                    d3.selectAll(".advCharts.adv-event-block")
                    .style('fill', function(d, i) { 
                        if (partitionLevel < 1)
                        {
                            return "#2b373f";
                        }
                        else if (i < partitionLevel)
                        { 
                            return "#2b373f";
                        }
                        else { 
                            return "rgba(63,75,80,0.8)" ;
                        }
                    });
                }

                if (partitionLevel > 0) {
                    var refLineY = (blockHeight + blockPadding) * partitionLevel + 9;
                    var refLine = svg.append('line')
                        .attr('x1', 0)
                        .attr('y1', refLineY)
                        .attr('x2', width - margin.left - margin.right / 2)
                        .attr('y2', refLineY)
                        .style('stroke', "rgba(151,151,151,0.5)")
                        .style('stroke-width', '0.8px');
                }

                
                if (partitionNames.length > 0)
                {
                    if (partitionLevel == -1 && partitionNames.length == 1)
                    {
                        var label1PosY = blockHeight*nest_data.length/2 + margin.top + 10;
                        label(container, partitionNames[0], margin.left,label1PosY, -90, "advCharts adv-heatmapLabel");

                    }
                    else
                    {
                        var label1PosY = blockHeight*partitionLevel/2 + margin.top + 10;
                        var label2PosY = (blockHeight + blockPadding)*(nest_data.length) + margin.top + 10  - blockHeight*(nest_data.length - partitionLevel)/2 ;
                        label(container, partitionNames[0], margin.left,label1PosY, -90, "advCharts adv-heatmapLabel");
                        label(container, partitionNames[1], margin.left,label2PosY, -90, "advCharts adv-heatmapLabel");
                    }
                    
                }
            }
            
            //console.log(label2PosY, (d3.select('.last').node().getBBox().x));
            if (showTimeChart)
            {
                var lable3 = "Total Events / Time";
                var label3PosY = margin.top + timeY + timeHeight/2 + posProp.timeChartLabelPosY;
                var label3PosX = margin.left+blockWidth*0.4 - lable3.length;
                label(container, lable3 ,label3PosX ,label3PosY, 0, "advCharts adv-heatmapLabel");
                timeChart(svg, timePaddedData, timeHeight, eventWidth + eventsWidth*0.96, (margin.left + blockWidth + eventsPadding), timeY);
            }
        
        /*else {
            console.log("No Height & Width");
        }*/
                
    }

    function createLegend_old() {

        if (legend & legendParentDiv !== undefined)
        {
            var nest_events = d3.nest()
                    .key(function(d) { return d[columnNames.eventCnt];})
                    .rollup(function(events) { return events.length; })
                    .entries(heatmapdata);

            //console.log(nest_events);
            
            var eventRange = [];
            eventRange.push(d3.min(heatmapdata, function(d) { return +d[columnNames.eventCnt]; }));
            eventRange.push(d3.max(heatmapdata, function(d) { return +d[columnNames.eventCnt]; }));
            if (eventRange[0] == 0) { eventRange[0] = 1;}
            if (eventRange[1] == 1) { eventRange[1] = 2;}

            if (bins !== undefined && typeof(bins) !== "number")
            {

                var dataBins = advCharts.dataBins()
                    .bins(bins)
                    .range(eventRange)
                    .size(heatmapdata.length)(nest_events);
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
                    .size(heatmapdata.length)(nest_events);*/
            }
            
            //console.log(dataBins);

            var legendLinear = advCharts.legend()
                .shape(shape)
                .shapePadding(2)
                .sizeEncoding(sizeEncoding)
                .color(colorbrewerRange)
                .title(legendTitle)
                .classPrefix("advCharts heatmaplegendLinear")
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

             var areaChart = timeLine.append("path")
                                        .datum(data)
                                        .attr('class',"area")
                                        .attr('d', area.y0(y1Scale.range()[0]))
                                        .style('fill', fillColor);

    }

    function getPosProperties(width, height)
    {
                var topMargin = height*0.05,
                axisPosY = 0,
                timeChartPosY = 7,
                timeChartLabelPosY = 5;


                if (screenHeight <= 600 & screenWidth <= 1024)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 665 & screenWidth <= 1280)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 800 & screenWidth <= 1280)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 768 & screenWidth <= 1366)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 768 & screenWidth <= 1440)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 1000 & screenWidth <= 1920)
                {
                    topMargin = height*0.05; axisPosY = 0; timeChartPosY = 7; timeChartLabelPosY = 5;
                }

                else if (screenHeight <= 1080 & screenWidth <= 1920)
                {
                    topMargin = height*0.15; axisPosY = 40; timeChartPosY = 15; timeChartLabelPosY = 8;
                }

                else if (screenHeight <= 1200 & screenWidth <= 1920)
                {
                    topMargin = height*0.15; axisPosY = 40; timeChartPosY = 15; timeChartLabelPosY = 8;
                }
                
                //console.log(screenWidth, screenHeight);
                return { "topMargin": topMargin , "axisPosY": axisPosY , "timeChartPosY": timeChartPosY,
                        "timeChartLabelPosY": timeChartLabelPosY
                       };

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
        resizeChart(heatmapParentDiv);
    };
       
    chart.dispatch = dispatch;

    return chart;

};

export default activityHeatmap;
