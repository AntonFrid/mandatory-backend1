const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

const PORT = 8080;

let rooms = {};
let roomList = [];

try {
  const data = JSON.parse(fs.readFileSync('./roomList.json'));

  for (obj of data) {
    rooms[obj.name] = []
  }

  roomList = data;
} catch (err) {
  console.log(err);
}

for (let room in rooms) {
  fs.readFile(`./rooms/${room}.json`, (err, data) => {
    if (err) {
      console.log(err)
      return;
    }

    rooms[room] = JSON.parse(data);
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (room) => {
    socket.join(room, () => {
      socket.emit('messages', JSON.stringify(rooms[room]));
    });
  });

  socket.on('new_message', (res) => {
    let data = JSON.parse(res);
    rooms[data.room].push(data);

    fs.writeFile(`./rooms/${data.room}.json`, JSON.stringify(rooms[data.room]), err => {
      if (err) console.log(err);
    });

    socket.broadcast.to(data.room).emit('message', res);
  });

  socket.on('new_room', (data) => {
    roomList.push(JSON.parse(data));
    rooms[JSON.parse(data).name] = [];

    fs.writeFile(`./rooms/${JSON.parse(data).name}.json`, "[]", err => {
      if (err) console.log(err);
    });

    fs.writeFile(`./roomList.json`, JSON.stringify(roomList), err => {
      if (err) console.log(err);

      socket.broadcast.emit('rooms', JSON.stringify(roomList));
    });
  });

  socket.on('delete_room', (data) => {
    let index = roomList.findIndex(x => x.name == data);
    roomList.splice(index, 1);

    fs.unlink(`./rooms/${data}.json`, (err) => {
      if(err) {
        console.log(err);
        return;
      }
    })

    fs.writeFile(`./roomList.json`, JSON.stringify(roomList), err => {
      if (err) console.log(err);

      socket.broadcast.emit('rooms', JSON.stringify(roomList));
    });
  })

  socket.emit('rooms', JSON.stringify(roomList));
});

http.listen(PORT, () => {
  console.log('listening on ' + PORT);
});
