const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/chat', (req, res) => {
    const username = req.body.username;
    res.render('chat', { username });
});

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('userJoined', username);
        io.emit('updateUser Count', Object.keys(users).length);
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', { msg, username: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('userLeft', username);
        io.emit('updateUser Count', Object.keys(users).length);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
