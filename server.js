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

//------------------------GOOGLE-------------------------------
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const request = require('request');

const spreadsheetId = process.env.GOOGLE_OPEN_SPREADSHEET_ID;

const creds = {
  "type": "service_account",
  "project_id": "stock-fright",
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY,
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT
};

const oauth2 = google.oauth2('v2');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

const googleUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/userinfo.email'
});

//------------------------GOOGLE END-------------------------------


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
        maxAge: 12 * 60 * 60 * 1000, // 12 hours
        secure: true,
        sameSite: true,
      });
    }

    res.send(googleUrl);
  } catch (e) { console.log(e); }
});

app.post("/api/auth", async (req, res) => {
  try {
    const code = req.body.code;

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);

    const userInfo = await oauth2.userinfo.get({
      auth: oauth2Client,
    });

    const authAccs = process.env.GOOGLE_AUTHORIZED_ACCOUNTS.split(",");

    if (authAccs.includes(userInfo.data.email)) {
      res.cookie('twelveId', process.env.TWELVE_ID, {
        maxAge: 12* 60 * 60 * 1000, // 12 hours
        secure: true,
        sameSite: true,
      });

      let userName;

      if (!userInfo.data.name) {
        userName = userInfo.data.email;
      }
      else {
        userName = userInfo.data.name;
      }

      res.cookie('userName', userName, {
        maxAge: 12 * 60 * 60 * 1000, // 12 hours
        secure: true,
        sameSite: true,
      });

      res.send("Authorized");
    }
    else {
      res.send("Not Authorized");
    }
  } catch (e) { console.log(e); }
});

app.post("/api/signout", async (req, res) => {
  try {
    res.clearCookie('userName');
    res.clearCookie('twelveId');
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