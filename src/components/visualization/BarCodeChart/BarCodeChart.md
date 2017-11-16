BarCode Chart:

```js
    var data = [
            { event_type: 'Work Hours',event_time: 1495495200000,event_cnt: 1 },
            { event_type: 'Work Hours',event_time: 1495484400000,event_cnt: 1 },
            { event_type: 'Work Hours',event_time: 1495480800000,event_cnt: 1 },
            { event_type: 'Work Hours',event_time: 1495477200000,event_cnt: 1 },
            { event_type: 'Work Hours',event_time: 1495470000000,event_cnt: 1 }
        ];
    
    var endTime =  +new Date('May 23, 2017 24:00:00');
    var startTime = endTime - 24*1* 1000* 60 * 60;
    
        <BarCodeChart
            data={data}
            type="barcode"
            columnNames={{"eventType": "event_type", "time": "event_time", "eventCnt": "event_cnt"}}
            timeLevel="hour"
            startTime={startTime}
            endTime={endTime}
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
        />

```