import * as d3 from 'd3';
import legend from 'd3-svg-legend';
let multiBar = function () {
	
  var margin = { top: 20, right: 20, bottom: 30, left: 40 }
    , width = null
    , height = null
    , fillColors = ["#009fe6", "#666b75", "#0dbcaf", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
    , numberFormat = "percent" // percent, byMax, d3 format
    , x0Scale = d3.scaleBand()
    , x1Scale = d3.scaleBand()
    , yScale = d3.scaleLinear()
    , autoResize = false
    , multiBarChartParentDiv
    , showLegend = true
    , legendPos = null
    , legendPadding = 80
    , groupBy= "" // x-axis column name
    , series="" // column names for series 
    ;

  function chart (selection) {
    multiBarChartParentDiv = selection;
    multiBarChartParentDiv.each(function(data) { 
      if (data.length === 0)
      {
        //console.error("No data available");
        return;
      }
      try {
        render(this, data);
      }
      catch (e){ 
        console.log(e); 
        return ;
      }
                    
        	 });

    if (autoResize)
    {
      //advCharts.throttle("resize", "optimizedResize");
      //window.addEventListener("optimizedResize", chart.resize);
    }
        	
  }

  function render(selection, data){

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
        //console.log("Sparkline Width, Height is Zero or Undefined") ; 
        return; }
    }

    width = width - margin.left - margin.right ;
    height = height - margin.bottom - margin.top;

    var groupLvl1 = d3.keys(data);
    var groupLvl2 = d3.keys(data[d3.keys(data)[0]]);
    //var groupLvl2Data = d3.keys(data).forEach(function(key) { data[key] });
    var maxY = d3.max(d3.keys(data), function(key){ return d3.max(d3.values(data[key])); });

    x0Scale
      .domain(groupLvl1)
      .rangeRound([0, width - margin.left - margin.right])
      .paddingInner(0.1);

    x1Scale
      .domain(groupLvl2)
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.05);

    yScale
      .domain([0, maxY*1.1])
      .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x0Scale);
    var yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(bytesFormat);
    var color = d3.scaleOrdinal().domain(groupLvl2).range(fillColors);

    d3.select(selection).selectAll('svg').remove();
    d3.select(selection).selectAll('g').remove();

    var root;
    if (selection.nodeName !== 'svg' )
    {
      root = d3.select(selection)
        .append("svg")
        .attr('width',width + margin.left + margin.right)
        .attr('height',height + margin.bottom + margin.top);
    }
    else {
      root = d3.select(selection)
        .attr('width',width + margin.left + margin.right)
        .attr('height',height + margin.bottom + margin.top);
    }

    var svg = root.append('g')
      .attr('transform','translate('+ margin.left +',' + (margin.top) +')');


    svg.append("g")
      .attr('class', 'advCharts multiBarChart x axis')
      .attr('transform', 'translate(' + margin.left  + ',' + height + ')')
      .call(xAxis);

    svg.append("g")
      .attr('class', 'advCharts multiBarChart y axis')
      .attr('transform', 'translate(' + margin.left + ',' + 0  + ')')
      .call(yAxis);
              

    var lvl1 = svg.selectAll(".advCharts.multiBarChart.groupLvl1").data(groupLvl1).enter()
      .append("g")
      .attr('class', 'advCharts multiBarChart groupLvl1')
      .attr('transform', function(d) { 
        return 'translate(' + (margin.left+ x0Scale(d)) + ',0)'; });

    lvl1.selectAll('rect').data(groupLvl2)
      .enter().append('rect')
      .attr('x', function(d) { return x1Scale(d); })
      .attr('y', function(d) { var lvl1Key = d3.select(this.parentNode).datum(); return yScale(data[lvl1Key][d]); })
      .attr('width', x1Scale.bandwidth())
      .attr('height', function(d) { var lvl1Key = d3.select(this.parentNode).datum(); return height - yScale(data[lvl1Key][d]); })
      .style('fill', function(d) { return color(d);});

    if (showLegend)
    {
                
      //var root = d3.select("svg");
      var posX = (legendPos == null || legendPos == undefined) ? width/3 : legendPos;
                
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
        .attr('transform', 'translate(' + 20  + ',' + 13 + ')');
                
                
      /* var legend = svg.selectAll('.advCharts.multiBarChart.legend')
                                    .data(groupLvl2)
                                    .enter()
                                    .append("g")
                                    .attr('class', 'advCharts multiBarChart legend')
                                    .attr('transform', function(d,i) { 
                                        return 'translate('+ ((i-groupLvl2.length+1)*(20+70)) + ',' + (-margin.top*2) + ')'; } )

                legend.append('rect')
                    .attr('x', function(d) { return width-d.length*2.5; } )
                    .attr('width', height*0.15)
                    .attr('height', height*0.15)
                    .style('fill', color);

                legend.append("text")
                    .attr('x', function(d) { return width-d.length*3; } )
                    .attr('y', height*0.15*0.5)
                    .attr('dy', '0.35em')
                    .attr('text-anchor','end')
                    .text(function(d) { return d; }) */
    }
  }

  var bytesFormat = function (bytes) {
   
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


  chart.margin = function (_) {
        	if (!arguments.length) {return margin;}
        	if (_ !== undefined) {margin = _;}
        	return chart;
  };

  chart.width = function (_) {
        	if (!arguments.length) {return width;}
        	if (_ !== undefined) {width = _;}
        	return chart;
  };

  chart.height = function (_) {
        	if (!arguments.length) {return height;}
        	if (_ !== undefined) {height = _;}
        	return chart;
  };

  chart.fillColors = function (_) {
        	if (!arguments.length) {return fillColors;}
        	if (_ !== undefined) {fillColors = _;}
        	return chart;
  };

  chart.numberFormat = function (_) {
        	if (!arguments.length) {return numberFormat;}
        	if (_ !== undefined) {numberFormat = _;}
        	return chart;
  };

  chart.showLegend = function (_) {
    if (!arguments.length) {return showLegend;}
    if (_ !== undefined) {showLegend = _;}
    return chart;
  };

  chart.legendPos = function (_) {
    if (!arguments.length) {return legendPos;}
    if (_ !== undefined) {legendPos = _;}
    return chart;
  };

  chart.legendPadding = function (_) {
    if (!arguments.length) {return legendPadding;}
    if (_ !== undefined) {legendPadding = _;}
    return chart;
  };

  chart.autoResize = function (_) {
    if (!arguments.length) {return autoResize;}
    if (_ !== undefined) {autoResize = _;}
    return chart;
  };

  chart.resize = function () {
    //console.log("resize triggered");
    if (multiBarChartParentDiv !== undefined)
    {
      multiBarChartParentDiv.each(function(data) {
        d3.select(this).selectAll('svg').remove();
        if (data.length == 0) { return; }
        render(this, data);    
      });
    }
  };

  return chart;


};

export default multiBar;
