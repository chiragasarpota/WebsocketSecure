var fs = require("fs");

var privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/ws.alloapp.io/privkey.pem",
  "utf8"
);
var certificate = fs.readFileSync(
  "/etc/letsencrypt/live/ws.alloapp.io/fullchain.pem",
  "utf8"
);

var credentials = { key: privateKey, cert: certificate };
var https = require("https");

//pass in your credentials to create an https server
var httpsServer = https.createServer(credentials);
httpsServer.listen(8080);

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({
  server: httpsServer,
});

class Message {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

class Clients {
  constructor() {
    this.clientsList = {};
    this.saveClient = this.saveClient.bind(this);
  }
  saveClient(username, client) {
    this.clientsList[username] = client;
  }
}

const clients = new Clients();
var client_message = new Message("", "");
var parsedMsg = "";

function ws_send(type, data, client) {
  client_message.type = type;
  client_message.data = data;
  client.send(JSON.stringify(client_message));
}

wss.on("connection", (client) => {
  client.on("message", (data) => {
    console.log("Client has sent: " + data);
    try {
      parsedMsg = JSON.parse(data);
    } catch (err) {
      console.log("Data Parsing Error: " + err);
      client.close();
    }
    if (parsedMsg.type === "username") {
      clients.saveClient(parsedMsg.data, client);
    } else if (parsedMsg.type === "message") {
      ws_send(
        "message",
        parsedMsg.data,
        clients.clientsList[parsedMsg.to_user]
      );
    } else if (parsedMsg.type === "echo") {
      ws_send("echo", parsedMsg.data, client);
    }
  });

  client.on("close", (reasonCode, description) => {
    console.log("Client has disconnected ");
  });
  //ws_send("message", "Hi this is server WS new", client);
});
