var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

var users     = {};
var usernames = [];

io.on('connection', function (socket) {

    // respond if user coonnected
    socket.broadcast.emit('newMessage', 'User online');
    // when user register
    socket.on('registerUser', function(username) {
        if (usernames.indexOf(username) != -1) {
            socket.emit('registerRespond', false);
        } else {
            users[socket.id] = username;
            usernames.push(username);
            socket.emit('registerRespond', true);
            socket.emit('addOnlineUsers', usernames);
        }
    });

    // if add new message
    socket.on('newMessage', function(msg) {
        io.emit('newMessage', msg); //note: emit for info chat got in
        console.log('New chat ' + msg);
    });
    socket.on('newTyping', function(msg) {
        io.emit('newTyping', msg); //note: emit for info chat got in
    });

    // if user disconnect
    socket.on('disconnect', function(msg) {
        socket.broadcast.emit('newMessage', 'User left chat');

        var index = usernames.indexOf(users[socket.id]);
        usernames.splice(index, 1);

        delete users[socket.id];

        io.emit('addOnlineUsers', usernames);
    });  
});

http.listen(3000, function() {
    console.log('Listen on 3000 ...');
});