var React = require('react');
import Layout from '../../src/components/Layout/Layout';
import WeatherFilter from './container.js';

const WeatherListLayout = {
    title: "Weather Report" ,
    containers: [
        {
            key: "components",
            properties: {
                type: "custom",
                properties : <WeatherFilter />
            }
        }
    ],
    search : {
        keys: ["description", "name"],
        compId: "WeatherTable",
        compType: "rdxTable",
        id: "WeatherSearch",
        valueGetter: function(result, key) {
            switch (key) {
                case "description" :
                    return result.weather[0].description;
                default:
                    return result[key];
            }
        }
    }
};

const WeatherList = () => {
    return (
      <Layout 
        containerCss={{ backgroundColor : "#FFF", margin: "0px", paddingLeft: "0px", padding: "0px" }}
        layoutProperties={WeatherListLayout} 
        titleCss={{ borderBottom: "1px solid #E0E6EB", "padding" : "10px 20px 10px 20px" }}
      />       
    );
};

export default WeatherList;
