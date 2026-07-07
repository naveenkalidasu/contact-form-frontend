<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💬 Live Chat</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="glass-card">
        <div class="chat-header">
            <h2><i class="fas fa-comment"></i> Chat</h2>
            <div class="user-badge">
                <span class="pulse-dot"></span>
                <i class="fas fa-user"></i> <strong id="currentUsername"><%= username %></strong>
                <a href="/" id="logoutLink" class="logout-link"><i class="fas fa-sign-out-alt"></i></a>
            </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
            <div class="user-count">
                <i class="fas fa-users"></i> <span id="userCount">0</span> online
            </div>
        </div>

        <div id="messages"></div>

        <form id="messageForm" class="chat-form">
            <input type="text" id="messageInput" placeholder="Type a message..." autocomplete="off" required>
            <button type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
        </form>
    </div>

    <!-- Socket.IO Client -->
    <script src="/socket.io/socket.io.js"></script>
    
    <script>
        (function() {
            const username = '<%= username %>';
            const messagesDiv = document.getElementById('messages');
            const messageForm = document.getElementById('messageForm');
            const messageInput = document.getElementById('messageInput');
            const userCountSpan = document.getElementById('userCount');
            const logoutLink = document.getElementById('logoutLink');

            // Connect to Socket.IO
            const socket = io();

            // Function to add a message to the UI
            function addMessageToUI(message) {
                const div = document.createElement('div');
                div.className = 'msg';
                
                if (message.system) {
                    div.classList.add('system');
                    div.innerHTML = `<i class="fas fa-info-circle"></i> ${escapeHtml(message.text)}`;
                } else {
                    const time = new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                    div.innerHTML = `<strong>${escapeHtml(message.username)}</strong> ${escapeHtml(message.text)} <span class="timestamp">${time}</span>`;
                }
                
                messagesDiv.appendChild(div);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            function escapeHtml(text) {
                if (!text) return '';
                const map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
            }

            // Receive message history
            socket.on('messageHistory', (history) => {
                history.forEach(msg => addMessageToUI(msg));
            });

            // Join the chat
            socket.emit('join', username);

            // Handle incoming messages
            socket.on('chatMessage', (data) => {
                addMessageToUI(data);
            });

            // Handle user joined
            socket.on('userJoined', (user) => {
                addMessageToUI({
                    system: true,
                    text: `${escapeHtml(user)} has joined the chat`,
                    timestamp: Date.now()
                });
            });

            // Handle user left
            socket.on('userLeft', (user) => {
                if (user) {
                    addMessageToUI({
                        system: true,
                        text: `${escapeHtml(user)} has left the chat`,
                        timestamp: Date.now()
                    });
                }
            });

            // Update user count
            socket.on('updateUserCount', (count) => {
                userCountSpan.textContent = count;
            });

            // Handle form submission
            messageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const text = messageInput.value.trim();
                if (!text) return;

                // Send message via Socket.IO
                socket.emit('chatMessage', text);
                messageInput.value = '';
                messageInput.focus();
            });

            // Handle logout
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                socket.disconnect();
                window.location.href = '/';
            });

            // Focus input on load
            messageInput.focus();

        })();
    </script>
</body>
</html>
