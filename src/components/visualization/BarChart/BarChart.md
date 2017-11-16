Basic Column Bar Chart:

```js
var data = [
        {"app_health_score_comp": "Latency", "score": 60 }, 
        {"app_health_score_comp": "Server State", "score": 20 }, 
        {"app_health_score_comp": "Resource", "score": 5 }, 
        {"app_health_score_comp": "Error", "score": 1 },
        {"app_health_score_comp": "Anomaly", "score": 4 }
    ];

<BarChart
    type="column"
    columnNames={{"category": "app_health_score_comp", "count": "score"}}
    options={{
        width: 420,
        height: 196,
        margin: {top: 25, right: 0, bottom: 0, left: 5},
        fillColor: "rgba(51,192,205,1)" ,
        negValColor: "#EF5350",
        fillBack: true,
        fillBackColor: "rgba(155,155,155,0.1)",
      	barHeight: 8,
        labels: true,
        lablePosX: "right",
        lablePosY: "top",
      	numberFormat: "value",
      	maxValue: 100,
        autoResize: false
    }}
    data={data}
/>

```

Mini Column Bar Chart:

```js
var data = [{"app_health_score_comp": "Latency", "score": 60 }];

<BarChart
    type="mini"
    columnNames={{"category": "app_health_score_comp", "count": "score"}}
    options={{
        width: 120,
        height: 50,
        margin: {top: 20, right: 0, bottom: 0, left: 20},
        fillColor: "rgba(51,192,205,1)" ,
        fillBack: true,
        fillBackColor: "rgba(155,155,155,0.1)",
      	barHeight: 8,
        labels: true,
        lablePosX: "before",
        lablePosY: "center",
      	numberFormat: "value",
      	maxValue: 100,
        autoResize: false
    }}
    data={data}
/>

```