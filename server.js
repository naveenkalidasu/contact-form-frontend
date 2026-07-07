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
const MAX_MESSAGES = 100; // Limit message history

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
        if (messageHistory.length > MAX_MESSAGES) {
            messageHistory = messageHistory.slice(-MAX_MESSAGES);
        }
        
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
        if (messageHistory.length > MAX_MESSAGES) {
            messageHistory = messageHistory.slice(-MAX_MESSAGES);
        }
        
        // Broadcast to all clients including sender
        io.emit('chatMessage', message);
        console.log(`[${username}]: ${msg}`);
    });

    // Handle typing indicator (optional)
    socket.on('typing', (isTyping) => {
        const username = users[socket.id];
        if (username) {
            socket.broadcast.emit('userTyping', { username, isTyping });
        }
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
            if (messageHistory.length > MAX_MESSAGES) {
                messageHistory = messageHistory.slice(-MAX_MESSAGES);
            }
            
            // Broadcast to everyone
            io.emit('userLeft', username);
            io.emit('chatMessage', leaveMessage);
            io.emit('updateUserCount', Object.keys(users).length);
            
            console.log(`${username} left the chat. Total users: ${Object.keys(users).length}`);
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 WebSocket server ready for connections`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    io.close(() => {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    io.close(() => {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
});
