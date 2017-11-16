import React, { Component } from 'react';
import sparkline from './sparkline';
import { select } from 'd3-selection';
import PropTypes from 'prop-types';
import * as api from "../../../core/http-client/api";

class SparkLineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url : props.url,
            context: props.context,
            dataFormatter: props.dataFormatter
        };
        this.createLineChart = this.createSparkLineChart.bind(this);
        this.doGet = this.doGet.bind(this);
    }

    componentDidMount() {
        if (this.state.url) {
            this.doGet();
        }
        else {
            this.createSparkLineChart();
        }
        
    }

    componentDidUpdate() {
        if (this.state.url) {
            this.doGet();
        }
        else {
            this.createSparkLineChart();
        }
    }

    doGet() {
        api.get(this.state.url, this.state.context)
            .then(function (repos) {
                var data = repos.data.list;
                if (this.state.dataFormatter) {
                    data = this.state.dataFormatter(data);
                }
                this.createSparkLineChart(data);
        }.bind(this));
    }

    createSparkLineChart(data){
        const node = this.node;
       
        let sparklineChart =
        sparkline()
            .x(this.props.x)
            .y(this.props.y)
            .h(this.props.h)
            .width(this.props.options.width)
            .height(this.props.options.height)
            .margin(this.props.options.margin)
            .lineColor(this.props.options.lineColor)
            .fill(this.props.options.fill)
            .fillColor(this.props.options.fillColor)
            .lineWidth(this.props.options.lineWidth)
            .showMinMaxPoints(this.props.options.showMinMaxPoints)
            .minPointColor(this.props.options.minPointColor)
            .maxPointColor(this.props.options.maxPointColor)
            .showStartEndPoints(this.props.options.showStartEndPoints)
            .startPointColor(this.props.options.startPointColor)
            .endPointColor(this.props.options.endPointColor)
            .highlightColor(this.props.options.highlightColor)
            .pointRadius(this.props.options.pointRadius)
            .normalBand(this.props.options.normalBand)
            .normalColor(this.props.options.normalColor)
            .referenceLine(this.props.options.referenceLine)
            .referenceColor(this.props.options.referenceColor)
            .numberFormat(this.props.options.numberFormat)
            .tooltip(this.props.options.tooltip)
            .autoResize(this.props.options.autoResize) ;

        select(node)
            .datum(data ? data : this.props.data)
            .call(sparklineChart) ;
        
       
    }

render() {
        return <svg ref={node => this.node = node}></svg>
    }
}

SparkLineChart.propTypes = {
    /** data for the chart */
    data: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.oneOf(['sparkline']),
    /** data key for accessing x-axis */
    x: PropTypes.func.isRequired,
    /** data key for accessing y-axis */
    y: PropTypes.func.isRequired,
    /** data key for accessing highlight points */
    h: PropTypes.func,
    url: PropTypes.string,
    context: PropTypes.object,
    dataFormatter: PropTypes.func,
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


SparkLineChart.defaultProps = {
    options:{
        width: 100,
        height: 50,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
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

export default SparkLineChart;
