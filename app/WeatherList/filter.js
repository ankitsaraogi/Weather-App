
const filterProps = {
    groups: [
        {
            type: "rangeslider",
            properties: [
                {
                    dependent: "humidity",
                    props: {
                        minValue: 0,
                        maxValue: 100,
                        id: "humidityRange",
                        filterId: "WeatherFilter"
                    },
                    filterCallback: function(result, column, range, key) {
                        if (result["main"][column] >= range[key]['value'][0] && result["main"][column] <= range[key]['value'][1])
                            return true;
                            
                        return false;
                    }
                }
            ],
            label: "Humidity"
        },
        {
            type: "checkbox",
            properties: [
                {
                    dependent: "temp",
                    props: {
                        label: "High ( > 15)",
                        id: "highTemp",
                        filterId: "WeatherFilter"
                    },
                    filterCallback: function(result, column) {
                        if (result["main"][column] > 15)
                            return true;
                            
                        return false;
                    }
                },
                {
                    dependent: "temp",
                    props: {
                        label: "Moderate ( >= 10)",
                        id: "moderateTemp",
                        filterId: "WeatherFilter"
                    },
                    filterCallback: function(result, column) {
                        if (result["main"][column] <= 15 && result["main"][column] >= 10)
                            return true;
                            
                        return false;
                    }
                },
                {
                    dependent: "temp",
                    props: {
                        label: "Low ( < 10)",
                        id: "lowTemp",
                        filterId: "WeatherFilter"
                    },
                    filterCallback: function(result, column) {
                        if (result["main"][column] < 10)
                            return true;
                            
                        return false;
                    }
                }
            ],
            label: "Temperature"
        }
    ],
    compId: "WeatherTable",
    compType: "rdxTable",
    id: "WeatherFilter"
}

const filterLayout = {
    title: "Filter",
    titleCss: { "fontSize": "19px", color: "#6b788d" },
    containers: [
        {
            key: "components",
            properties: {
                type: "filter",
                properties : filterProps
            }
        }
    ]
};

export default filterLayout;
