var React = require('react');
import * as Utils from '../../src/core/utils/commonUtils';
import MessageBlock from '../../src/components/MessageBlock/MessageBlock';
import Table from '../../src/containers/TableContainer/TableContainer';
import * as Style from '../styled/styled.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BarCodeChart from '../../src/components/visualization/BarCodeChart/BarCodeChart';

const descriptionRenderer = function(data, context, title) {
    let description = data[0]["weather.description"][0].toUpperCase() + data[0]["weather.description"].substring(1);
    let msg = description + " between " + data[0]["dt_txt"] + " and " + data[data.length - 1]["dt_txt"];
    return (
      <MessageBlock
       className={"status info"}
       noDismiss  
       type="info"
      >
        <p>{msg}</p>
      </MessageBlock>
    );
};

const renderRainfallBarCodeChart = function(data, context, title) {
    let epochStartTime = data[0]["dt"] * 1000;
    let epochEndTime = data[data.length - 1]["dt"] * 1000;
    let barData = [];
    for (let i = 0; i < data.length; i ++) {
        if (data[i]["rain.3h"]) {
            let obj = {
                eventType: "Rainfall",
                eventTime: data[i]["dt"] * 1000,
                eventCnt: data[i]["rain.3h"]
            }
            barData.push(obj);
        }
    }

    return (
      <div> 
        {
                barData.length === 0 ? 
                ( 
                  <div>
                    { "No Rainfall between " + data[0]["dt_txt"] + " and " + data[data.length - 1]["dt_txt"] } 
                  </div> 
                )
                : (
                  <BarCodeChart
                        columnNames={{"eventType": "eventType", "time": "eventTime", "eventCnt": "event_cnt" }}
                        data={barData}
                        endTime={epochEndTime}
                        options={{
                            width: 400,
                            height:60,
                            shape: "rect",
                            colorScheme: "sequential",
                            legend: false,
                            colorbrewerRange: ["Blues",7],
                            bins: 7,
                            axisFont:"0.6rem",
                            axisTransY:16,
                            autoResize: false
                        }}
                        startTime={epochStartTime}
                        timeLevel="hour"
                        type="barcode"
                  />
                )
            }
      </div>
    );
};

const renderTempLineChart = function(data, context, title) {
    return (
      <LineChart  
        data={data}
        height={300}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}  
        width={600}
      >
        <XAxis dataKey="dt_txt" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line 
            activeDot={{ r: 8 }} 
            dataKey="main.temp" 
            stroke="#8884d8" 
            type="monotone" 
        />
        <Line 
            dataKey="main.pressure" 
            stroke="#82ca9d" 
            type="monotone" 
        />
      </LineChart>
    );
};

function checkTableRefresh(obj1, obj2) {
    return ! Utils.isObjectSame(obj1, obj2, ["user_id", "start_execution_time", "end_execution_time"], true);
}

const tableObjTemplate = {
    type: "table",
    columns: { 
    },
    resource: {},
    context: {}, 
    tableProperties : {
        pagination: {
            pagesize: 5,
            type: "client"
        },
        compact: 'very',
        id: ""
    }
}

function getTableObj(data, context) {
    let tableObj = Object.assign({}, tableObjTemplate);
    tableObj.columns = 
    {   
        dt_txt: { label: "TIME" },
        "main.pressure": { label: "PRESSURE (mPa)" },
        "main.humidity": { label: "HUMIDITY (%)" },
        "wind.speed": { label: "WIND SPEED (m/s)" },
        "main.temp": { label: "TEMPERATURE (K)" },
        "weather.description": { label: "DESCRIPTION" }
    };
    tableObj.data = data;
    tableObj.tableProperties.id = "DetailsTable";

    return tableObj;
}

function renderView(data, context, title) {
    return (
      <div id={data[0]["dt"]}>
        <Style.TimelineContentTitleContainer>{title}</Style.TimelineContentTitleContainer>
        <Style.TimelineContentDescriptionContainer>
          {descriptionRenderer(data, context, title)}
        </Style.TimelineContentDescriptionContainer>
        <Style.TimelineContentChartContainer>
          <Style.TimelineContentChartTitle>Rainfall Received</Style.TimelineContentChartTitle>
          {renderRainfallBarCodeChart(data, context, title)}
        </Style.TimelineContentChartContainer>
        <Style.TimelineContentChartContainer>
          <Style.TimelineContentChartTitle>Temperature vs Pressure</Style.TimelineContentChartTitle>
          {renderTempLineChart(data, context, title)}
        </Style.TimelineContentChartContainer>
        <Style.TimelineContentTableContainer className='small-table'>
          <Table properties={getTableObj(data, context)} />
        </Style.TimelineContentTableContainer>
      </div>
    );
}

export const timelineRenderers = function(data) {
    let description = "Details";
    let epochStartTime = data[0]["dt"] * 1000;
    let epochEndTime = data[data.length - 1]["dt"] * 1000;
    let startTime = Utils.get_yy_mm_dd_format_cur_date_form_epoch(epochStartTime); 
    let endTime = Utils.get_yy_mm_dd_format_cur_date_form_epoch(epochEndTime);

    let context = { startTime, endTime };
    return renderView(data, context, description);
}