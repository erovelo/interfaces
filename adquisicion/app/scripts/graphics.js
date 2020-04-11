var ctx = document.getElementById('canvas-data').getContext('2d');
var callbackChartUpdate = undefined;
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'red',
                
            }, 
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'blue',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'yellow',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'pink',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'green',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'orange',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'maroon',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'olive',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'lime',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'aqua',
                
            },
            {
                data: [],
                borderDash: [8,4],
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'purple',
                
            },
            {
                data: []
            },
            {
                data: []
            },
            {
                data: []
            },
            {
                data: []
            },
            {
                data: []
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    delay: 3000,
                    onRefresh: function(chart) {
                        if(callbackChartUpdate != undefined) callbackChartUpdate(chart);
                    }
                }
            }]
        },
        legend: {
            display: false,
        }
    }
});