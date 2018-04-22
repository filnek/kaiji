var cards= [];
var opponentCards= [];
var mouseYSaved=0;
var flaggedToDelete=-1;
var opponentFlaggedToDelete=-1;
var isCardAlreadyOnTheTable=false;
var emperorFlipAnimation=-1;
var slaveFlipAnimation=-1;
var citizenFlipAnimation=-1;
var cardsSpliced=0;
var opponentCardsSpliced=0;
var player;
var side;
var readyForNextRound=false;
var readyForDraw=false;
var busyDoingStuff=false;
var endGameAnimation=0;
var winlosedraw;
var animationX = 800/2-180;
var chosencard;
var whichcard;
var waitingForPlayers=true;
var playerLeft=false;
var score='';
//SERVER - CLIENT SPECIFIC FUNCTIONS

var sock = io();
//sock.on('msg', onmsg);
sock.on('info', oninfo);
sock.on('side', onside);
sock.on('score', onscore);

function oninfo(txt){
	if(txt=='match starts, player1'){
		player=1;
		waitingForPlayers=false;
		playerLeft=false;
	}
	else if (txt=='match starts, player2'){
		player=2;
		waitingForPlayers=false;
		playerLeft=false;
	}
	else if (txt=='player1 has chosen a card' && player==2)
		opponentCards[0].chosen=true;
	else if (txt=='player2 has chosen a card' && player==1)
		opponentCards[0].chosen=true;	
	else if (txt=='player has disconnected, waiting for a new player...'){
		playerLeft=true;
		waitingForPlayers=true;
		score='';
	}
	else if (txt=='waiting for players')
	{
		waitingForPlayers=true;
		score='';
	}
	else if (txt=='player1 wins!')
	{
		endGame(1);
	}
	else if (txt=='player2 wins!')
	{
		endGame(2);
	}	
	else if (txt=='draw!')
	{
		endGame(3);
	}	
}
function onside(s){
	side=s;
	readyForNextRound=true;
}
function onscore(sc){
	score=sc;
}
//END OF SERVER - CLIENT SPECIFIC FUNCTIONS

function setup(){
	createCanvas(800,900);
		textSize(32);
	textAlign(CENTER);
	fill(250);
	stroke(255);
}

function startRound(){
	cards= [];
opponentCards= [];
flaggedToDelete=-1;
opponentFlaggedToDelete=-1;
isCardAlreadyOnTheTable=false;
emperorFlipAnimation=-1;
slaveFlipAnimation=-1;
citizenFlipAnimation=-1;
cardsSpliced=0;
opponentCardsSpliced=0;
endGameAnimation=0;
animationX = 800/2-180;
	
	
		if(side==1){
		var ctemp= new card(25,height,'c',1);
		cards.push(ctemp);
		ctemp= new card(215,height,'c',2);
		cards.push(ctemp);
		ctemp= new card(405,height,'c',3);
		cards.push(ctemp);
		ctemp= new card(595,height,'s',4);
		cards.push(ctemp);
		
		}else if(side==2){
		var ctemp= new card(25,height,'c',1);
		cards.push(ctemp);
		ctemp= new card(215,height,'c',2);
		cards.push(ctemp);
		ctemp= new card(405,height,'c',3);
		cards.push(ctemp);
		ctemp= new card(595,height,'e',4);
		cards.push(ctemp);
		}
		
		ctemp = new opponentCard(15,226,1);
		opponentCards.push(ctemp);
		ctemp = new opponentCard(150,226,2);
		opponentCards.push(ctemp);
		ctemp = new opponentCard(285,226,3);
		opponentCards.push(ctemp);
		ctemp = new opponentCard(420,226,4);
		opponentCards.push(ctemp);
}

function Draw(){ //draw like in game, not actually drawing anything
flaggedToDelete=-1;
opponentFlaggedToDelete=-1;
isCardAlreadyOnTheTable=false;
emperorFlipAnimation=-1;
slaveFlipAnimation=-1;
citizenFlipAnimation=-1;
endGameAnimation=0;
animationX = 800/2-180;	
}

