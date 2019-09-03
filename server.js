var http = require('http');
var url = require('url');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output

var server = http.createServer(function(req, res) {
	res.writeHead(200, { "Content-type": "text/plain" });
	var rasp = url.parse(req.url, true).query;
	var comando = rasp.porta4;
	var porcao = rasp.porcao;
	var nome = rasp.nome;
	var horario = rasp.horario;

	if(comando != null)
		ligaLED(comando, porcao);
	else
	var resposta = gravaHorario(nome, porcao, horario);

	res.send(resposta);
	res.end();
}).listen(3000, function() {
	    console.log('Server is running at 3000')
});


function ligaLED(comando, porcao){
	console.log("ligando led")
	LED.writeSync(parseInt(comando));
	setTimeout(desligaLED, 1000*parseInt(porcao));
}

function desligaLED(){
	LED.writeSync(0);
}

function gravaHorario(nome, porcao, horario){
	console.log("nome: "+nome);
	console.log("porcao: "+porcao);
	console.log("horario: "+horario);

	return 'salvo'
}

process.on('SIGINT', function () { //on ctrl+c
	  LED.writeSync(0); // Turn LED off
	  LED.unexport(); // Unexport LED GPIO to free resources 
	  process.exit(); //exit completely
});
