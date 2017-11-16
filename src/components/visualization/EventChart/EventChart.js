import React, { Component } from 'react';
import activityHeatmap from './activityHeatmap';
//import activityHeatmapRadial from './activityHeatmapRadial';
import activityHeatmapStyles from './activityHeatmap.css';
//import activityHeatmapRadialStyles from './activityHeatmapRadial.css';
import { select, selectAll } from 'd3-selection';
import PropTypes from 'prop-types';

class EventChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createEventChart.bind(this);
  }

  componentDidMount() {
    this.createEventChart();
  }

  componentDidUpdate() {
    this.createEventChart();
  }

  createEventChart(){
    const node = this.node;

    if (this.props.type === "linear")
    {
      let eventChart =
            activityHeatmap()
              .columnNames(this.props.columnNames)
              .startTime(this.props.startTime)
              .endTime(this.props.endTime)
              .timeLevel(this.props.timeLevel)
              .eventTypes(this.props.options.eventTypes)
              .width(this.props.options.width)
              .height(this.props.options.height)
              .margin(this.props.options.margin)
              .fillColor(this.props.options.fillColor)
              .partition(this.props.options.partition)
              .partitionLevel(this.props.options.partitionLevel)
              .partitionNames(this.props.options.partitionNames)
              .lineColor(this.props.options.lineColor)
              .lineWidth(this.props.options.lineWidth)
              .eventColors(this.props.options.eventColors)
              .colorbrewerRange(this.props.options.colorbrewerRange)
              .bands(this.props.options.bands)
              .bandColor(this.props.options.bandColor)
              .bandStroke(this.props.options.bandStroke)
              .shape(this.props.options.shape)
              .sizeEncoding(this.props.options.sizeEncoding)
              .colorScheme(this.props.options.colorScheme)
              .colorReverse(this.props.options.colorReverse)
              .legend(this.props.options.legend)
              .legendParentDiv(node.parentNode.id)
              .bins(this.props.options.bins)
              .legendTitle(this.props.options.legendTitle)
              .showTimeChart(this.props.options.showTimeChart)
              .shapeMaxSize(this.props.options.shapeMaxSize)
              .shapeMinSize(this.props.options.shapeMinSize)
              .axisFont(this.props.options.axisFont)
              .axisLines(this.props.options.axisLines)
              .axisTransY(this.props.options.axisTransY)
              .autoResize(this.props.options.autoResize) ;
    
      select(node)
        .datum(this.props.data)
        .call(eventChart);
    }
            
  }
  render() {
    return <svg ref={node => this.node = node} />;
  }
}

EventChart.propTypes = {
  /** data for the chart */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['linear', 'radial']).isRequired,
  /** data key for accessing event names, event counts and time */
  columnNames: PropTypes.shape({
    eventType:PropTypes.string,
    time: PropTypes.string,
    eventCnt: PropTypes.string
  }).isRequired,
  timeLevel: PropTypes.oneOf(['min', 'hour', 'day']).isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  options: PropTypes.shape({
    eventTypes: PropTypes.arrayOf(PropTypes.string),
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    fillColor: PropTypes.string,
    partition: PropTypes.bool,
    partitionLevel: PropTypes.number,
    partitionNames: PropTypes.arrayOf(PropTypes.string),
    lineColor: PropTypes.string,
    lineWidth: PropTypes.number,
    eventColors: PropTypes.arrayOf(PropTypes.string),
    colorbrewerRange: PropTypes.array,
    bands: PropTypes.bool,
    bandColor: PropTypes.string,
    bandStroke: PropTypes.bool,
    shape: PropTypes.oneOf(['rect', 'circle']),
    sizeEncoding: PropTypes.bool,
    colorScheme: PropTypes.oneOf(['sequential', 'diverging','qualitative']),
    colorReverse: PropTypes.bool,
    legend: PropTypes.bool,
    legendParentDiv: PropTypes.string,
    legendTitle: PropTypes.string,
    showTimeChart: PropTypes.bool,
    bins: PropTypes.number,
    shapeMaxSize: PropTypes.number,
    shapeMinSize: PropTypes.number,
    axisFont: PropTypes.string,
    axisLines: PropTypes.bool,
    axisTransY: PropTypes.number,
    autoResize: PropTypes.bool
  })
} ;


EventChart.defaultProps = {
  options:{
    width: 560,
    height: 405,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    fillColor: "#4eb3d3",
    timeLevel: "hour",
    partition: false,
    partitionLevel: -1,
    partitionNames: [],
    lineColor: "#4eb3d3",
    lineWidth: 1,
    eventColors: ['#3F51B5', '#FF9800', '#4CAF50', '#9C27B0', '#F44336', '#9E9E9E',
    '#E91E63', '#FFC107', '#2196F3', '#00BCD4', '#FF5722', '#009688',
    '#607D8B', '#795548', '#673AB7', '#8BC34A', '#CDDC39'],
    colorbrewerRange: ["GnBu",6],
    bands: false,
    bandColor: "#F0F0F0",
    bandStroke: false,
    shape: "rect",
    sizeEncoding: false,
    colorScheme: "sequential",
    colorReverse: false,
    legend: false,
    bins: undefined,
    legendTitle: "",
    showTimeChart: true,
    shapeMaxSize: -1,
    shapeMinSize: -1,
    axisFont: "1.5vmin",
    axisLines: true,
    autoResize: false
  }
};

export default EventChart;

