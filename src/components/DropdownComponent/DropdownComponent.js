var React = require('react');
var PropTypes = require('prop-types');
import { Dropdown } from 'semantic-ui-react';


function DropdownComponent(props) {
    let options = props.options;
    let changeCallback = props.onChangeCallback ? props.onChangeCallback : undefined
    return (
      <span>
        <Dropdown 
        defaultValue={options[0].value} 
        inline 
        onChange={changeCallback}
        options={options} 
        />
      </span>
    );
}

DropdownComponent.propTypes = {
    /** options for list */
    options: PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string
    }).isRequired,
    onChangeCallback: PropTypes.func
};

export default DropdownComponent;
