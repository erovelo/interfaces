/* Constantes */
const Cyton = require('@openbci/cyton'); // SDK para Cyton
const fs = require('fs'); // Para escribir en archivos
var pathfiles = "app/data/";
var eegDataFile = "id_del_sujeto_EEG.dat";
var bufferCyton = "";
var bufferPacket = -1;

var Ourboard = undefined; // Creamos instancia para todos los protocolos
var callbackSample = undefined; // Funcion que se llama cada vez que obtnega una muestra

/* PROPIEDADES */
var Data = undefined; // Donde se almacenaran los datos de la adquisicion de señales

// Se Configura la tarjeta Cyton
function ConnectCyton(simulate, portname, callback) {

    // Si esta conectado, lo desconecto
    if(Ourboard != undefined && Ourboard.isConnected()) Ourboard.disconnect();

    // Configuramos si van a ser datos sinteticos (simulados)
    Ourboard = new Cyton({ simulate });

    bufferCyton = "";
    bufferPacket = -1;

    // Si es simulado conectamos
    if(!simulate && portname != undefined && portname != "")
        Ourboard.connect(portname).then(() => { if(callback != undefined) callback(Ourboard.isConnected())});
    else
        Ourboard.connect().then(() => { if(callback != undefined) callback(Ourboard.isConnected())});
}

// Devuelve lista de puertos conectados
function GetPortNames() {
    var aux = null;
    var ports = (new Cyton()).listPorts().then(ports => aux = ports);
    return aux;
}

// Para trasmision de datos y desconecta
function DisconnectCyton() {
    if(Ourboard.isConnected())
    {
        StopStreaming();
        return Ourboard.disconnect();
    }
    return true;
}

// Inicia la trasmision
function StartStreaming(callback) {
    if(Ourboard.isConnected)
    {
        callbackSample = callback;
        Ourboard.streamStart();
        Ourboard.on("sample", SaveDataFromCyton);
        return true;
    }
    else return false;
}


// Detiene la Trasmision
function StopStreaming() {
    if(Ourboard.isStreaming)
    {
        if(bufferCyton != undefined || bufferCyton != null)
        {
            fs.writeFile(pathfiles + eegDataFile, bufferCyton, (err) => {
                if(err) console.log("error: " + err)
                else console.log("saved data eeg file");
            });
        }

        return Ourboard.streamStop();
    }



    return true;
}

// Guarda los datos actuales
function SaveDataFromCyton(data) {
    var timeNow = new Date();
    var timeNowMs = timeNow.getTime();

    Data = data;
    bufferPacket++;
    let bff = "";
    let packet = bufferPacket;
    let ms = timeNowMs;
    let numChannels = Ourboard.numberOfChannels();

    var aux = {
        currentDate : timeNow,
        data : data,
        numChannels : numChannels,
        channels : data.channelData,
    };


    bff = packet + ";" + ms + ";" + numChannels + ";";
    for (let i = 0; i < numChannels; i++) {
        // (-0.000000000, 0.00000000 ) son Volts
        let channel = data.channelData[i].toFixed(8);
        bff += channel + ";" ;
    }

    bff += "\n";
    bufferCyton += bff;


    var aux = {
        currentDate : timeNow,
        data : data,
        numChannels : numChannels,
        channels : data.channelData,
    };

    if(callbackSample != null)
        callbackSample(aux);
}