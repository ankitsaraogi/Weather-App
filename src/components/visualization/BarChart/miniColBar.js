import * as d3 from 'd3';
let miniColBar = function () {
	
      var margin = {top: 20, right: 0, bottom: 0, left: 5}
      	, width = null
      	, height = null
        , columnNames = null
      	, fillColor = "#33C0CD"
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
        , miniColBarParent
        , autoResize = false
        ;


        function chart (selection) {
        	miniColBarParent = selection;
            miniColBarParent.each(function(data) { 
                if(data.length === 0)
                {
                    //console.error("No data available");
                    return;
                }
                try {
                    render(this, data);
                }
                catch(e){ return ;}
                
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
                svg = d3.select(selection).data(data)
                        .attr('width', width)
                        .attr('height', height);
            }

            //var svg = d3.select(selection).selectAll("svg").data([data]);

            //var group = svg.enter().append("svg").append("g");
            var group = svg.append("g");
            group.append("rect").attr('class',"advCharts adv-bar");

            /* svg
                .attr('width', width)
                .attr('height', height); */

            var g = svg.select("g")
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            xScale
                .domain([0,maxValue])
                .range([0, width - margin.left - margin.right]);

            g.select('.advCharts.adv-bar')
                .attr('x', 0)
                .attr('y', 3 )
                .attr('width',function(d) { return xScale(d[columnNames.count]); } )
                .attr('height', barHeight)
                .style('fill', fillColor);

            if(fillBack)
            {
                
                group.append("rect").attr('class',"advCharts adv-backBar");

                g.select('.advCharts.adv-backBar')
                    .attr('x',0)
                    .attr('y', 3)
                    .attr('width', xScale(maxValue))
                    .attr('height', barHeight)
                    .style('fill', fillBackColor);
                    
            }


           //label(g, dataLabel(numberFormat), xScale(maxValue)-25, 0, "advCharts adv-dataLabel");
           label(g,"advCharts adv-dataLabel");

        }

        function dataFormat(number,numberFormat) {

            var format, labelValue;
            if(numberFormat === "percent")
            {
                format = d3.format("%");
                labelValue = format(number/maxValue); 
                return labelValue;
            }

            else if(numberFormat === "byMax")
            {
                labelValue = number.toString() + "/" + maxValue.toString; 
                return labelValue;
            }

            else if(numberFormat === "value")
            {
                labelValue = number;
                return labelValue;
            }

            else
            {
                format = d3.format(numberFormat);
                labelValue = format(number);
                return labelValue;
            }

        }

        function getLabelPos(text) {

            var posX, posY;

            switch(lablePosX) {
                case "left" : 
                    posX = 0;
                    break;
                case "right":
                     posX = xScale(maxValue)-(width-margin.left - margin.right)*0.2;
                     break;
                case "before" :
                    posX = -margin.left;
                    break;
                default: posX = 0;
            }

            switch(lablePosY) {
                case "top" : 
                    posY = 0;
                    break;
                case "center" :
                    posY = barHeight*1.2;
                    break;
                default: posY = 0;
            }
            return [posX, posY];
        }

        function label(selection, cssClass) {

            var pos = [];
            //console.log(selection);
            selection.append('text')
                .attr('class', cssClass)
                .attr('text-align', 'end')
                .text(function(d) { 
                    pos = getLabelPos(d[columnNames.count]);
                    return dataFormat(d[columnNames.count], numberFormat); 
                })
                .attr('transform', "translate(" + pos[0] + "," + pos[1] + ")")
        }


        function X(d) { return xScale(d[columnNames.count]);}
        function Y(d) { return yScale(d[columnNames.category]);}

        chart.x = function(_) {
        	if(!arguments.length) return xValue;
        	if(_ !== undefined) xValue = _;
        	return chart;
        }

        chart.y = function(_) {
        	if(!arguments.length)  return yValue;
        	if(_ !== undefined) yValue = _;
        	return chart;
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
        };

        chart.resize = function () {
            //console.log("resize triggered");
            if(miniColBarParent !== undefined)
            {
                miniColBarParent.each(function(data) {
                    d3.select(this).selectAll('svg').remove();
                    if(data.length == 0) { return; }
                    render(this, data);    
                });
            }
        };

        return chart;


}

export default miniColBar;