import React, { Component } from 'react';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
import { Checkbox, Icon } from 'semantic-ui-react';
import * as Style from './styled.js';
var PropTypes = require('prop-types');

class CheckboxContainer extends Component {
    constructor(props) {
        super(props);

        let { label, value, icon, defaultValue, id, filterId } = props.properties;
        this.state = 
        {   
            label, value, icon, defaultValue, id, filterId,
            selected : defaultValue ? defaultValue : false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, checkboxObj) {
        let { checked } = checkboxObj;
        if (checked) {
            this.setState({ selected : true });
            Store.dispatch(Actions.checkboxSelected(this.state));
        }
        else {
            this.setState({ selected : false })
            let obj = {};
            obj["value"] = "";
            obj = Object.assign({}, this.state, obj);
            Store.dispatch(Actions.checkboxUnselected(obj));
        }
    }   

    render() {
        let { label, icon, defaultValue } = this.state;
        if (icon) {
            label = <Style.IconContainer><Icon className={icon} />{label}</Style.IconContainer>;
        }
        
        return (
          <Style.CheckboxContainer className="rdx-checkbox">
            <Checkbox
            defaultChecked={defaultValue} 
            label={label} 
            onChange={this.handleChange}
            />
          </Style.CheckboxContainer> 
        );
    }
}

CheckboxContainer.propTypes = {
    properties: PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        value: PropTypes.string,
        defaultValue: PropTypes.string,
        id: PropTypes.string.isRequired,
        filterId: PropTypes.string
    }).isRequired
};

export default CheckboxContainer;
