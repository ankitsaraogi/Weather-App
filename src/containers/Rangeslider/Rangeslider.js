var PropTypes = require('prop-types');
import React, { Component } from 'react';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
import InputRange from 'react-input-range';

class RangeSlider extends Component {
    constructor(props) {
        super(props);

        let { minValue, maxValue, id, formatLabel, step, value , filterId } = props.properties;
        this.state = 
        {   
            minValue, maxValue, id, formatLabel, step, value, filterId
        }

        this.handleChangeComplete = this.handleChangeComplete.bind(this);
    }

    handleChangeComplete(value) {
        if (value.min === this.state.minValue && value.max === this.state.maxValue)   
            Store.dispatch(Actions.resetRangeSlider(this.state));
        else 
            Store.dispatch(Actions.setRangeSlider(this.state));
    }

    render() {
        let { minValue, maxValue, formatLabel, step, value } = this.state;
        value = value ? value : { min : minValue, max : maxValue };      
        return (
          <div className="_rangeslider">
            <InputRange
                formatLabel={formatLabel}
                maxValue={maxValue}
                minValue={minValue}
                onChange={value => this.setState({ value })}
                onChangeComplete={this.handleChangeComplete}
                step={step}
                value={value}
            />
          </div>
            
        )
    }
}

RangeSlider.propTypes = {
    properties: PropTypes.shape({
        minValue: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,
        compType: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        step: PropTypes.number,
        filterId: PropTypes.string
    }).isRequired
};

export default RangeSlider;