function draw(){
	background(0);
	
	if(readyForNextRound && !busyDoingStuff){
		startRound();
		readyForNextRound=false;
	}
	if(readyForDraw && !busyDoingStuff){
		Draw();
		readyForDraw=false;
	}
	
	
	if(emperorFlipAnimation>-1){
		emperorFlipAnimation++;
		endGameAnimation++;
	if(emperorFlipAnimation>30)
		emperorFlipAnimation=30;
		animateEmperor();
	}
	if(citizenFlipAnimation>-1){
		endGameAnimation++;
		citizenFlipAnimation++;
	if(citizenFlipAnimation>30)
		citizenFlipAnimation=30;
		animateCitizen();
	}
	if(slaveFlipAnimation>-1){
		endGameAnimation++;
		slaveFlipAnimation++;
	if(slaveFlipAnimation>30)
		slaveFlipAnimation=30;
		animateSlave();
	}
	
	
	
	
	
	for(var i=0;i<opponentCards.length;i++){ //opponent's cards
	opponentCards[i].draw();
	opponentCards[i].putOnTable();
	if(opponentCards[i].rdyToDel)
	opponentFlaggedToDelete=i;
	}
	
	
	
	for(var i=0;i<cards.length;i++){ //your cards
		if(!mouseIsPressed){
			cards[i].pressed=false;
		}
		cards[i].draw();
		cards[i].moveUpping();
		cards[i].puttingDown();
		if(mouseX>=cards[i].x && mouseX<=cards[i].x+cards[i].width+cards[i].size && mouseY>=cards[i].y-cards[i].height-cards[i].size-cards[i].moveUp && mouseY<=cards[i].y-cards[i].moveUp && !cards[i].chosen){
			cards[i].selected=true;
			if(mouseIsPressed){
				cards[i].pressed=true;
				if(mouseYSaved==0)
					mouseYSaved=mouseY;
		}
		}
		else{
			cards[i].selected=false;
			cards[i].pressed=false;
		}
		cards[i].growing();
		
		if(cards[i].rdyToDel)
		flaggedToDelete=i;
	}
if(!mouseIsPressed)
	mouseYSaved=0;


if(flaggedToDelete>-1){
	cards.splice(flaggedToDelete,1);
	flaggedToDelete=-1;
	cardsSpliced++;
}
if(opponentFlaggedToDelete>-1){
	opponentCards.splice(opponentFlaggedToDelete,1);
	opponentFlaggedToDelete=-1;
	opponentCardsSpliced++;
}

if(endGameAnimation>200 && endGameAnimation<500){
	textSize(32);
	textAlign(CENTER);
	fill(250);
	stroke(255);
	if(winlosedraw==1){
		text('You Win!', width/2, height/2);
		for(var i=0;i<opponentCards.length;i++)
		opponentCards[i].x-=30;
		for(var i=0;i<cards.length;i++)
		cards[i].x+=30;
	}
	if(winlosedraw==2){
		text('You Lose!', width/2, height/2);
		for(var i=0;i<opponentCards.length;i++)
		opponentCards[i].x-=30;
		for(var i=0;i<cards.length;i++)
		cards[i].x+=30;
	}
	if(winlosedraw==3){
		text('Draw!', width/2, height/2);
		for(var i=0;i<cards.length;i++){
		if(cards[i].which==whichcard){
			cards[i].x+=30;
		}
		}
	}
	animationX-=30;

}
if(endGameAnimation==500){
	cards[chosencard].rdyToDel=true;
	emperorFlipAnimation=-1;
	citizenFlipAnimation=-1;
	slaveFlipAnimation=-1;
	animationX = width/2-180;
	endGameAnimation=0;
	busyDoingStuff=false;
}

//waiting for players text
var tex=''
if(playerLeft)
tex+='Player left, ';
if(waitingForPlayers)
tex+='waiting for players..';
text(tex,width/2,height/2);

//score text
textSize(12);
text(score,width/2,height/2+height+height/4);
textSize(32);
}

function moveLeft(movel,which){
	for(var i=which-cardsSpliced;i<cards.length;i++){
		if(!cards[i].chosen)
		cards[i].x-=movel;
	}
}

function opponentMoveLeft(movel,which){
	for(var i=which-opponentCardsSpliced;i<opponentCards.length;i++){
		if(!opponentCards[i].chosen)
		opponentCards[i].x-=movel;
	}
}

function playerLeft(){
	 cards= [];
	opponentCards= [];
	flaggedToDelete=-1;
	opponentFlaggedToDelete=-1;
	isCardAlreadyOnTheTable=false;
	emperorFlipAnimation=-1;
	slaveFlipAnimation=-1;
	citizenFlipAnimation=-1;
	cardsSpliced=0;
	opponentCardsSpliced=0;	
}


function cardPutDown(which){	
sock.emit('action', which-1);	//for server
console.log('you put down a card');
}

