const app = require('express')();
const http = require('http').createServer(app);
const mongoose = require('mongoose');

const socketio = require('socket.io');
const io = socketio(http);

const mongoDB = "mongodb+srv://ckmobile:ckmobile123@cluster0.fykanxv.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected'))
  .catch(err => console.log(err));

const {addUser, getUser, removeUser} = require('./helper');

const PORT = process.env.PORT || 5000

const Room = require('./models/Room');

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('create-room', name=> {
    // console.log('Then room name received is ', name);
    const room = new Room({name});
    room.save().then(result => {
      io.emit('room-created', result)
    });
  });
  socket.on('join', ({name, room_id, user_id}) => {
    const {error, user} = addUser({
      socket_id: socket.id,
      name,
      room_id,
      user_id
    })
    socket.join(room_id);
    if (error) {
      console.log('join error', error);
    } else {
      console.log('join user', user);
    }
  })
  socket.on('sendMessage', (message, room_id, callback) => {
    const user = getUser(socket.id);
    const msgToStore = {
      name: user.name,
      user_id: user.user_id,
      room_id,
      text: message
    }
    console.log('message', msgToStore);
    io.to(room_id).emit('message', msgToStore);
    callback();
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
  })
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
