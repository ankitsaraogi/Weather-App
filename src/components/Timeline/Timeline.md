Message Block:

```js

let data = {
    clouds.all: 8,
    dt : 1510779600,
    dt_txt : "2017-11-15 21:00:00",
    main.grnd_level : 1027.78,
    main.humidity : 100,
    main.pressure : 1027.78,
    main.sea_level : 1028.74,
    main.temp : 286.43,
    main.temp_kf : -0.76,
    main.temp_max : 287.19,
    main.temp_min : 286.43,
    sys.pod : "n",
    weather.description : "clear sky",
    weather.icon : "02n",
    weather.id : 800,
    weather.main : "Clear",
    wind.deg : 252,
    wind.speed : 8.28,
};

let properties = {
    time: {
        day : "dt",
        key: "dt_txt"
    },
    content: {
        renderType: "score_change",
        properties: {
            score: { key : "weather.main", list: {
                high: { icon: "sun", value: "Clear", color: "#f2a945" },
                med: { icon: "cloud", value: "clouds",  color: "#aeb5c1" },
                low: { icon: "rain", value: "rain", color: "#ADD8E6" }
            } },
            change: { key: "main.temp" },
            content: { key: "weather.description" }
        }
    }
}

<TimelineComponent 
    id="Timeline" 
    properties={properties} 
    repos={data} 
/>

```


