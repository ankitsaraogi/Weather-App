var PropTypes = require('prop-types');
import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';

class SearchContainer extends Component {
    constructor(props) {
        super(props);

        let { keys, compId, compType, id, valueGetter } = props.properties;
        let { source } = props;
        this.state = 
        {   
            keys,
            id,
            compId,
            compType,
            isLoading: false,
            results: [],
            value: '',
            source,
            valueGetter
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleResultSelect = this.handleResultSelect.bind(this);
        this.resetComponent = this.resetComponent.bind(this);
    }

    componentWillMount() {
        Store.dispatch(Actions.initializeSearch(this.state));  
        this.resetComponent();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.source) {
            this.setState({
                source:nextProps.source
            });
        }
        return nextProps;
    }
  
    resetComponent() { 
        this.setState({ isLoading: false, results: [], value: '' });
    }
  
    handleResultSelect(e, { result }) { this.setState({ value: result.title });}
  
    handleSearchChange(e, { value, result }) {
      this.setState({ isLoading: true, value });
  
      setTimeout(() => {
        if (this.state.value.length < 1) {
            Store.dispatch(Actions.resetSearchResults(this.state));
            return this.resetComponent();
        } 
  
        const keys = this.state.keys;
        const valueGetter = this.state.valueGetter;
        const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
        const isMatch = function(result) {
            let match = false;
            keys.map(function(key, index) {
                let value = valueGetter ? valueGetter(result, key) : result[key];
                match = match || re.test(value); 
                return match;
            });
            
            return match;
        };
        
        let results = _.filter(this.state.source, isMatch);
        this.setState({
          isLoading: false,
          results
        });

        Store.dispatch(Actions.sendSearchResult(this.state, results));
      }, 500);
    }
  
    render() {
      const { isLoading, value, results } = this.state;
  
      return (
        <div>
          <Search
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              results={results}
              value={value}
              {...this.props}
          />
        </div>
      );
    }
  }

function mapStateToProps(state, otherProps) {
    const { rdxSearch } = state;
    let source = rdxSearch[otherProps.properties.id] ? rdxSearch[otherProps.properties.id].source : undefined;
    return { source };
}

SearchContainer.propTypes = {
    properties: PropTypes.shape({
        keys: PropTypes.array.isRequired,
        compId: PropTypes.string.isRequired,
        compType: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        valueGetter: PropTypes.func
    }).isRequired,
    source: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(SearchContainer);
