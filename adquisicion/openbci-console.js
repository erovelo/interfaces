const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
const myCyton = require("./app/scripts/cyton");
const fs = require('fs');

var arrayPorts = null;
var saveFile = false;
var fileName = "";
var numSample = 0;
var numChannels = 0;

// Buscando puertos
console.log("Buscando puertos disponibles");
myCyton.CytonGetPorts((ports) => {
    if(ports)
    {
        arrayPorts = ports;
        for (let i = 0; i < ports.length; i++) {
            console.log(" ["+ i +"]: " + ports[i].comName);
        }
        console.log("");

        // Obteniendo puerto a conectar
        readline.question("Tecle el número de puerto a conectar: ", (portSelected) => {
            var index = parseInt(portSelected);
            if(!isNaN(index) && index < arrayPorts.length)
            {
                ConnectToCyton(index);
            }
            else console.error("Error: Puerto incorrecto!");
        });
          
    }
    else console.error("No se pudo obtener los puertos");
})

function ConnectToCyton(portIndex) {
    var port = arrayPorts[portIndex].comName;
    console.log("Conectando a " +  port);
    myCyton.CytonConnect(port, OnSample, (isConnected) => {
        if(isConnected)
        {
            numChannels = myCyton.CytonGetNumberOfChannels();
            console.log("Numero de canales: " + numChannels);
            readline.question("Desea guardar los datos en un archivo? [y/n]: ", (res) => {
                if(res == "y")
                {
                    saveFile = true;
                    GetFileName();
                }
                else 
                {
                    console.log("Cancelando operacion...");
                }
            });
        }
        else console.error("Error en conectarse al puerto");
    });
}

function OnSample(Data) {
    if(saveFile)
    {
        let tNow = new Date();
        let tNowMs = tNow.getTime();
        let cad = `${numSample};${tNowMs};${numChannels};`;
        for (let i = 0; i < numChannels; i++) {
            cad += `${Data.channelData[i]};`;
        }
        cad += "\n";

        fs.appendFile(`${fileName}`, cad, function (err) {
            if (err) throw err;
        });

        numSample++;
    }
}

function GetFileName() {
    readline.question("Nombre del archivo: ", (name) => {
        fileName = name;
        StartStreaming();
    });
}

function StartStreaming() {
    readline.question("Iniciar adquisición de datos? [y/n]: ", (res) => {
        if(res == "y")
        {
            myCyton.CytonStartStreaming((isStreaming) => {
                if(isStreaming)
                {
                    console.log("Adquiriendo datos (" + new Date() + ")");
                    StopStreaming();
                }
                else console.error("Error en adquisicion de datos");
            })
        }
        else readline.close();
    });
}

function StopStreaming() {
    readline.question("Detener adquisición de datos? [y/n]: ", (res) => {
        if(res == "y")
        {
            myCyton.CytonStopStreaming((isNotStreaming) => {
                if(isNotStreaming)
                {
                    console.log("Deteniendo adquisición (" + new Date() + ")");
                    DisconnectCyton();
                }
                else console.error("Error en detener adquisición");
            });
        }
    });
}

function DisconnectCyton() {
    console.log("Desconectando de cyton");
    myCyton.CytonDisconnect((isNotConnected) => {
        if(isNotConnected)
        {
            console.log("Desconectado");
            readline.close();
        }
    })
    
}