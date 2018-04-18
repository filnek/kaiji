var sock = io();


sock.on('msg', onmsg);
sock.on('info', oninfo);
sock.on('side', onside);
sock.on('score', onscore);
function cl(number){
	sock.emit('action', number);
	document.getElementById(number).disabled=true;
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
	}else{
		document.getElementById('0').innerHTML='citizen';
		document.getElementById('1').innerHTML='citizen';
		document.getElementById('2').innerHTML='citizen';
		document.getElementById('3').innerHTML='emperor';		
	}
	document.getElementById('0').disabled=false;
	document.getElementById('1').disabled=false;
	document.getElementById('2').disabled=false;
	document.getElementById('3').disabled=false;
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

