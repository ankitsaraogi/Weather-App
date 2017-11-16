var React = require('react');

class CustomLayout extends React.Component {
    render() {
        return (
          <div> 
            { this.props.children }
          </div>
        );
    }
};

export default CustomLayout;
