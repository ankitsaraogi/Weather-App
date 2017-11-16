var React = require('react');
import { connect } from 'react-redux';
import TableComponent from '../../components/TableComponent/TableComponent.js';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
import PaginationComponent from '../../components/pagination/pagination.js';
var PropTypes = require('prop-types');
import { Loader } from 'semantic-ui-react';

class TableContainer extends React.Component {
    constructor(props) {
        super(props);

        let { columns, data, resource, tableProperties, context, contextCallback, minHeight } = props.properties;
        this.state = {
            columns,
            id: tableProperties.id,
            data: data? data : [],
            minHeight,
            resource,
            pagination: tableProperties.pagination ? tableProperties.pagination : false,
            pagesize: tableProperties.pagination ? ( tableProperties.pagination.pagesize ? tableProperties.pagination.pagesize : 25) : undefined, 
            paginationType: tableProperties.pagination ? ( tableProperties.pagination.type ? tableProperties.pagination.type : "client") : undefined, 
            url : resource.url,
            context : context ? context: {},
            contextCallback: contextCallback ? contextCallback : undefined,
            totalCount: 0,
            searchId: tableProperties.searchId,
            filterId : tableProperties.filterId,
            compact : tableProperties.compact ? tableProperties.compact : undefined
        };

        this.paginationNextClickHandler = this.paginationNextClickHandler.bind(this);
        this.paginationPrevClickHandler = this.paginationPrevClickHandler.bind(this);
        this.dispatchFetchAction = this.dispatchFetchAction.bind(this);
        this.getPaginationProperties = this.getPaginationProperties.bind(this);
    }

    componentWillMount() {
        var obj = Object.assign({}, this.state, { pageno : this.state.pagination ? 1 : undefined });
        if (this.state.pagination && this.state.paginationType !== "client") {
            this.setState(function() { 
                return {
                    url : this.state.url + "&pageno={pageno}&pagesize={pagesize}",
                    context : Object.assign(this.state.context, { pageno: 1, pagesize: this.state.pagesize })//{...this.state.context, ...{pageno: 1, pagesize: this.state.pagesize}};
                };
            }); 
        }
        Store.dispatch(Actions.initializeTable(obj, this.state.id));
    }

    componentDidMount() {
        if (this.state.data.length !== 0) {
            Store.dispatch(Actions.dispatchTabularData(this.state));
            return;
        }
        Store.dispatch(Actions.fetchTabularData(this.state));
    }

    componentWillReceiveProps(nextProps) {
        return nextProps;
    }

    componentWillUnmount() {
        Store.dispatch(Actions.removeTable(this.state));
    }

    dispatchFetchAction(context, pageno) {
        if (this.state.paginationType !== "client") {
            Store.dispatch(Actions.fetchTabularData(this.state));
        }
        else {
            Store.dispatch(Actions.fetchPaginatedTabularData(context, pageno, this.state.id));
        }
    }

    getPaginationProperties() {
        return  {
            pagesize: this.state.pagesize,
            nextClickHandler: this.paginationNextClickHandler,
            prevClickHandler: this.paginationPrevClickHandler,
            totalCount: this.props.totalCount ? this.props.totalCount : 0
        };
    }

    paginationNextClickHandler(pageno, pagesize) {
        this.setState(function() { 
            return {
                context : { ...this.state.context, ...{ pageno: pageno, pagesize: pagesize } }//Object.assign(this.state.context, {pageno: pageno, pagesize: pagesize })
            };
        });
        this.dispatchFetchAction(this.state.context, pageno);
    }

    paginationPrevClickHandler(pageno, pagesize) {
        this.setState(function() { 
            return {
                context : { ...this.state.context, ...{ pageno: pageno, pagesize: pagesize } } //Object.assign(this.state.context, {pageno: pageno, pagesize: pagesize })
            };
        });
        this.dispatchFetchAction(this.state.context, pageno);
    }

    render() {
        if (this.props.refresh) {
            Store.dispatch(Actions.fetchTabularData(this.state));
            return (
              <div>
                <Loader
                    active
                    inline='centered'
                    size="medium"
                />
              </div>
            );
        }
        else {
            return (
              <div>
                <TableComponent 
                    compact={this.state.compact} 
                    context={this.state.context} 
                    id={this.state.id} 
                    properties={this.state.columns}
                    repos={ (this.props.totalCount > 0) ? this.props.data : []} 
                />
                {
                    (
                        (this.state.pagination && this.state.pagesize < this.props.totalCount)
                        ? (
                          <PaginationComponent properties={this.getPaginationProperties()} /> 
                        )
                        : null
                    )
                }
              </div>
            );
        }
    }
}

function mapStateToProps(state, otherProps) {
    const { rdxtable } = state;
    const id = otherProps.properties.tableProperties.id;
    if (! (id && rdxtable[id]))
        return rdxtable;

    let { data, refresh, currentPage, pagination, paginationType, pagesize, context } = rdxtable[id];
    let totalCount = data.length;

    if (pagination && paginationType === "client") {
        data = data.slice(((currentPage- 1) * pagesize), currentPage * pagesize);
    }

    return { data, refresh, currentPage, totalCount, context };
}


TableContainer.propTypes = {
    properties: PropTypes.shape({
        columns: PropTypes.object.isRequired,
        context: PropTypes.object,
        contextCallback: PropTypes.func,
        minHeight: PropTypes.number,
        data: PropTypes.array,
        resource: PropTypes.object,
        tableProperties: PropTypes.shape({
            id: PropTypes.string.isRequired,
            pagination: PropTypes.shape({
                pagesize: PropTypes.number,
                paginationType: PropTypes.string
            }),
            compact: PropTypes.string,
            searchId: PropTypes.string,
            filterId: PropTypes.string
        })
    }).isRequired,
    refresh: PropTypes.bool,
    totalCount: PropTypes.number,
    data: PropTypes.array
};

export default connect(mapStateToProps)(TableContainer);
