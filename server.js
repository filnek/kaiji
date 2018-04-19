'use strict';

let http = require('http');
let express = require ('express');
let socketio = require ('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

let spectators = [];

let player1;
let player2;

let p1 = [true,true,true,true];
let p2 = [true,true,true,true];

let side;

let p1chosen=-1;
let p2chosen=-1;

let p1wins=0;
let p2wins=0;


io.on('connection', onConnection);


app.use(express.static('huh'));

server.listen(8080,() => console.log('Server started. Listening on 8080'));

function onConnection(sock){
	console.log('user connected');
	sock.emit('info', 'connected to server');
	sock.on('msg', (txt) => io.emit('msg', txt));
	
	if(player1 || player2){
		//match starts
		if(player1)
		player2 = sock;
		else if(player2)
		player1 = sock;
		player1.emit('info', 'match starts, player1');
		player2.emit('info', 'match starts, player2');
		if(Math.round(Math.random())){
		player1.emit('side', 1);
		player2.emit('side', 2);
		console.log('rolled 1');
		side=1;
		}else{
		player1.emit('side', 2);
		player2.emit('side', 1);
		console.log('rolled 0');
		side=0;		
		}

		player1.on('action', function(number){
			console.log('p1 pressed'+number);

			if(p1[number] && p1chosen==-1){
			globalEmit('info','player1 has chosen a card');
			p1chosen=number;
			p1[number]=false;
			if(p2chosen>-1){
				if(side==1){ //p1 cccs p2 ccce
					
					if(p1chosen==3&&p2chosen==3){
						gameWon(1);
					}else if(p1chosen==3&&p2chosen!=3){
						gameWon(2);
					}else if (p2chosen==3 && p1chosen!=3){
						gameWon(2);					
					}else{
						draw();
					}
					}else{ //p1 ccce p2 cccs
					if(p1chosen==3&&p2chosen==3){
						gameWon(2);
					}else if(p1chosen!=3&&p2chosen==3){
						gameWon(1);
					}else if (p1chosen==3 && p2chosen!=3){
						gameWon(1);					
					}else{
						draw();
					}						
					}
					p1chosen=-1;
					p2chosen=-1;
			}
			}
		});
		
		
		player2.on('action', function(number){
			console.log('p2 pressed'+number);
			if(p2[number] && p2chosen==-1){
			globalEmit('info','player2 has chosen a card');
			p2chosen=number;
			p2[number]=false;
			if(p1chosen>-1){
				if(side==1){ //p1 cccs p2 ccce
					
					if(p1chosen==3&&p2chosen==3){
						gameWon(1);
					}else if(p1chosen==3&&p2chosen!=3){
						gameWon(2);
					}else if (p2chosen==3 && p1chosen!=3){
						gameWon(2);					
					}else{
						draw();
					}
					}else{ //p1 ccce p2 cccs
					if(p1chosen==3&&p2chosen==3){
						gameWon(2);
					}else if(p1chosen!=3&&p2chosen==3){
						gameWon(1);
					}else if (p1chosen==3 && p2chosen!=3){
						gameWon(1);					
					}else{
						draw();
					}						
					}
					p1chosen=-1;
					p2chosen=-1;
			}
			}
		});
		

	
		

	
    player2.on('disconnect', function(){
        console.log('player2 disconnected');
		if(player1)
		player1.emit('info','player has disconnected, waiting for a new player...');
		player2=null;
		resetGame();
    });
		
	    player1.on('disconnect', function(){
        console.log('player1 disconnected');
		if(player2)
		player2.emit('info','player has disconnected, waiting for a new player...');
		player1=null;
		resetGame();
    });		
		
	}else{
		player1= sock;
		sock.emit('msg', 'waitin for player');
		
	    player1.on('disconnect', function(){
        console.log('player1 disconnected');
		if(player2)
		player2.emit('info','player has disconnected, waiting for a new player...');
		player1=null;
		resetGame();
    });	
	}
	
	
	}
	
	
	function gameWon(player){
		if(player==1){
		player1.emit('info', 'player1 wins!');
		player2.emit('info', 'player1 wins!');
		p1wins++;
		
		}
		if(player==2){
		player1.emit('info', 'player2 wins!');
		player2.emit('info', 'player2 wins!');	
		p2wins++;
		}
		nextRound();
	}
	
	function globalEmit(type,txt){
		player1.emit(type,txt);
		player2.emit(type,txt);			
	}
	

	function resetGame(){
        nextRound();
		p1wins=0;
		p2wins=0;
		if(player1)
		player1.emit('score','you:0, opponent:0');
		if(player2)
		player2.emit('score','you:0, opponent:0');
	}
	
	function nextRound(){
		
		if(player1){		
		player1.emit('score','you:'+p1wins+', opponent:'+p2wins);
		}
		if(player2)
		{
		player2.emit('score','you:'+p2wins+', opponent:'+p1wins);
		}
		
		p1 = [true,true,true,true];
		p2 = [true,true,true,true];

		p1chosen=-1;
		p2chosen=-1;
		
		
		console.log('--NEXT ROUND--');
		
		if(Math.round(Math.random())){
		if(player1)
		player1.emit('side', 1);
		if(player2)
		player2.emit('side', 2);
		console.log('rolled 1');
		side=1;
		}else{
		if(player1)
		player1.emit('side', 2);
		if(player2)
		player2.emit('side', 1);
		console.log('rolled 0');
		side=0;		
		}
	}
	
	function draw(){
						globalEmit('info','draw!');
						if(player1)
						player1.emit('nxt',null);
						if(player2)
						player2.emit('nxt',null);		
	}
