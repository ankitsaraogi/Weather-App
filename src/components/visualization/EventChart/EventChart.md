Basic Event Chart:

```js
    var data = [
            {
                event_type: 'Blacklisted Apps',
                event_time: 1495491600000,
                event_cnt: 1
            },
            {
                event_type: 'Suspicious Apps',
                event_time: 1495489500000,
                event_cnt: 1
            },
            {
                event_type: 'New Apps',
                event_time: 1495486800000,
                event_cnt: 1
            }
        ];
    
        var endTime =  +new Date('May 23, 2017 04:00:00');
        var startTime = endTime - 24*1* 1000* 60 * 60;
        
          <EventChart
                data={data}
                type="linear"
                columnNames={{"eventType": "event_type", "time": "event_time", "eventCnt": "event_cnt"}}
                timeLevel="hour"
                startTime={startTime}
                endTime={endTime}
                options={{
                    eventTypes: ['Blacklisted Apps','Suspicious Apps','New Apps'],
                    width: 800,
                    height: 100,
                    shape: "circle",
                    shapeMinSize: 4,
                    shapeMaxSize: 4,
                    bands: true,
                    bandColor:"#f9fafe",
                    bandStroke: true,
                    colorScheme: "sequential",
                    legend: false,
                    colorbrewerRange: ["Blues",7],
                    bins: 7,
                    partition: false,
                    showTimeChart:false,
                    axisLines:false,
                    axisFont:"1.2vmin",
                    axisTransY:16,
                    autoResize: false
                }}
              
          />

```