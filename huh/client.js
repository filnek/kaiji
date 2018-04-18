var sock = io();

sock.on('msg', onmsg);
sock.on('info', oninfo);
sock.on('side', onside);


function onside(side){
	if(side==1){
		document.getElementById('1').innerHTML='citizen';
		document.getElementById('2').innerHTML='citizen';
		document.getElementById('3').innerHTML='citizen';
		document.getElementById('4').innerHTML='slave';
	}else{
		document.getElementById('1').innerHTML='citizen';
		document.getElementById('2').innerHTML='citizen';
		document.getElementById('3').innerHTML='citizen';
		document.getElementById('4').innerHTML='emperor';		
	}
	document.getElementById('1').disabled=false;
	document.getElementById('2').disabled=false;
	document.getElementById('3').disabled=false;
	document.getElementById('4').disabled=false;
}

function onmsg(txt){
	document.getElementById('info').innerHTML+=txt;
	document.getElementById('info').innerHTML+="<br>";
}
function oninfo(txt){
	document.getElementById('info').innerHTML+='<a style="background-color:yellow">'+txt+'</a>';
	document.getElementById('info').innerHTML+="<br>";
}

var form = document.getElementById('chat-f');
form.addEventListener('submit', function(e){
	var input=document.getElementById('chat-i');
	var val = input.value;
	input.value='';
	sock.emit('msg', val);
	e.preventDefault();
});