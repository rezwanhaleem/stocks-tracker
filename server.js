//server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const http = require("http");
const favicon = require('express-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3001;
const app = express();

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use(cookieParser());

app.get('/ping', function (req, res) {
  return res.send('pong');
});

//------------------------Backend API-------------------------------
app.get("/api/players", async (req, res) => {
  try {
    let players = ['lol'];
    res.send(players);
  } catch (e) { console.log(e); }
});

app.get("/api/init", async (req, res) => {
  try {
    if (!req.cookies.twelveId) {
      res.cookie('twelveId', process.env.TWELVE_ID, {
        maxAge: 10 * 60 * 60 * 1000, // 1 hour
        secure: true,
        sameSite: true,
      });
    }

    res.send('Tracker Initiliazed');
  } catch (e) { console.log(e); }
});

app.post("/api/signout", async (req, res) => {
  try {
    res.clearCookie('userName');
    res.clearCookie('spreadsheetId');
    res.send('Signed Out!');
  } catch (e) { console.log(e); }
});
//------------------------Backend API END-------------------------------

const server = http.createServer(app);
const io = require("socket.io")(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => emitData(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const emitData = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("update", response);
};

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); 

server.listen(port);