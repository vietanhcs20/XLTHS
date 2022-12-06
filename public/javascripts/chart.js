var air = Highcharts.chart('air', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Air Condition'
    },

    xAxis: [{
        categories: [],
        tickWidth: 1,
        tickLength: 20
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Data (PPM)',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
    }, {}],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'CH4',
        type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: 'ppm'
        }

    }, {
        name: 'CH',
        type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: 'ppm'
        },

    }, {
        name: 'CO',
        type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: 'ppm'
        }

    }],
});

var temphumichart = Highcharts.chart('temp_humi', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Temperature - Humidity'
    },

    xAxis: [{
        categories: [],
        tickWidth: 1,
        tickLength: 20
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Temperature (°C)',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
    }, { // Secondary yAxis
        title: {
            text: 'Humidity(%)',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value}',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Humidity',
        type: 'column',
        yAxis: 1,
        data: [],
        tooltip: {
            valueSuffix: '%'
        }

    }, {
        name: 'Temperature',
        type: 'spline',
        data: [],
        tooltip: {
            valueSuffix: '°C'
        },
        zones: [{
            value: 10,
            color: '#ff0015'
        }, {
            value: 30,
            color: '#141107'
        }, {
            color: '#ff0015'
        }],
    }],
});

socket.on("server-send-humi-graph", function (data) {
    temphumichart.series[0].setData(data);
});

socket.on("server-send-temp-graph", function (data) {
    temphumichart.series[1].setData(data);
});

socket.on("server-send-ch4-graph", function (data) {
    const newData = data.map(item => +item)
    air.series[0].setData(newData);
});

socket.on("server-send-gas-graph", function (data) {
    const newData = data.map(item => +item)
    air.series[1].setData(newData);
});
socket.on("server-send-co-graph", function (data) {
    const newData = data.map(item => +item)
    air.series[2].setData(newData);
});

socket.on("server-send-date-graph", function (data) {
    temphumichart.xAxis[0].setCategories(data);
    air.xAxis[0].setCategories(data);
});
