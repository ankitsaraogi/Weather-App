var React = require('react');
var PropTypes = require('prop-types');
import * as TimelineStyle from './styled.js';

class TimelineContent extends React.Component {
    constructor(props) {
        super(props);

        let { elements, visible } = props;
        this.state = {
            visible,
            elements
        };

        this.scrollEvent = this.scrollEvent.bind(this)
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollEvent)
    }

    scrollEvent(e) {
        var scrOfY = 0;
        if ( typeof( window.pageYOffset ) === 'number' ) {
          //Netscape compliant
          scrOfY = window.pageYOffset;
        } else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
          //DOM compliant
          scrOfY = document.body.scrollTop;
        } 
        
        let ele = document.querySelector(".rdx-timeline-content");
        let bodyHeight = document.body.getBoundingClientRect().height;
        ele.style = ele.style || {};
        ele.style.bottom = 0;
        ele.style.right = 0;
        if (scrOfY === 0) {
            ele.style.top = 140 + "px";
            ele.style.height = (bodyHeight - 140) + "px";
        }
        else if (scrOfY > 1 && scrOfY <= 80) {
            ele.style.top = (140 - scrOfY) + "px";
            ele.style.height = (bodyHeight - scrOfY) + "px";
        }
        else {
            ele.style.top = 60 + "px";
            ele.style.height = (bodyHeight - 60) + "px";
        }
    }

    render() {
        return (
          <TimelineStyle.TimelineContent
            className="rdx-timeline-content"
            visible={this.props.visible} 
          >
            {this.props.elements}
          </TimelineStyle.TimelineContent>
        );
    }
}

TimelineContent.propTypes = {
    elements: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
};

export default TimelineContent;
