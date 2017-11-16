var React = require('react');
import _ from 'lodash';
import { connect } from 'react-redux';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
import Rangeslider from '../Rangeslider/Rangeslider';
import Checkbox from '../CheckboxContainer/CheckboxContainer';
import { Segment, Header, List } from 'semantic-ui-react';
var PropTypes = require('prop-types');
import * as Style from './styled';

class FilterContainer extends React.Component {
    constructor(props) {
        super(props);

        let { groups, compId, compType, source, id } = props.properties;
        
        this.state = {
            properties: props.properties,
            id,
            groups,
            compId,
            compType,
            result: [],
            source,
            filter: {
                range:{},
                selected: {}
            },
            dependentMap: {}
        };

        this.resetComponent = this.resetComponent.bind(this);
    }

    componentWillMount() {
        let dependentMap = {};
        this.state.groups.map(function(group, index){
            let properties = group.properties;

            properties.map(function(prop, index) {
                dependentMap[prop.props.id] = {};
                dependentMap[prop.props.id]["key"] = prop.dependent;
                if (prop.filterCallback) {
                    dependentMap[prop.props.id]["callback"] = prop.filterCallback;
                }
                return dependentMap;
            });

            return dependentMap;
        });

        this.setState({ dependentMap });
        Store.dispatch(Actions.initializeFilter(this.state));
    }

    

    componentWillReceiveProps(nextProps) {
        if (! nextProps.source) {
            return nextProps;
        }

        let result = this.getFilteredResult(nextProps.source, nextProps.filter);
        this.setState({
            source:nextProps.source,
            filter: nextProps.filter,
            result
        });
        
        Store.dispatch(Actions.sendFilterResult(this.state, result));
        return nextProps;
    }

    componentWillUnmount() {
        Store.dispatch(Actions.removeFilter(this.state))
    }

    resetComponent() { 
        this.setState({ 
            filter: {
                range: {},
                selected: {}
            },
            result: []
         });
    }
    
    getFilteredResult(source, filter) {
        let { selected, range } = filter;
        let keys = Object.keys(selected);
        let rangeKeys = Object.keys(range);

        let dependentMap = this.state.dependentMap;
        const isMatch = function(result) {
            let match = keys.length > 0 ? false : true;
            let rangeMatch = rangeKeys.length > 0 ? false : true;
            keys.map(function(key, index) {
                let column = dependentMap[key].key;
                let callback = dependentMap[key].callback;
                if (callback) {
                    match = callback(result, column);
                }
                else {
                    match = match || (result[column] >= selected[key]['value'][0] && result[column] <= selected[key]['value'][1]); 
                }
                return match;
            });
            
            rangeKeys.map(function(key, index) {
                let column = dependentMap[key].key;
                let callback = dependentMap[key].callback;
                if (callback) {
                    rangeMatch = callback(result, column, range, key);
                }
                else {
                    rangeMatch = rangeMatch || (result[column] >= range[key]['value'][0] && result[column] <= range[key]['value'][1]); 
                }
                

                return rangeMatch;
            });

            return (match && rangeMatch);
        }
        let results = _.filter(source, isMatch);
        return results;
    }

    render() {
        let { groups } = this.state;
        
        return (
          <div>
            {
                groups.map(function(group, index){
                    let key = group.type;
                    let properties = group.properties;
                    let label = group.label ? group.label : "";
                    switch (key) {
                        case "checkbox" :
                            return (
                              <Segment 
                                basic 
                                compact
                                key={index} 
                                style={{ "margin-top" : "20px", "padding": "1em .5em" }}
                              > 
                                <Header 
                                    as='h5' 
                                    style={{ "margin" : "0", "padding" : "5px" }}
                                >
                                  {label}
                                </Header>
                               
                                <Segment  
                                    basic 
                                    compact 
                                    secondary 
                                    style={{ "background-color" : "#e9ecf2", "padding" : "0 5px" }}
                                >
                                  <List 
                                    divided 
                                    relaxed 
                                    selection 
                                    style={{ "min-width" : "145px" }}
                                  >
                                    {
                                        properties.map(function(prop, index) {
                                            let checkboxProps = Object.assign({}, prop.props, { label: undefined, icon: undefined });
                                            return (
                                              <List.Item key={index}>
                                                <List.Content>
                                                  <List.Description>
                                                    <Checkbox properties={checkboxProps} />
                                                    <span style={{ 'margin-left' : "5px", 'line-height': '16px', 'vertical-align' : 'top' }}>{prop.props.label}</span>
                                                  </List.Description>
                                                </List.Content>
                                              </List.Item> 
                                            );
                                        })
                                    }
                                  </List>
                                </Segment> 
                              </Segment>
                            )

                        case "rangeslider" :
                            return (
                              <Style.FilterMainCompContainer 
                                key={index}
                                marginTop="20px" 
                                padding="0 20px"
                              >
                                <Style.Label >{label}</Style.Label>
                                {
                                    properties.map(function(prop, index) {
                                        return (
                                          <div 
                                            className="_rangeslider" 
                                            key={index}
                                          >
                                            <Rangeslider properties={prop.props} />
                                          </div>
                                        
                                        );
                                    })
                                } 
                              </Style.FilterMainCompContainer>
                            ); 
                        
                        default:
                            return <div />;
                    }
                })
            }
          </div> 
        );
    }
}

function mapStateToProps(state, otherProps) {
    const { rdxFilter } = state;
    let source = rdxFilter[otherProps.properties.id] ? rdxFilter[otherProps.properties.id].source : undefined;
    let filter = rdxFilter[otherProps.properties.id] ? rdxFilter[otherProps.properties.id].filter : undefined;
    return { source, filter }
}

FilterContainer.propTypes = {
    properties: PropTypes.shape({
        groups: PropTypes.object.isRequired,
        compId: PropTypes.string.isRequired,
        compType: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        source: PropTypes.object
    }).isRequired,
    filter: PropTypes.shape({
        range: PropTypes.object,
        selected: PropTypes.object
    }),
    source: PropTypes.array
};

export default connect(mapStateToProps)(FilterContainer);
