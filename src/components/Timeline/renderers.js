import * as TimelineRenderer from './styled.js';
var React = require('react');
import Label from '../LabelComponent/LabelComponent.js';
import ReactDOM from "react-dom";
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';

const onMouseEnter = function(event, data, label) {
    let labelProps = {
        renderer : function(data) {
            return (
              <span>
                <b>{data["indicator_category"]}</b> indicator with <b>{label}</b> priority detected with <b>{data["indicator_probability"] * 100}% probability</b>
              </span>
            )
        },
        context: data,
        pointing: "above"
    }
    ReactDOM.render(
      <Label properties={labelProps} />,
        event.currentTarget.nextSibling
    );
    event.stopPropagation();
};

const onMouseExit = function(event) {
    let node = event.currentTarget.nextSibling;
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    event.stopPropagation();
};

export const getLevel = function(scoreList, data, id, repos) {
    let { high, med, low } = scoreList;
    let type = undefined;
    let label = undefined;

    const re = new RegExp(_.escapeRegExp(data), 'i');
    if (re.test(high.value)) {
        type = high;
        label = "High";
    }
    else if (re.test(med.value)) {
        type = med;
        label = "Medium";
    }
    else  {
        type = low;
        label = "Low";
    }

    return (
      <div id={"score" + id}>
        <TimelineRenderer.SecurityLevel 
        css={{ color: type.color, position: "relative" }} 
        >
          <Icon 
          name={type.icon}
          size="large"
          style={{ color: type.color }}
          />
        </TimelineRenderer.SecurityLevel>
        <TimelineRenderer.ScoreMessage className={"score-message" + id + " timeline-msg"} />
      </div>
    )
}

export const scoreChange = function(change, repos) {
    let { key } = change;
    let data = undefined;
    if (key.indexOf("{") !== -1) {
        let curKey =  key.substring(key.indexOf("{") + 1, key.indexOf("-")).trim();
        let prevKey =  key.substring(key.indexOf("-") + 1, key.indexOf("}")).trim();

        data = parseInt(repos[curKey]) - parseInt(repos[prevKey]);
    }
    else {
        data = repos[key]
    }

    return (
      <TimelineRenderer.ScoreContainer >
        {data}
      </TimelineRenderer.ScoreContainer>
    );
};

const contentContainer = function(data) {
    return (
      <TimelineRenderer.ContentContainer className="rdx-timeline-detail">
        {data}
      </TimelineRenderer.ContentContainer>
    );
};

const renderLink = function() {
    return (
      <Icon 
        name="right chevron"  
        style={{ float: "right", padding: "7px 0 0" }}
      />
    );
}

export const scoreChangeRenderer = function(props, repos, id) {
    let { score, change, content } = props;

    return (
      <div>
        <TimelineRenderer.ScoreChangeRenderer className="timeline-renderer">
          {getLevel(score.list, repos[score.key], id, repos)}
          {scoreChange(change, repos)}
          {contentContainer(repos[content.key])}
          {renderLink()}
        </TimelineRenderer.ScoreChangeRenderer>
        <TimelineRenderer.MessageContainer className="timeline-message" /> 
      </div>
    );
};
