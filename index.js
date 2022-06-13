//Se crea la instancia http y se importa la clase http
const http = require('http');
//Se crea la instancia express y se importa la clase express
//Express es un entorno de trabajo para aplicaciones web
const express = require('express');

//se crea una instacia app para inicializar express
const app = express();

//Se crea la instancia server para crear el servidor con la configuracion de app
const server = http.createServer(app);

//Se crea la instancia io y se importa la biblioteca de socket.io y se le pasa el servidor 
const io = require('socket.io')(server);

//con el metodo get de la instancia app se crea el servidor
//Como argumentos se tienen: req=request (peticion) y res= respond(respuesta)
app.get('/', function(req, res){
 //se lee el documento acel.html en la carpeta publi
 //sendFile es un metodo de la instancia res
 // __dirname tiene la direccionde la carpeta acelerometro
 //function es una funcion anónima 
  res.sendFile(__dirname + '/public/acel.html');
});

//Con el metodo listen de la instancia server escucha la peticion del cliente en el  puerto 8080
server.listen(8080, function(){
 console.log('server listening on port',8080);
});

//COMUNICACION SERIAL
// Use a Readline parser

const { SerialPort, ReadlineParser } = require('serialport')

// Use a `\r\n` as a line terminator
const parser = new ReadlineParser({
  delimiter: '\r\n',
})

const port = new SerialPort({
  path: '/dev/ttyACM0',
  baudRate: 115200,
})

port.pipe(parser)

port.on('open', () => console.log('Port open'))


 

parser.on('data', function(data){
//Se guardan los datos obtenidos en la variable acel
	let acel = data;
//Por medio de la consola se muestran los datos de la variable acel
	console.log(acel);
//Con el metodo emit de la instancia io se emiten los datos que se estan recibiendo en un evento llamado acel
	io.emit('acel',data)
});


port.on('close',() => console.log('Port close'))

