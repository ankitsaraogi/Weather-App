import React, { Component } from 'react'
import multiline from './multiLineChart'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
import PropTypes from 'prop-types'

class LineChart extends Component {
    constructor(props) {
        super(props)
        this.createLineChart = this.createLineChart.bind(this)
    }

    componentDidMount() {
        this.createLineChart()
    }

    componentDidUpdate() {
        this.createLineChart()
    }

createLineChart(){
        const node = this.node
        if (this.props.type === "line")
        {
            let multiLineChart =
            multiline()
                .columnNames(this.props.columnNames)
                .startTime(this.props.startTime)
                .endTime(this.props.endTime)
                .timeLevel(this.props.timeLevel)
                .width(this.props.options.width)
                .height(this.props.options.height)
                .margin(this.props.options.margin)
                .colorbrewerRange(this.props.options.colorbrewerRange)
                .colorScheme(this.props.options.colorScheme)
                .colorReverse(this.props.options.colorReverse)
                .legend(this.props.options.legend)
                .bins(this.props.options.bins)
                .legendTitle(this.props.options.legendTitle)
                .axisFont(this.props.options.axisFont)
                .axisLines(this.props.options.axisLines)
                .axisTransY(this.props.options.axisTransY)
                .autoResize(this.props.options.autoResize) ;
 
            select(node)
                .datum(this.props.data)
                .call(multiLineChart) ;
        }
       
        
    }

render() {
        return <svg ref={node => this.node = node}></svg>
    }
}

LineChart.propTypes = {
    /** data for the chart */
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    type: PropTypes.oneOf(['sparkline', 'line']).isRequired,
    /** data key for accessing x-axis */
    x: PropTypes.func.isRequired,
    /** data key for accessing y-axis */
    y: PropTypes.func.isRequired,
    /** data key for accessing highlight points */
    h: PropTypes.func,
    options: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        margin: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            bottom: PropTypes.number,
            left: PropTypes.number
        }),
        lineColor: PropTypes.string,
        fill: PropTypes.bool,
        fillColor: PropTypes.string,
        lineWidth: PropTypes.number,
        showMinMaxPoints: PropTypes.bool,
        minPointColor: PropTypes.string,
        maxPointColor: PropTypes.string,
        showStartEndPoints: PropTypes.bool,
        startPointColor: PropTypes.string,
        endPointColor: PropTypes.string,
        highlightColor: PropTypes.string,
        pointRadius: PropTypes.number,
        normalBand: PropTypes.bool,
        normalColor: PropTypes.string,
        referenceLine: PropTypes.bool,
        referenceColor: PropTypes.string,
        numberFormat: PropTypes.oneOf(['number', 'bytes']),
        tooltip: PropTypes.bool,
        autoResize: PropTypes.bool
    })
} ;


LineChart.defaultProps = {
    options:{
        width: 100,
        height: 50,
        margin: {top: 10, right: 10, bottom: 10, left: 10},
        lineColor: "#33C0CD",
        fill: false,
        fillColor: "#c0d0f0",
        lineWidth: 1,
        showMinMaxPoints: false,
        minPointColor: "#f02020",
        maxPointColor: "#f02020",
        showStartEndPoints: false,
        startPointColor: "#f08000",
        endPointColor: "#f08000",
        highlightColor: "#f02020",
        pointRadius: 1.5,
        normalBand: false,
        normalColor: "#c0c0c0",
        referenceLine: false,
        referenceColor: "f02020",
        numberFormat: "number",
        tooltip: true,
        autoResize: false
    }
  };

export default LineChart;