card = function(x,y,type,which){
	this.size=0;
	this.x=x;
	this.y=y;
	this.type=type;
	this.selected=false;
	this.width=180;
	this.height=276;
	this.moveUp=0;
	this.pressed=false;
	this.chosen=false;
	this.which=which;
	this.moveL=190;
	this.rdyToDel=false;
	this.sent=false;
	this.startAnimation=-dist(x,0,-200,0);
	
	this.puttingDown = function (){
		if(this.chosen){
			this.size=-50;
			this.moveL/=2;
			moveLeft(this.moveL,this.which);
			
			if(endGameAnimation<1){
			this.x+=((width/2-(this.width-this.size)/2)-(this.x)+(this.width-this.size)/2)/2;
			this.y+=((height/2+(this.height-this.size)/2)-(this.y))/2;
			}
			if(dist((this.x)-(this.width-this.size)/2,this.y,(width/2-(this.width-this.size)/2),(height/2+(this.height-this.size)/2))<1 && this.moveL<1 && !this.sent){
				cardPutDown(this.which);
				this.sent=true;
				isCardAlreadyOnTheTable=true;
			}
			
		}
	}
	
	
	this.growing = function(){
		if(this.selected){
			if(this.size<10){
				this.size++;
			}
		}else{
			if(this.size>0){
				this.size--;
			}
		}
	}
	
	this.moveUpping = function(){
		if(this.pressed){
			this.moveUp=constrain(mouseYSaved-mouseY,0,150);
		}else{
			if(this.moveUp<140 || (isCardAlreadyOnTheTable && !this.chosen))
			this.moveUp/=1.5;
			else{
			this.chosen=true;
			chosencard=this.which-1-cardsSpliced;
			whichcard=this.which;
			}
		}
	}
	

		this.draw=function(){
		if(this.type=='c')
		image(citizenImg,this.x-this.size/2+this.startAnimation,this.y-this.size/2-this.moveUp,this.width+this.size,-this.height-this.size);
		else if(this.type=='e')
		image(emperorImg,this.x-this.size/2+this.startAnimation,this.y-this.size/2-this.moveUp,this.width+this.size,-this.height-this.size);
		else
		image(slaveImg,this.x-this.size/2+this.startAnimation,this.y-this.size/2-this.moveUp,this.width+this.size,-this.height-this.size);
		
		this.startAnimation/=1.2;
	}

}


opponentCard = function (x,y,which){
	this.which=which;
	this.x=x;
	this.y=y;
	this.height=226;
	this.width=130;
	this.moveL=135;
	this.chosen=false;
	this.rdyToDel=false;
	this.startAnimation=-dist(x,0,-200,0);
	this.draw=function(){
		image(reverseImg,this.x+this.startAnimation,this.y,this.width,-this.height);
		this.startAnimation/=1.2;
	}

this.putOnTable=function(){
	if(this.chosen){
			this.moveL/=2;
			opponentMoveLeft(this.moveL,this.which);
	
			this.x+=(width/2-(this.width/2)-(this.x)-(this.width/2)-116)/2;
			this.y+=(height/2+(this.height/2)-(this.y))/2;
	}
	
} 
	
}


function endGame(who){
	busyDoingStuff=true;
	opponentCards[0].rdyToDel=true;
	if(who==1){
		if(player==1){
			if(side==1){//opponent played emperor
			emperorFlipAnimation=0;
			winlosedraw=1;
			}
			else if(side==2 && whichcard==4){//opponent played citizen
			citizenFlipAnimation=0;
			winlosedraw=1;
			}else if(side==2 && whichcard!=4){//opponent played slave
			slaveFlipAnimation=0;
			winlosedraw=1;				
			}		
		}
		
		else if(player==2){
			if(side==1){//opponent played citizen
			citizenFlipAnimation=0;
			winlosedraw=2;
			}
			if(side==2){//opponent played slave
			slaveFlipAnimation=0;
			winlosedraw=2;
			}
		}
	}else if (who==2){ 
		if(player==2){
			if(side==1){//opponent played emperor
			emperorFlipAnimation=0;
			winlosedraw=1;
			}
			else if(side==2 && whichcard==4){//opponent played citizen
			citizenFlipAnimation=0;
			winlosedraw=1;
			}else if(side==2 && whichcard!=4){//opponent played slave
			slaveFlipAnimation=0;
			winlosedraw=1;				
			}			
		}
		
		else if(player==1){
			if(side==1){//opponent played citizen
			citizenFlipAnimation=0;
			winlosedraw=2;
			}
			else if(side==2){//opponent played slave
			slaveFlipAnimation=0;
			winlosedraw=2;
			}
		}		
	}else if (who==3){
		citizenFlipAnimation=0;
		winlosedraw=3;
		readyForDraw=true;
	}
}