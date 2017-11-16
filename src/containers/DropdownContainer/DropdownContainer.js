var React = require('react');
import { connect } from 'react-redux';
import DropdownComponent from '../../components/DropdownComponent/DropdownComponent.js';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
var PropTypes = require('prop-types');

class DropdownContainer extends React.Component {
    constructor(props) {
      super(props);

      let { options, id } = props;
      this.state = {
          options: options,
          id: id,
          data: options[0]["value"]
      };
      this.handleChangeCallback = this.handleChangeCallback.bind(this);
    }

    handleChangeCallback(event, data) {
        let value = data["value"];
        this.setState(function () {
          return {
            data: value
          };
        });
    }


    render() {
        Store.dispatch(Actions.refreshAllViews(this.state.data, this.state.id));
        return (
          <DropdownComponent 
            id={this.state.id} 
            onChangeCallback={this.handleChangeCallback}
            options={this.state.options} 
          />
        );
    }
}

function mapStateToProps({ rdxDropdown }) {
  return { rdxDropdown: rdxDropdown };
}

DropdownContainer.propTypes = {
    options: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};


export default connect(mapStateToProps)(DropdownContainer);
