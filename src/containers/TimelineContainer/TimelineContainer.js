var React = require('react');
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import TimelineComponent from '../../components/Timeline/Timeline.js';
import TimelineContent from '../../components/Timeline/content.js';
import * as TimelineStyle from './styled.js';
import * as TimelineUtils from './utils.js';
import PeriodComponent from '../../components/Timeline/period.js';
import { Store } from '../../core/store/store.js';
import * as Actions from './action.js';
var PropTypes = require('prop-types');
import { Loader } from 'semantic-ui-react';

class TimelineContainer extends React.Component {
    constructor(props) {
        super(props);

        let { properties, repos, onClickHandler, onHoverHandler } = props;
        let { timelineProperties } = properties;
        this.state = {
            properties,
            id: timelineProperties.id,
            interval: timelineProperties.interval,
            repos: repos ? repos : [], 
            elements: [],
            visible: false,
            onClickHandler,
            context: properties.context,
            url: properties.resource.url,
            onHoverHandler,
            lastMessage: null,
            lastClicked: null,
            contextCallback: timelineProperties.contextCallback ? timelineProperties.contextCallback : undefined,
        }

        this.showContentPanel = this.showContentPanel.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.handleTimelineClick = this.handleTimelineClick.bind(this);
    }

    componentWillMount() {
        var obj = Object.assign({}, this.state);

        Store.dispatch(Actions.initializeTimeline(obj, this.state.id));
    }


    componentDidMount() {
        Store.dispatch(Actions.fetchTimelineData(this.state));
    }

    componentWillUnmount() {
        Store.dispatch(Actions.removeTimeline(this.state));
    }

    handleTimelineClick(dom, isClicked) {
        if (isClicked) {
            let time = dom.querySelector(".rdx-timeline-time");
            if (time) {
                time.style = time.style || {};
                time.style["font-weight"] = "bold";
            }
    
            let category = dom.querySelector(".rdx-timeline-category");
            if (category) {
                category.style = category.style || {};
                category.style["background-color"] = "#7cafd9";
                category.style["border"] = "1.5px solid #7cafd9";
            }
    
            let connector = dom.querySelector(".rdx-timeline-connector");
            if (connector) {
                connector.style = connector.style || {};
                connector.style["border"] = "solid 1px #7cafd9";
            }
    
            let ele = dom.querySelector(".timeline-renderer");
            if (ele) {
                ele.style = ele.style || {};
                ele.style["border"] = "solid 2px #7cafd9";
                let content = dom.querySelector(".rdx-timeline-detail");
                if (content) {
                    content.style = content.style || {};
                    content.style["font-weight"] = 600;
                }
            }
        }
        else {
            let time = dom.querySelector(".rdx-timeline-time");
            if (time) {
                time.style = time.style || {};
                time.style["font-weight"] = "normal";
            }
    
            let category = dom.querySelector(".rdx-timeline-category");
            if (category) {
                category.style = category.style || {};
                category.style["background-color"] = "#FFF";
                category.style["border"] = "1.5px solid #bed7ed";
            }
    
            let connector = dom.querySelector(".rdx-timeline-connector");
            if (connector) {
                connector.style = connector.style || {};
                connector.style["border"] = "solid 1px #bed7ed";
            }
    
            let ele = dom.querySelector(".timeline-renderer");
            if (ele) {
                ele.style = ele.style || {};
                ele.style["border"] = "solid 1px #bed7ed";
                let content = dom.querySelector(".rdx-timeline-detail");
                if (content) {
                    content.style = content.style || {};
                    content.style["font-weight"] = 500;
                }
            }
        }
    }

    showContentPanel(event) {
        let ele = event.currentTarget;
        this.handleTimelineClick(ele, true);

        if (this.state.lastClicked) {
            this.handleTimelineClick(this.state.lastClicked, false);
        }
        this.setState({ visible: true, lastClicked: ele });

        if (this.state.onClickHandler) {
            let data = this.props.data;
            let id = parseInt(event.currentTarget.getAttribute('id'));
            data = this.state.interval ? data.slice(id, id + this.state.interval) : data[id];

            this.setState({ elements : this.state.onClickHandler(data) });
        }
    }

