const WebSocket = require('ws');


for (i = 0; i < 5000; i++) {
    var ws = new WebSocket('ws://167.71.225.169:8080/');        
    ws.addEventListener('open',() =>{
    }); 
  }