var sock = io();
var pressedAlready=false;

sock.on('msg', onmsg);
sock.on('info', oninfo);
sock.on('side', onside);
sock.on('score', onscore);
sock.on('nxt', onnext);

function onnext(){
	pressedAlready=false;
}

function cl(number){
	if(!pressedAlready){
	pressedAlready=true;
	sock.emit('action', number);
	document.getElementById(number).disabled=true;
	document.getElementById(number).className='';
	}
}

function onscore(sc){
	document.getElementById('score').innerHTML=sc;
}

function onside(side){
	if(side==1){
		document.getElementById('0').innerHTML='citizen';
		document.getElementById('1').innerHTML='citizen';
		document.getElementById('2').innerHTML='citizen';
		document.getElementById('3').innerHTML='slave';
		
		document.getElementById('0').className='citizen';
		document.getElementById('1').className='citizen';
		document.getElementById('2').className='citizen';
		document.getElementById('3').className='slave';
	}else{
		document.getElementById('0').innerHTML='citizen';
		document.getElementById('1').innerHTML='citizen';
		document.getElementById('2').innerHTML='citizen';
		document.getElementById('3').innerHTML='emperor';	

		document.getElementById('0').className='citizen';
		document.getElementById('1').className='citizen';
		document.getElementById('2').className='citizen';
		document.getElementById('3').className='emperor';		
	}
	document.getElementById('0').disabled=false;
	document.getElementById('1').disabled=false;
	document.getElementById('2').disabled=false;
	document.getElementById('3').disabled=false;
	pressedAlready=false;
}

function onmsg(txt){
	document.getElementById('info').innerHTML+=txt;
	document.getElementById('info').innerHTML+="<br>";
	scrollDown();
}
function oninfo(txt){
	document.getElementById('info').innerHTML+='<a style="background-color:yellow">'+txt+'</a>';
	document.getElementById('info').innerHTML+="<br>";
	scrollDown();
}

function scrollDown(){
	  var elem = document.getElementById('info');
  elem.scrollTop = elem.scrollHeight;
}

var form = document.getElementById('chat-f');
form.addEventListener('submit', function(e){
	var input=document.getElementById('chat-i');
	var val = input.value;
	input.value='';
	sock.emit('msg', val);
	e.preventDefault();
});

