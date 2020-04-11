const fs = require('fs');
var HubNumOfChannles = 0;
var CurrentData = undefined;
var savedToFile = false;
var nameFile = "tmp-signal.dat";
var numSample = 0;

// Refresca los puertos
function HubRefreshPorts() {

    CytonGetPorts((ports) => {
        $("#select-port").empty();
        if(ports == null || ports == undefined || ports.length == 0)
        {
            $('#select-port').prepend('<option disabled>No hay puertos disponibles</option>');      
        }
        else
        {
            // Agregando puertos
            ports.forEach(p => {
                $("#select-port").append(new Option(p.comName, p.comName));
            });
        }
    })
}

function HubConnectOrDisconnect() {
    var isConnected = CytonIsConnected();
    if(isConnected) HubDisconnectToCyton();
    else HubConnectToCyton();
}

// Obtiene estado de Cyton
function HubUpdateCytonStatus() {
    var isConnected = false;
    var isStreaming = false;
    var isSimulating = false;

    isConnected = CytonIsConnected();
    if(isConnected) {
        isStreaming = CytonIsStreaming();
        isSimulating = CytonIsSimulating();
    }

    $("#icon-connected").removeClass().addClass(isConnected ? "icon-green" : "icon-red");
    $("#icon-streaming").removeClass().addClass(isStreaming ? "icon-green" : "icon-red");;
    $("#icon-simulating").removeClass().addClass(isSimulating ? "icon-green" : "icon-red");;
}

// Obtiene cyton status
function HubConnectToCyton() {
    var port = $("#select-port").val();
    if(port == null) alert("Debe seleccionar un puerto!");
    else
    {
        CytonConnect(port, HubOnCytonData, (isConnected) => {
            HubNumOfChannles = CytonGetNumberOfChannels();
            HubUpdateCytonStatus();
            $("#btn-connect").text("Desconectar");
        });
    }
}

function HubStartOrStopStreaming() {
    var isStreaming = CytonIsStreaming();
    if(!isStreaming) HubStartStreaming();
    else HubStopStreaming();
}

function HubStartStreaming() {
    CytonStartStreaming((isStreaming) => {
        HubUpdateCytonStatus();
        $("#btn-start").text("Detener");
        callbackChartUpdate = PaintOnChart;
    });
}

function HubStopStreaming() {
    CytonStopStreaming((isNotStreaming) => {
        HubUpdateCytonStatus();
        $("#btn-start").text("Iniciar");
    });
}

function HubDisconnectToCyton() {
    CytonDisconnect((isDisconnected) => {
        HubUpdateCytonStatus();
        $("#btn-connect").text("Conectar");
    });
}

function PaintOnChart(chart) {
    var isStreaming = CytonIsStreaming();
    if(isStreaming && CurrentData != undefined) {

        chart.data.datasets.forEach(function(dataset, index) {
            if(index < HubNumOfChannles) {
                dataset.data.push({
                    x: Date.now(),
                    y: CurrentData.channelData[index],
                });
            }
          });
    }
}

// Se manda a llamar cada vez que se adquiere datos del cyton
function HubOnCytonData(Data) {
    // console.log(Data); // Devuelve mucha información cyton
    CurrentData = Data;
    for(let i = 0; i < HubNumOfChannles; i++) {
        let cad = Data.channelData[i].toFixed(6) + " Volts.";
        $("#channel-"+i).text(cad);
    }

    if(savedToFile) HubSaveToFile(Data);
}

function HubStartRecordData(){
    var name = $("#input-name").val();
    if(name == null || name == undefined || name == "") alert("Debe ingresar un nombre");
    else
    {
        var today = new Date();
        var formattedDate = moment(today).format('YYYYMMDDHHMM');
        nameFile = "signal-" + name + "-" + formattedDate + ".dat";
        numSample = 0;
        savedToFile = true;
    }
}

function HubStopRecordData(){
    savedToFile = false;
}

function HubSaveToFile(Data) {
    var tNow = new Date();
    var tNowMs = tNow.getTime();
    let cad = `${numSample};${tNowMs};${HubNumOfChannles};`;
    for (let i = 0; i < HubNumOfChannles; i++) {
        cad += `${Data.channelData[i]};`;
    }
    cad += "\n";

    fs.appendFile(`${nameFile}`, cad, function (err) {
        if (err) throw err;
      });

    numSample++;
}