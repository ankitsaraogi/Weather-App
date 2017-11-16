var React = require('react');
var PropTypes = require('prop-types');
import * as TimelineStyle from './styled.js';
import * as Utils from '../../core/utils/commonUtils';
import * as Renderers from './renderers';

function createTimeContainer(time, repos) {
    let { type, key } = time;

    let timeData = type ? Utils.getFormattedTime(repos[key], type) : repos[key];
    return (
      <TimelineStyle.TimeContainer className="rdx-timeline-time">
        {timeData}
      </TimelineStyle.TimeContainer>
    );
}

function createCateogary() {
    return (
      <TimelineStyle.CateogaryContainer className="rdx-timeline-category" />
    );
};

function createContentContainer(content, repos, id) {
    let { renderType, properties } = content;
    
    if (renderType === "score_change") {
        return Renderers.scoreChangeRenderer(properties, repos, id);
    }
    else {
        return (
          <div />
        );
    }
};

function Timeline(props) {
    let { properties, repos, onClickHandler, id } = props;
    let { time, content } = properties;

    return (
      <TimelineStyle.TimelineMainContainer 
        id={id}
        onClick={onClickHandler} 
      >
        {createTimeContainer(time, repos)}
        <TimelineStyle.CateogaryConnectorContainer>
          {createCateogary()}
          <TimelineStyle.Connector className="rdx-timeline-connector" />
        </TimelineStyle.CateogaryConnectorContainer>
        <TimelineStyle.ContentMainContainer >
          {createContentContainer(content, repos, id)}
        </TimelineStyle.ContentMainContainer>
      </TimelineStyle.TimelineMainContainer>
    );
};

Timeline.propTypes = {
    properties: PropTypes.shape({
        content: PropTypes.object,
        time: PropTypes.object
    }).isRequired,
    repos: PropTypes.array.isRequired,
    onClickHandler: PropTypes.func,
    id: PropTypes.string.isRequired
};

export default Timeline;
