const mostrecentscore  = localStorage.getItem('mostrecentscore');
const finscore = document.getElementById("scorefin");
const nbq = localStorage.getItem('nbq');
finscore.innerText = mostrecentscore+"/"+nbq;


