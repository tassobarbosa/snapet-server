const express = require('express');
const app = express();
const url = require('url');

const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out');
 
app.get('/', function (req, res) {	
	var query = url.parse(req.url, true).query;
	var comando = query.porta4;
	var porcao = query.porcao;
	var nome = query.nome;
	var horario = query.horario;
	var resposta = null;

	if(comando != null)
		resposta = ligaLED(comando, porcao);
	else
		resposta = gravaHorario(nome, porcao, horario);

	res.send(resposta);
})

function ligaLED(comando, porcao){
	console.log("ligando led");
	LED.writeSync(parseInt(comando));
	setTimeout(desligaLED, 1000*parseInt(porcao));

	return 'comando executado\n';
}

function desligaLED(){
	LED.writeSync(0);
}

function gravaHorario(nome, porcao, horario){
	console.log("nome: "+nome);
	console.log("porcao: "+porcao);
	console.log("horario: "+horario);

	return 'horario gravado\n';
}


process.on('SIGINT', function(){
	LED.writeSync(0);
	LED.unexport();
	process.exit();
});

app.listen(3000);
