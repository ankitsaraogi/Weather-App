var React = require('react');
var PropTypes = require('prop-types');
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';

class Pagination extends React.Component {
    constructor(props) {
        super(props);

        let { pagesize, totalCount, nextClickHandler, prevClickHandler } = props.properties;
        this.state = {
            pagesize : pagesize,
            totalCount: totalCount,
            activePage: 1,
            nextClickHandler: nextClickHandler,
            prevClickHandler: prevClickHandler,
            lastPageno : Math.ceil(totalCount / pagesize)
        }

        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
    }

    handleNextClick (e, { name }) {
        let  lastPageno  = Math.ceil( this.props.properties.totalCount / this.props.properties.pagesize) ;
        let { activePage, nextClickHandler, pagesize } = this.state;
        if (activePage === lastPageno)
            return;

        this.setState({ activePage: activePage + 1 });
        nextClickHandler(activePage + 1, pagesize);
    } 

    handlePrevClick (e, { name }) {
        let { activePage, prevClickHandler, pagesize } = this.state;
        if (activePage === 1) 
            return;

        this.setState({ activePage: activePage - 1 });
        prevClickHandler(activePage - 1, pagesize);
    } 

    render() {
        let { activePage } = this.state;
        let  lastPageno  = Math.ceil( this.props.properties.totalCount / this.props.properties.pagesize) ;

        return (
          <Menu
            floated='right'
            pagination
          >
            <Menu.Item 
                active={activePage === 1}
                as='a'
                icon
                onClick={this.handlePrevClick} 
            >
              <Icon name='left chevron' />
            </Menu.Item>
            <Menu.Item 
                active
                name={this.state.activePage}
            />
            <Menu.Item 
                disabled 
                name={"of " + this.state.lastPageno}
            />
            <Menu.Item 
                active={activePage === lastPageno}
                as='a'
                icon 
                onClick={this.handleNextClick}
            >
              <Icon name='right chevron' />
            </Menu.Item>
          </Menu>
        );
    }
}

Pagination.propTypes = {
    properties: PropTypes.shape({
        pagesize: PropTypes.number.isRequired,
        totalCount: PropTypes.number.isRequired,
        nextClickHandler: PropTypes.func.isRequired,
        prevClickHandler: PropTypes.func.isRequired
    }).isRequired
}

export default connect(null, null)(Pagination);
