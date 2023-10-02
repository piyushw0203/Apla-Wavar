const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('playerMove', (data) => {
        socket.broadcast.emit('playerMove', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
