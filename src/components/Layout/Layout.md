Layout Config:

```js

var data = [
    {"dt":1510833600,"main":{"temp":299.52,"temp_min":299.52,"temp_max":300.168,"pressure":924.06,"sea_level":1019.63,"grnd_level":924.06,"humidity":55,"temp_kf":-0.65},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":3.03,"deg":14.0016},"sys":{"pod":"d"},"dt_txt":"2017-11-16 12:00:00"}
    ,{"dt":1510844400,"main":{"temp":297.46,"temp_min":297.46,"temp_max":297.949,"pressure":926.04,"sea_level":1022.17,"grnd_level":926.04,"humidity":64,"temp_kf":-0.49},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":80},"wind":{"speed":2.58,"deg":18.5002},"sys":{"pod":"n"},"dt_txt":"2017-11-16 15:00:00"}
    ,{"dt":1510855200,"main":{"temp":293.98,"temp_min":293.98,"temp_max":294.306,"pressure":925.92,"sea_level":1022.36,"grnd_level":925.92,"humidity":82,"temp_kf":-0.33},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":1.76,"deg":10.006},"sys":{"pod":"n"},"dt_txt":"2017-11-16 18:00:00"}
    ,{"dt":1510866000,"main":{"temp":291.37,"temp_min":291.37,"temp_max":291.531,"pressure":924.64,"sea_level":1021.07,"grnd_level":924.64,"humidity":94,"temp_kf":-0.16},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":1.3,"deg":18.0021},"sys":{"pod":"n"},"dt_txt":"2017-11-16 21:00:00"}
    ,{"dt":1510876800,"main":{"temp":290.273,"temp_min":290.273,"temp_max":290.273,"pressure":925.21,"sea_level":1021.95,"grnd_level":925.21,"humidity":93,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":1.16,"deg":201.502},"sys":{"pod":"n"},"dt_txt":"2017-11-17 00:00:00"},
    {"dt":1510887600,"main":{"temp":295.651,"temp_min":295.651,"temp_max":295.651,"pressure":927.11,"sea_level":1023.76,"grnd_level":927.11,"humidity":79,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":36},"wind":{"speed":1.96,"deg":194.002},"sys":{"pod":"d"},"dt_txt":"2017-11-17 03:00:00"},
    {"dt":1510898400,"main":{"temp":300.982,"temp_min":300.982,"temp_max":300.982,"pressure":926.28,"sea_level":1022.38,"grnd_level":926.28,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":32},"wind":{"speed":3.26,"deg":41.0007},"sys":{"pod":"d"},"dt_txt":"2017-11-17 06:00:00"},
    {"dt":1510909200,"main":{"temp":299.706,"temp_min":299.706,"temp_max":299.706,"pressure":924.17,"sea_level":1019.93,"grnd_level":924.17,"humidity":62,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":92},"wind":{"speed":3.52,"deg":57.5021},"rain":{"3h":0.425},"sys":{"pod":"d"},"dt_txt":"2017-11-17 09:00:00"}
];


const WeatherTable = {
    type: "table",
    columns: { 
        name: { label: "CITY" },
        speed: { label: "WIND SPEED", dataKey: "wind.speed" },
        temp: { label: "TEMPERATURE", dataKey: "main.temp" },
        pressure: { label: "PRESSURE", dataKey: "main.pressure" },
        humidity: { label: "HUMIDITY", dataKey: "main.humidity" },
        rainfall: { label: "RAINFALL TREND" }
    },
    tableProperties : {
        pagination: {
            pagesize: 5,
            type: "client"
        },
        id: "WeatherTable",
        searchId: "WeatherSearch",
    },
    data: data
}

const WeatherListLayout = {
    title: "Weather Report" ,
    containers: [
        {
            key: "components",
            properties: {
                type: "table",
                properties : WeatherTable
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

<Layout 
    containerCss={{ backgroundColor : "#FFF", margin: "0px", paddingLeft: "0px", padding: "0px" }}
    layoutProperties={WeatherListLayout} 
    titleCss={{ borderBottom: "1px solid #E0E6EB", "padding" : "10px 20px 10px 20px" }}
/>       
    

```