    onMouseEnter(event) {
        let ele = event.currentTarget.querySelector(".timeline-message")

        if (this.state.onHoverHandler) {
            let data = this.props.data;
            let id = parseInt(event.currentTarget.getAttribute('id'));
            data = data[id];

            let dom = this.state.onHoverHandler(data, id);
            ReactDOM.render(
                dom,
                ele
            );
            this.setState({ lastMessage: dom });
        }

        event.stopPropagation();
    }

    onMouseLeave(event) {
        
        if (this.state.lastMessage) {
            let id = parseInt(event.currentTarget.getAttribute('id'));

            event.currentTarget.querySelector(".rdx-message" + id).remove();
            this.state.setState({ lastMessage : null });
        }
            
        event.stopPropagation();
    }

    render() {
        if (this.props.refresh) {
            Store.dispatch(Actions.fetchTimelineData(this.state));
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
            if (this.props.data && this.props.data.length > 0) {
                let datas = TimelineUtils.bucketTimeIntoDays(this.props.data, this.state.properties.time.day);
                let days = Object.keys(datas);

                if (days.length === 0) {
                    return (
                      <div />
                    );
                }

                let id = this.state.id;
                let properties = this.state.properties;
                let onClickHandler = this.showContentPanel;
                let onMouseEnter = this.onMouseEnter;
                let onMouseLeave = this.onMouseLeave;
                let counterId = -1;
                let interval = this.state.interval;
                return (
                  <div>
                    <TimelineStyle.TimelineMainContainer ref="timeline">
                      {
                            days.map(function (day, index) {
                                return (
                                  <TimelineStyle.TimelineContainer key={day}>
                                    <PeriodComponent 
                                    day={day} 
                                    id={id} 
                                    />
                                    {
                                            datas[day].map(function (data, index) {
                                                counterId++;
                                                if (interval && ((counterId % interval) !== 0)) 
                                                    return null;
                                                
                                                return (
                                                  <TimelineComponent 
                                                    id={counterId} 
                                                    key={index} 
                                                    onClickHandler={onClickHandler} 
                                                    onMouseEnter={onMouseEnter} 
                                                    onMouseExit={onMouseLeave}
                                                    properties={properties} 
                                                    repos={data} 
                                                  />
                                                );
                                            })
                                        }
                                  </TimelineStyle.TimelineContainer>
                                );
                            })
                      }
                    </TimelineStyle.TimelineMainContainer>
                    <TimelineContent 
                        elements={this.state.elements} 
                        visible={this.state.visible} 
                    />
                  </div>
                );
            }
            else {
                return (
                  <TimelineStyle.TimelineContainerNoData>
                        No data
                    </TimelineStyle.TimelineContainerNoData>
                );
            }
        }
    }
}

function mapStateToProps(state, otherProps) {
    const { rdxtimeline } = state;
    const id = otherProps.properties.timelineProperties.id;
    if (!(id && rdxtimeline[id]))
        return rdxtimeline;

    let { data, refresh, context } = rdxtimeline[id];

    return { data, refresh, context };
}

TimelineContainer.propTypes = {
    properties: PropTypes.shape({
        timelineProperties: PropTypes.shape({
            id: PropTypes.string.isRequired,
            contextCallback: PropTypes.func,
            interval: PropTypes.number
        }),
        context: PropTypes.object,
        resource: PropTypes.object,
    }).isRequired,
    onClickHandler: PropTypes.func.isRequired,
    onHoverHandler: PropTypes.func,
    repos: PropTypes.array,
    refresh: PropTypes.bool,
    data: PropTypes.array
};

export default connect(mapStateToProps)(TimelineContainer);
