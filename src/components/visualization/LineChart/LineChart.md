<!-- Basic Sparkline Chart:

```js
const data = [
    {"srvr_res_time": "200","rpt_sample_time": "1483524027"}, 
    {"srvr_res_time": "200","rpt_sample_time": "1483527627"}, 
    {"srvr_res_time": "300","rpt_sample_time": "1483531227"}, 
    {"srvr_res_time": "800","rpt_sample_time": "1483534827"},
    {"srvr_res_time": "200","rpt_sample_time": "1483538427"}, 
    {"srvr_res_time": "400","rpt_sample_time": "1483542027"}, 
    {"srvr_res_time": "500","rpt_sample_time": "1483545627"}, 
    {"srvr_res_time": "200","rpt_sample_time": "1483549227"},
    {"srvr_res_time": "100","rpt_sample_time": "1483552827"}, 
    {"srvr_res_time": "200","rpt_sample_time": "1483556427"}, 
    {"srvr_res_time": "500","rpt_sample_time": "1483560027"}, 
    {"srvr_res_time": "600","rpt_sample_time": "1483563627"}
];

<LineChart 
    type="sparkline" 
    x={function(d) { return +d.rpt_sample_time}} 
    y={function(d) {return +d.srvr_res_time }}
    options={{
        width: 100,
        height: 50,
        margin: {top: 10, right: 10, bottom: 10, left: 10},
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
    data={data} />
```

Sparkline Chart with Highlighted Points:

```js
const data = [
    {"srvr_res_time": "200","anomaly": false,"rpt_sample_time": "1483524027"}, 
    {"srvr_res_time": "200","anomaly": false,"rpt_sample_time": "1483527627"}, 
    {"srvr_res_time": "300","anomaly": false,"rpt_sample_time": "1483531227"}, 
    {"srvr_res_time": "800","anomaly": false,"rpt_sample_time": "1483534827"},
    {"srvr_res_time": "200","anomaly": false,"rpt_sample_time": "1483538427"}, 
    {"srvr_res_time": "400","anomaly": true, "rpt_sample_time": "1483542027"}, 
    {"srvr_res_time": "500","anomaly": false,"rpt_sample_time": "1483545627"}, 
    {"srvr_res_time": "200","anomaly": false,"rpt_sample_time": "1483549227"},
    {"srvr_res_time": "100","anomaly": true, "rpt_sample_time": "1483552827"}, 
    {"srvr_res_time": "200","anomaly": false,"rpt_sample_time": "1483556427"}, 
    {"srvr_res_time": "500","anomaly": true, "rpt_sample_time": "1483560027"}, 
    {"srvr_res_time": "600","anomaly": false,"rpt_sample_time": "1483563627"}
];

<LineChart 
    type="sparkline" 
    x={function(d) { return +d.rpt_sample_time}} 
    y={function(d) {return +d.srvr_res_time }}
    h={function(d) {return d.anomaly }}
    options={{
        width: 100,
        height: 50,
        margin: {top: 10, right: 10, bottom: 10, left: 10},
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
    data={data} 
/>
```

<!-- ```js

/* let data = [
    {"appname_group":"SharePoint","rpt_sample_time":"1483524027","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483527627","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483531227","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483534827","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483538427","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483542027","total_attacks":"11"},{"appname_group":"SharePoint","rpt_sample_time":"1483545627","total_attacks":"10"},{"appname_group":"SharePoint","rpt_sample_time":"1483549227","total_attacks":"12"},{"appname_group":"SharePoint","rpt_sample_time":"1483552827","total_attacks":"13"},{"appname_group":"SharePoint","rpt_sample_time":"1483556427","total_attacks":"15"},{"appname_group":"SharePoint","rpt_sample_time":"1483560027","total_attacks":"13"},{"appname_group":"SharePoint","rpt_sample_time":"1483563627","total_attacks":"15"},{"appname_group":"SharePoint","rpt_sample_time":"1483567227","total_attacks":"15"},{"appname_group":"SharePoint","rpt_sample_time":"1483570827","total_attacks":"16"},{"appname_group":"SharePoint","rpt_sample_time":"1483574427","total_attacks":"17"},{"appname_group":"SharePoint","rpt_sample_time":"1483578027","total_attacks":"18"},{"appname_group":"SharePoint","rpt_sample_time":"1483581627","total_attacks":"18"},{"appname_group":"SharePoint","rpt_sample_time":"1483585227","total_attacks":"18"},{"appname_group":"SharePoint","rpt_sample_time":"1483588827","total_attacks":"20"},{"appname_group":"SharePoint","rpt_sample_time":"1483592427","total_attacks":"20"},{"appname_group":"SharePoint","rpt_sample_time":"1483596027","total_attacks":"24"},{"appname_group":"SharePoint","rpt_sample_time":"1483599627","total_attacks":"26"},{"appname_group":"SharePoint","rpt_sample_time":"1483603227","total_attacks":"26"},{"rpt_sample_time":"1483606827","total_attacks":"28"}
] 

let config = {
    type: 'sparkline',
    x: function(d) { return +d.rpt_sample_time ; },
    y: function(d) { return +d.total_attacks ; },
    options:{
        width: 100,
        height: 50,
        margin: {top: 10, right: 10, bottom: 10, left: 10},
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
    }
}

<LineChart type={t => (type=config.type)} x={config.x} y={config.y} data={data}/> */

``` --> -->