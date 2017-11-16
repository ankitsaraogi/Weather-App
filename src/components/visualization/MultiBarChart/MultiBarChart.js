import React, { Component } from 'react'
import multiBar from './multiBar'
import multiBarStyle from './multiBar.css'
import { select, selectAll } from 'd3-selection'
import PropTypes from 'prop-types'

class MultiBarChart extends Component {
    constructor(props) {
        super(props)
        this.createMultiBarChart = this.createMultiBarChart.bind(this)
    }

    componentDidMount() {
        this.createMultiBarChart()
    }

    componentDidUpdate() {
        this.createMultiBarChart()
    }

    createMultiBarChart(){
        const node = this.node

        if(this.props.type == "group")
        {
            let multiBarChart =
            multiBar()
                .width(this.props.options.width)
                .height(this.props.options.height)
                .margin(this.props.options.margin)
                .fillColors(this.props.options.fillColor)
                .numberFormat(this.props.options.numberFormat)
                .showLegend(this.props.options.showLegend)
                .legendPos(this.props.options.legendPos)
                .legendPadding(this.props.options.legendPadding)
                .autoResize(this.props.options.autoResize) ;
    
            select(node)
                .datum(this.props.data)
                .call(multiBarChart)
        }

        if(this.props.type == "stack")
        {
            let multiBarChart =
            multiBar()
                .width(this.props.options.width)
                .height(this.props.options.height)
                .margin(this.props.options.margin)
                .fillColors(this.props.options.fillColor)
                .numberFormat(this.props.options.numberFormat)
                .showLegend(this.props.options.showLegend)
                .legendPos(this.props.options.legendPos)
                .legendPadding(this.props.options.legendPadding)
                .autoResize(this.props.options.autoResize) ;
            
            select(node)
                .datum(this.props.data)
                .call(multiBarChart)       
            
        }    
        
    }
render() {
        return <svg ref={node => this.node = node}></svg>
    }
}

MultiBarChart.propTypes = {
    /** data for the chart */
    data: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['group', 'stack']).isRequired,
    options: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        margin: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            bottom: PropTypes.number,
            left: PropTypes.number
        }),
        fillColors: PropTypes.arrayOf(PropTypes.string),
        /** Formats the labels - Valid values percent, byMax, value or any valid d3.format */
        numberFormat: PropTypes.string,
        showLegend: PropTypes.bool,
        legendPos: PropTypes.number,
        legendPadding: PropTypes.number,
        autoResize: PropTypes.bool
    })
} ;


MultiBarChart.defaultProps = {
    options:{
        width: 960,
        height: 500,
        margin: {top: 25, right: 0, bottom: 20, left: 30},
        fillColors: ["#009fe6", "#666b75", "#0dbcaf", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"] ,
        numberFormat: "value",
        showLegend: true,
        legendPadding: 80,
        autoResize: false
    }
  };

export default MultiBarChart;

