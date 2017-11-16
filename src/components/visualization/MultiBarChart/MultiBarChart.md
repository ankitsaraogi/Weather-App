Basic Group Bar Chart:

```js
var data = {

    "Data Uploaded" : {
        "This User": 146800640,
        "Baseline": 52428800,
        "Threshold": 104857600
    },
    "Data Downloaded" : {
        "This User": 209715200,
        "Baseline": 73400320,
        "Threshold": 125829120
    }
} ;

var data1 = [
    { "type": "Data Uploaded", "This User": 146800640, "Baseline": 52428800, "Threshold": 104857600 },
    { "type": "Data Downloaded", "This User": 209715200, "Baseline": 73400320, "Threshold": 125829120 }
];

<MultiBarChart
    type="group"
    options={{
        width: 500,
        height: 300,
        margin: {top: 25, right: 0, bottom: 20, left: 30},
        fillColors: ["#009fe6", "#666b75", "#0dbcaf", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"] ,
        numberFormat: "value",
        showLegend: true,
        legendPos: 230,
        legendPadding:80,
        autoResize: false
    }}
    data={data}
/>

```