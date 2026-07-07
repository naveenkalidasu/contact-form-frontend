const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store users and messages
let users = {};
let messageHistory = [];

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/chat', (req, res) => {
    const username = req.body.username;
    if (!username || username.trim() === '') {
        return res.redirect('/');
    }
    res.render('chat', { username: username.trim() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send message history to new user
    socket.emit('messageHistory', messageHistory);

    // Handle user joining
    socket.on('join', (username) => {
        if (!username || username.trim() === '') {
            return;
        }
        
        username = username.trim();
        users[socket.id] = username;
        
        // Add system message
        const joinMessage = {
            system: true,
            text: `${username} has joined the chat`,
            timestamp: Date.now()
        };
        messageHistory.push(joinMessage);
        
        // Broadcast to everyone except the new user
        socket.broadcast.emit('userJoined', username);
        
        // Send the join message to everyone
        io.emit('chatMessage', joinMessage);
        
        // Update user count for everyone
        io.emit('updateUserCount', Object.keys(users).length);
        
        console.log(`${username} joined the chat. Total users: ${Object.keys(users).length}`);
    });

    // Handle chat messages
    socket.on('chatMessage', (msg) => {
        const username = users[socket.id];
        if (!username || !msg || msg.trim() === '') {
            return;
        }
        
        const message = {
            username: username,
            text: msg.trim(),
            timestamp: Date.now()
        };
        
        messageHistory.push(message);
        
        // Broadcast to all clients including sender
        io.emit('chatMessage', message);
        console.log(`[${username}]: ${msg}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            delete users[socket.id];
            
            // Add system message
            const leaveMessage = {
                system: true,
                text: `${username} has left the chat`,
                timestamp: Date.now()
            };
            messageHistory.push(leaveMessage);
            
            // Broadcast to everyone
            io.emit('userLeft', username);
            io.emit('chatMessage', leaveMessage);
            io.emit('updateUserCount', Object.keys(users).length);
            
            console.log(`${username} left the chat. Total users: ${Object.keys(users).length}`);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
