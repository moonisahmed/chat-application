

var userList = ['x'];
var chatHist = [];
var anonCount = 0;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

//app.use(express.static('client'));
app.use(express.static(__dirname + '/client'));
var io = require('socket.io')(server);


io.on('connection', function (socket) {
    console.log('a user connected');
    
    socket.on('message', function (name,msg,time) {
        
        chatHist.push({name:name,message:msg,time:time});
        
        //io.emit('message', msg);
        console.log('message: '+ msg);

        //time stuff
        var dt = new Date();
        var utcDate = dt.toUTCString();
        //var timeStamp = Math.floor(Date.now()/1000);        
        //console.log(utcDate);
        //io.emit('time',utcDate);
        
        //Nickname stuff
        if(name ==="")
        {
            name = "anon" + anonCount.toString();
            anonCount++;
        }
        
        if(!userList.includes(name.toLowerCase()))
        {
            userList.push(name.toLowerCase());
            io.emit('newUser',name,chatHist);
            console.log("New User entered:", name);
        }
        //var timeAndMessage = [utcDate,msg]; 
        io.emit('test',name, msg, utcDate);
        console.log('server test');
    });
    /*
    socket.on('name', function (name) { 
        
       
        
        io.emit('name',name);
    });
    
    */
    socket.on('disconnect', function () {
    console.log("User disconnected");
    });
    
   
    
   
});


server.listen(8080, function() {
  console.log('Chat server running');
});



