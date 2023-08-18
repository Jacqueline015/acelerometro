//ACELEROMETRO
// Se inicializa la conexión de sockets creando una instancia socket
// Para la conexión se agrega la IP de la Rasp y el puerto utilizado
var socket = io();

// Se hace la interrupcion con el evento 'acel' y se reciben los datos
socket.on('acel', function (data) {
	// Los datos se muestran por consola en el Inspector
	// console.log(data);
	let acel = document.getElementById('aceleracion');
	//Se crea una variable para mostrar los datos que llegan del acelerómetro
	let msg = "X: " + data.x + "  Y: " + data.y + " Z:  " + data.z;
	acel.innerHTML = msg;
	//Lo que llega a data en X se manda a la primera posición del arreglo X
	ArrX[0] = data.x;
	console.log(ArrX);

	//Lo que llega a data en Y se manda a la primera posición del arreglo X
	ArrY[0] = data.y;
	console.log(ArrY);

	//Lo que llega a data en Z se manda a la primera posición del arreglo Z
	ArrZ[0] = data.z;
	console.log(ArrZ);

	//SE CREA UN AUXILIAR PARA ARREGLO X de 10 VALORES
	let auxX = new Array(200);

	//SE CREA UN AUXILIAR PARA ARREGLO Y de 10 VALORES
	let auxY = new Array(200);

	//SE CREA UN AUXILIAR PARA ARREGLO Y de 10 VALORES
	let auxZ = new Array(200);

	//SE CREA UN CONTADOR PARA RECORRER EL ARREGLO X
	for (let i = 0; i < 199; i++) {
		auxX[i + 1] = ArrX[i];
		//console.log(`valores de aux en ciclo = ${aux}`);
	}
	ArrX = auxX;
	//Se vuelve a colocar en la posición [0] del ArregloX
	ArrX[0] = data.x;

	//SE CREA UN CONTADOR PARA RECORRER EL ARREGLO Y
	for (let i = 0; i < 199; i++) {
		auxY[i + 1] = ArrY[i];
	}
	ArrY = auxY;
	//Se vuelve a colocar en la posición [0] del ArregloY
	ArrY[0] = data.y;

	//SE CREA UN CONTADOR PARA RECORRER EL ARREGLO Z
	for (let i = 0; i < 199; i++) {
		auxZ[i + 1] = ArrZ[i];
	}
	ArrZ = auxZ;
	//Se vuelve a colocar en la posición [0] del ArregloZ
	ArrZ[0] = data.z;

	//Se muestra la grafica indicando con datasets[0] que se refiere a la gráfica de X
	graficaX.data.datasets[0].data = ArrX;
	//Se actualizan los datos que van llegando
	graficaX.update();

	//Se muestra la grafica indicando con datasets[0] que se refiere a la gráfica de Y
	graficaY.data.datasets[0].data = ArrY;
	//Se actualizan los datos que van llegando
	graficaY.update();

	//Se muestra la grafica indicando con datasets[0] que se refiere a la gráfica de Z
	graficaZ.data.datasets[0].data = ArrZ;
	//Se actualizan los datos que van llegando
	graficaZ.update();
});

const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');

//ARREGLOS PARA CADA EJE
//Se crean las funciones con arreglos de 10 elementos.

//ARREGLO DEL EJE X:
let ArrX = new Array(200);
console.log(ArrX);

//ARREGLO DEL EJE Y:
let ArrY = new Array(200);
console.log(ArrY);

//ARREGLO DEL EJE Z:
let ArrZ = new Array(200);
console.log(ArrZ);

//ARREGLO PARA EL GRAFICO EN EL EJE X
function creaArreglo() {
	var arregloxd = [];

	for (let i = 0; i < 200; i++) {
		arregloxd.push(i);
	}
	//console.log(arregloxd);
	return arregloxd;

}
let nuevoArr = creaArreglo();

//DISEÑO DEL GRÁFICO
const labels = nuevoArr;
const data = {
	labels: labels,
	datasets: [
		{
			label: 'Eje X',
			data: ArrX,
			borderColor: "orange",
			fill: false

		}
	]
};

const data2 = {
	labels: labels,
	datasets: [
		{
			label: 'Eje Y',
			data: ArrY,
			borderColor: "red",
			fill: false
		}
	]	
};

const data3 = {
	labels: labels,
	datasets: [
		{
			label: 'Eje Z',
			data: ArrZ,
			borderColor: "green",
			fill: false
		}
	]	
};

//Se crea el gráfico para el eje X
let graficaX = new Chart(ctx, {
	type: 'line',
	data: data,
	options: {
        scales: {
			x:{
				title: {
					display: true,
					text: 'tiempo [s]'
				}
			},
            y: {
                suggestedMin: -160,
                suggestedMax: 50,
				title: {
					display: true,
					text: 'aceleración [g]'
				}
            }
        }
    }
});

//Se crea el gráfico para el eje Y
let graficaY = new Chart(ctx2, {
	type: 'line',
	data: data2,
	options: {
        scales: {
			x:{
				title: {
					display: true,
					text: 'tiempo [s]'
				}
			},
            y: {
                suggestedMin: 80,
                suggestedMax: 180,
				title: {
					display: true,
					text: 'aceleración [g]'
				}
            }
        }
    }
});

//Se crea el gráfico para el eje Z
let graficaZ = new Chart(ctx3, {
	type: 'line',
	data: data3,
	options: {
        scales: {
			x:{
				title: {
					display: true,
					text: 'tiempo [s]'
				}
			},
            y: {
                suggestedMin: 740,
                suggestedMax: 940,
				title: {
					display: true,
					text: 'aceleración [g]'
				}
            }
        }
    }
});


