var React = require('react');
import TableContainer from '../containers/TableContainer/TableContainer';
import TimelineContainer from '../containers/TimelineContainer/TimelineContainer';
import FilterContainer from '../containers/FilterContainer/FilterContainer';
import Label from './LabelComponent/LabelComponent.js';
import Layout from './layout/Layout';
import CustomLayout from './layout/CustomLayout';
import * as LayoutStyle from './layout/styled';
import { Link } from "react-router-dom";

export const getComponentType = function(comp, domNextToTitle)
{
    let type = comp.type;
    let layout = null;
    let properties = comp.properties;
    let obj = {};

    switch (type) {
        case "table" :
            layout =  TableContainer;
            obj["properties"] = comp.properties;
            obj["domNextToTitle"] = domNextToTitle;
            break;

        case "timeline" :
            layout =  TimelineContainer;
            obj["properties"] = comp.properties;
            obj["onClickHandler"] = comp.onClickHandler;
            obj["onHoverHandler"] = comp.onHoverHandler;
            break;

        case "filter" :
            layout =  FilterContainer;
            obj["properties"] = comp.properties;
            break;

        case "layout" :
            layout =  Layout;
            obj["layoutProperties"] = comp.properties;
            obj["containerCss"] = { "margin" : "0px", "padding" : "0px", "paddingLeft": "0px" };
            break;

        case "custom" :
            return (
              <CustomLayout> 
                {properties}
              </CustomLayout>
            );

        default:
            layout = <div />;
    }

    return React.createElement(layout, obj);
};

export const getActionType = function(action, handlers, style) 
{
    let type = action.type;
    let actionComp = null;
    let properties = action.properties;
    let obj = {};

    switch (type) {
        case "label" :
            actionComp =  Label;
            obj["properties"] = action.properties;
            break;

        case "link" :
            return (
              <div>
                <LayoutStyle.Link style={properties.style}>
                  <Link to={properties.ref}>
                    {
                        properties.label
                    } 
                  </Link>
                </LayoutStyle.Link>
              </div>
            );
            
        default:
            actionComp = <div />;
    }

    return (
      <div>
        {
            React.createElement(actionComp, obj)
        }
      </div>
    );     
};
