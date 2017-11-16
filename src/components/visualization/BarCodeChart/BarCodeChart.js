import React, { Component } from 'react';
import barCode from './barCode';
//import activityHeatmapRadial from './activityHeatmapRadial';
import barCodeStyles from './barCode.css';
//import activityHeatmapRadialStyles from './activityHeatmapRadial.css';
import { select, selectAll } from 'd3-selection';
import PropTypes from 'prop-types';

class BarCodeChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarCodeChart.bind(this);
  }

  componentDidMount() {
    this.createBarCodeChart();
  }

  componentDidUpdate() {
    this.createBarCodeChart();
  }

  createBarCodeChart(){
    const node = this.node;
   
    let barCodeChart =
      barCode()
        .columnNames(this.props.columnNames)
        .startTime(this.props.startTime)
        .endTime(this.props.endTime)
        .timeLevel(this.props.timeLevel)
        .width(this.props.options.width)
        .height(this.props.options.height)
        .margin(this.props.options.margin)
        .colorbrewerRange(this.props.options.colorbrewerRange)
        .shape(this.props.options.shape)
        .sizeEncoding(this.props.options.sizeEncoding)
        .colorScheme(this.props.options.colorScheme)
        .colorReverse(this.props.options.colorReverse)
        .legend(this.props.options.legend)
        .bins(this.props.options.bins)
        .legendTitle(this.props.options.legendTitle)
        .shapeMaxSize(this.props.options.shapeMaxSize)
        .shapeMinSize(this.props.options.shapeMinSize)
        .axisFont(this.props.options.axisFont)
        .axisLines(this.props.options.axisLines)
        .axisTransY(this.props.options.axisTransY)
        .autoResize(this.props.options.autoResize) ;

        select(node)
          .datum(this.props.data)
          .call(barCodeChart);
    
            
  }
  render() {
    return <svg ref={node => this.node = node} />;
  }
}

BarCodeChart.propTypes = {
  /** data for the chart */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    colorbrewerRange: PropTypes.array,
    shape: PropTypes.oneOf(['rect', 'circle']),
    sizeEncoding: PropTypes.bool,
    colorScheme: PropTypes.oneOf(['sequential', 'diverging','qualitative']),
    colorReverse: PropTypes.bool,
    legend: PropTypes.bool,
    legendParentDiv: PropTypes.string,
    legendTitle: PropTypes.string,
    bins: PropTypes.number,
    shapeMaxSize: PropTypes.number,
    shapeMinSize: PropTypes.number,
    axisFont: PropTypes.string,
    axisLines: PropTypes.bool,
    axisTransY: PropTypes.number,
    autoResize: PropTypes.bool
  })
} ;


BarCodeChart.defaultProps = {
  options:{
    width: 560,
    height: 405,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    timeLevel: "hour",
    colorbrewerRange: ["GnBu",6],
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

export default BarCodeChart;

