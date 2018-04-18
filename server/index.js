const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const osc = require("osc");

const app = express();

app.use(function(req, res) {
  res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.isAlive = true;

  const sendMessage = message => {
    messageString = JSON.stringify(message.args);
    if (!ws) {
      return;
    }
    console.log("sending OSC message");
    ws.send(messageString);
  };
  const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5000
  });
  udpPort.open();
  // Open the socket.
  udpPort.on("ready", function() {
    console.log("OSC Port ready!");
  });
  udpPort.on("message", function(message) {
    console.log("OSC received:", message);
    sendMessage(message);
  });

  ws.on("message", function incoming(message) {
    console.log("ws received: %s", message);
  });
});

server.listen(4242, function listening() {
  console.log("Listening on %d", server.address().port);
});
