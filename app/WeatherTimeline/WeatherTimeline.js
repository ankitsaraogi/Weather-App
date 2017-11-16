var React = require('react');
import Layout from '../../src/components/Layout/Layout';
import * as Resources from './resources';
import * as Style from '../styled/styled';
import { Icon, Flag } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import * as Renderer from './renderers';
import Label from '../../src/components/LabelComponent/LabelComponent';

const getCountryFlag = function(city) {
    switch (city) {
        case "Tripoli":
            return "lebanon";
        
        case "Birkirkara":
        case "Pozzallo" :
            return "malta";

        case "Ragusa":
        case "Modica" :
        case "Rosolini":
            return "italy";

        default:
            return "libya";

    }
};

const timelineClickHandler = function(data) {
    return (
      <div id="Clicked"> 
        { Renderer.timelineRenderers(data) }
      </div>
    );
};

const timelineHoverHandler = function(data, id) {
    let props = {
        label : "Message",
        pointing: "left"
    };
    
    let obj = {};
    obj["properties"] = props;
    return (
      <div className={"rdx-message" + id}>
        <Label properties={props} />
      </div>
    );
};

let timelineComponent = {
    time: {
        day : "dt",
        key: "dt_txt"
    },
    content: {
        renderType: "score_change",
        properties: {
            score: { key : "weather.main", list: {
                high: { icon: "sun", value: "Clear", color: "#f2a945" },
                med: { icon: "cloud", value: "clouds",  color: "#aeb5c1" },
                low: { icon: "rain", value: "rain", color: "#ADD8E6" }
            } },
            change: { key: "main.temp" },
            content: { key: "weather.description" }
        }
    },
    context: { API_KEY : "6a78596d062df78380eff5944c4e5567" },
    resource: Resources.city,
    timelineProperties: {
        id : "WeatherTimeline",
        interval: 8
    }
};

const timelineComponentLayout = {
    title: "Weather Timeline",
    containers: [
        {
            key: "components",
            properties: {
                type: "timeline",
                properties : timelineComponent,
                onClickHandler: timelineClickHandler,
                onHoverHandler: timelineHoverHandler
            }
        }
    ]
};

class WeatherTimeline extends React.Component{
  constructor(props) {
    super();
    this.state = {
      timeline: null,
      context: null,
      showMessage: false,
      message: "",
      city: "",
      tooltipRendered: false
    };

    this.title = this.title.bind(this);
  }

    componentWillMount() {
        let city = this.props.match && this.props.match && this.props.match.params.name ? this.props.match.params.name : "Yafran";  
        let context = {
            city 
        };
        this.setState({ city });
        let newContext = Object.assign({}, timelineComponent.context, context);
        timelineComponent = Object.assign(timelineComponent, { context : newContext });
    };

    title() {
        return (
          <Style.TimelineTitleContainer>
            <Style.TimelineBackButtonContainer>
              <Link to="/">
                <Style.TimelineBackButton>
                  <Icon className="arrow left" />
                </Style.TimelineBackButton>
              </Link>
            </Style.TimelineBackButtonContainer>
            <Style.TimelineUseridContainer>
              <Flag name={getCountryFlag(this.state.city)} />
              <Style.TimelineCity>{this.state.city}</Style.TimelineCity>
            </Style.TimelineUseridContainer>
          </Style.TimelineTitleContainer>
        );
    }

    render() {
        return (
          <div>
            <div classNam="timeline-view">
              {this.title()}
              <Layout 
                containerCss={{ margin : "0px", marginTop: "0px" }}
                layoutProperties={timelineComponentLayout}
              />     
            </div>
          </div>
        )
    }
};

export default WeatherTimeline;
