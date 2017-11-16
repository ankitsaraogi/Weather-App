
var React = require('react');
import SparkLine from '../../src/components/visualization/SparkLineChart/SparkLineChart';
import * as Resources from './resource.js';
import { Link } from "react-router-dom";

const rainfallTrend = (data, colname) => {
    var contextObj = {
        city: data["name"], API_KEY : "6a78596d062df78380eff5944c4e5567"
    };
    var url = `/data/2.5/forecast?appid={API_KEY}&q={city}`;
    return (
      <SparkLine 
        context={contextObj}
        options={{
            width: 100,
            height: 50,
            margin: { top: 20, right: 10, bottom: 10, left: 10 },
            lineColor: "#33C0CD",
            fill: false,
            fillColor: "#c0d0f0",
            lineWidth: 1,
            showMinMaxPoints: false,
            minPointColor: "#f02020",
            maxPointColor: "#f02020",
            showStartEndPoints: false,
            startPointColor: "#f08000",
            endPointColor: "#f08000",
            highlightColor: "#f02020",
            pointRadius: 1.5,
            normalBand: false,
            normalColor: "#c0c0c0",
            referenceLine: false,
            referenceColor: "f02020",
            numberFormat: "number",
            tooltip: true,
            autoResize: false
        }}
        url={url}
        x={function(d) { return +d.dt; }} 
        y={function(d) {return (d.rain && d.rain["3h"]) ? +d.rain["3h"] : 0; }} 
      />
    );
};

const getDescription = (data, colname) => {
    let weather = data.weather[0];
    return weather.description;
};

const getCityLink = (data, colname) => {
    return (
      <Link to={"/city/" + data[colname]}>{data[colname]}</Link>
    );
    
}

const weatherTable = {
    type: "table",
    columns: { // columns
        name: { label: "CITY", render_callback: getCityLink },
        speed: { label: "WIND SPEED (m/s)", dataKey: "wind.speed" },
        temp: { label: "TEMPERATURE (K)", dataKey: "main.temp" },
        pressure: { label: "PRESSURE (mPa)", dataKey: "main.pressure" },
        humidity: { label: "HUMIDITY (%)", dataKey: "main.humidity" },
        rainfall: { label: "RAINFALL TREND", render_callback: rainfallTrend },
        description: {label: "DESCRIPTION", render_callback: getDescription }
    },
    order:[], 
    resource: Resources.city,
    context: { city: "Bangalore", country: "IN", API_KEY :"6a78596d062df78380eff5944c4e5567" },
    tableProperties : {
        pagination: {
            pagesize: 10,
            type: "client"
        },
        id: "WeatherTable",
        filterId: "WeatherFilter",
        searchId: "WeatherSearch",
    }
};

const WeatherLayout = {
    title: '',
    containers: [
        {
            key: "components",
            properties: {
                type: "table",
                properties : weatherTable
            }
        }
    ]
}

export default WeatherLayout;
