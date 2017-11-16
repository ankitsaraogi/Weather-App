var React = require('react');
var PropTypes = require('prop-types');
import * as TimelineStyle from './styled.js';

function PeriodComponent(props) {
    let { day } = props;

    return (
      <TimelineStyle.PeriodContainer>
        {day}
      </TimelineStyle.PeriodContainer>
    );
}

PeriodComponent.propTypes = {
    day: PropTypes.string.isRequired
};

module.exports = PeriodComponent;
