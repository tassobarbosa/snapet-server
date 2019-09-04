const express = require('express');
const app = express();
const url = require('url');
const fs = require("fs");
let shell = require('shelljs');

const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out');
 
app.get('/', function (req, res) {	
	var query = url.parse(req.url, true).query;
	var comando = query.porta4;
	var porcao = query.porcao;
	var nome = query.nome;
	var hora = query.hora;
	var min = query.min;
	var resposta = null;

	if(comando != null)
		resposta = ligaLED(comando, porcao);
	else{
		if(porcao == null)
			resposta = deletaHorario(nome);
		else
			resposta = gravaHorario(nome, porcao, hora, min);
	}


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

function gravaHorario(nome, porcao, hora, min){
	console.log("nome: "+nome);
	console.log("porcao: "+porcao);
	console.log("hora: "+hora);
	console.log("minuto: "+min);

	//Ja existe esse horario marcado?
	//shell.exec("crontab -l | grep \""+min+" "+hora+"\"");
	shell.exec("crontab -l | { cat; echo \""+min+" "+hora+" * * * cd scripts-motor && python motor"+porcao+".py #"+nome+"\"; } | crontab -");

	return 'refeicao: '+nome+' gravada com sucesso!';
}

function deletaHorario(nome){
	console.log("Vou deletar o: "+nome);

	return 'refeicao: '+nome+" deletada!";
}

process.on('SIGINT', function(){
	LED.writeSync(0);
	LED.unexport();
	process.exit();
});

app.listen(3000);
