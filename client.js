class Message {
  constructor(type, data, user) {
    this.type = type;
    this.data = data;
    this.to_user = user;
  }
}

function ws_send(type, data, user, ws) {
  client_message.type = type;
  client_message.data = data;
  client_message.to_user = user;
  ws.send(JSON.stringify(client_message));
}

client_message = new Message();
var parsedMsg = "";

const text = document.getElementById("text_field");
const text_label = document.getElementById("text_label");
const username = document.getElementById("username");
const user_label = document.getElementById("user_label");

const sendto_username = document.getElementById("sendto_username");
const sendto_user_label = document.getElementById("sendto_user_label");

sendto_username.addEventListener("keydown", (e) => {
  let kc = e.which || e.keyCode;
  if (kc === 13) {
    const ws = new WebSocket("wss://ws.alloapp.io:8080/");

    const user_id = username.value;
    const sendto_user_id = sendto_username.value;

    username.style.display = "none";
    user_label.style.display = "none";
    sendto_username.style.display = "none";
    sendto_user_label.style.display = "none";

    text.style.display = "block";
    text_label.style.display = "block";
    ws.addEventListener("open", () => {
      text.addEventListener("keydown", (e) => {
        let kc = e.which || e.keyCode;
        if (kc === 13) {
          ws_send("message", text.value, sendto_user_id, ws);
          text.value = "";
        }
      });
      ws_send("username", user_id, "", ws);
    });

    ws.addEventListener("message", (e) => {
      parsedMsg = JSON.parse(e.data);
      var para = document.createElement("p");
      var node = document.createTextNode(parsedMsg.data);
      para.appendChild(node);
      document.body.appendChild(para);
    });
  }
});
