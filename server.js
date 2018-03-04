var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function (socket) {

    // respond if user coonnected
    socket.broadcast.emit('newMessage', 'User online');
    // if add new message
    socket.on('newMessage', function(msg) {
        io.emit('newMessage', msg); //note: emoit for info chat got in
        console.log('New chat ' + msg);
    });
    // if user disconnect
    socket.on('disconnect', function(msg) {
        socket.broadcast.emit('newMessage', 'User left chat');
    })  
});

http.listen(3000, function() {
    console.log('Listen on 3000 ...');
});