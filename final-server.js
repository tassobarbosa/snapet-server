var http = require('http');
var url = require('url');
let shell = require('shelljs');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output

var server = http.createServer(function(req, res) {
	res.writeHead(200, { "Content-type": "text/plain" });

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


	//res.send(resposta);
	res.end();
}).listen(3000, function() {
	    console.log('Server is running at 3000')
});


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
	shell.exec("crontab -l | grep -v "+nome+" | crontab -");
	return 'refeicao: '+nome+" deletada!";
}

process.on('SIGINT', function(){
	LED.writeSync(0);
	LED.unexport();
	process.exit();
});

