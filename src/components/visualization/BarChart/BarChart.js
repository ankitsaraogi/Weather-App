import React, { Component } from 'react';
import colBarChart from './colBarChart';
import miniColBar from './miniColBar';
import colBarChartStyles from './colBarChart.css';
import miniColBarStyles from './miniColBar.css';
import { select, selectAll } from 'd3-selection';
import PropTypes from 'prop-types';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart(){
    const node = this.node;

    if (this.props.type == "column")
    {
      let colBar =
            colBarChart()
              .columnNames(this.props.columnNames)
              .width(this.props.options.width)
              .height(this.props.options.height)
              .margin(this.props.options.margin)
              .fillColor(this.props.options.fillColor)
              .negValColor(this.props.options.negValColor)
              .fillBack(this.props.options.fillBack)
              .fillBackColor(this.props.options.fillBackColor)
              .barHeight(this.props.options.barHeight)
              .labels(this.props.options.labels)
              .lablePosX(this.props.options.lablePosX)
              .lablePosY(this.props.options.lablePosY)
              .numberFormat(this.props.options.numberFormat)
              .maxValue(this.props.options.maxValue)
              .autoResize(this.props.options.autoResize) ;
    
      select(node)
        .datum(this.props.data)
        .call(colBar);
    }

    if (this.props.type == "mini" || this.props.type == "mini-multi"  )
    {
      let miniBar =
            miniColBar()
              .columnNames(this.props.columnNames)
              .width(this.props.options.width)
              .height(this.props.options.height)
              .margin(this.props.options.margin)
              .fillColor(this.props.options.fillColor)
              .fillBack(this.props.options.fillBack)
              .fillBackColor(this.props.options.fillBackColor)
              .barHeight(this.props.options.barHeight)
              .labels(this.props.options.labels)
              .lablePosX(this.props.options.lablePosX)
              .lablePosY(this.props.options.lablePosY)
              .numberFormat(this.props.options.numberFormat)
              .maxValue(this.props.options.maxValue)
              .autoResize(this.props.options.autoResize) ;
            
      if (this.props.type == "mini")
      {
        select(node)
          .datum(this.props.data)
          .call(miniBar);
      }
      else {
        selectAll(node)
          .data(this.props.data)
          .call(miniBar);
      }
            
    }
        
        
  }

  render() {
    return <svg ref={node => this.node = node} />;
  }
}

BarChart.propTypes = {
  /** data for the chart */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.oneOf(['column', 'mini', 'mini-multi']).isRequired,
  /** data key for accessing x-axis, y-axis */
  columnNames: PropTypes.shape({
    category:PropTypes.string,
    count: PropTypes.string
  }).isRequired,
  options: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    fillColor: PropTypes.string,
    negValColor: PropTypes.string,
    fillBack: PropTypes.bool,
    fillBackColor: PropTypes.string,
    barHeight: PropTypes.number,
    labels: PropTypes.bool,
    /** Determines label X position - left, right, before */
    lablePosX: PropTypes.oneOf(['right', 'left','before']),
    /** Determines label Y position - top, center, bottom */
    lablePosY: PropTypes.oneOf(['top', 'center', 'bottom']),
    /** Formats the labels - Valid values percent, byMax, value or any valid d3.format */
    numberFormat: PropTypes.string,
    maxValue: PropTypes.number,
    autoResize: PropTypes.bool
  })
} ;


BarChart.defaultProps = {
  options:{
    width: 420,
    height: 196,
    margin: { top: 25, right: 0, bottom: 0, left: 5 },
    fillColor: "rgba(51,192,205,1)" ,
    negValColor: "#EF5350",
    fillBack: true,
    fillBackColor: "rgba(155,155,155,0.1)",
      	barHeight: 8,
    labels: true,
    lablePosX: "right",
    lablePosY: "top",
      	numberFormat: "value",
      	maxValue: 100,
    autoResize: false
  }
};

export default BarChart;

