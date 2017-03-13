

var userList = ["x"];
var users= [];
var chatHist = [];
var anonCount = 0;
var express = require('express');
var app = express();
var cookieValue;
var http = require('http');
var server = http.Server(app);

//app.use(express.static('client'));
app.use(express.static(__dirname + '/client'));
var io = require('socket.io')(server);


io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('serverUpdate', users,chatHist);
    
    socket.on("updateUsers", function(user){
       users = user;
    
    });
    
    socket.on("updateUserList", function(user){
       userList = user; 
    });
    
    socket.on('message', function (msg,name,color) {
        if(msg.startsWith("/"))
            {
                if(msg.substring(1,5) === "nick")
                {
                    io.emit("userUpdate",name, msg.substring(6,msg.length),"nick",users,userList);
                }
                if(msg.substring(1,6) === "color")
                {
                     io.emit("userUpdate",name,msg.substring(7,msg.length),"color",users,userList);
                }
                if(msg.substring(1,7) === "colour")
                {
                     io.emit("userUpdate",name,msg.substring(8,msg.length),"color",users,userList);
                }
            }
        else{
        
        //chatHist.reverse();
        console.log('message: '+ msg);

        //time stuff
        var dt = new Date();
        var utcDate = dt.toUTCString();
        
        //Nickname stuff
        if(name ==="")
        {
            name = "anon" + anonCount.toString();
            anonCount++;
        }
        
        if(chatHist.length >200)
            {
                chatHist.shift();
            }
        
        
        for(var user in users)
            {
                if(users[user].name.toLowerCase() === name.toLowerCase())
                    {
                        color = users[user].color;
                        console.log(color + "color");
                        console.log(users[user.color] + "Usercolor");
                    }
                    }

        chatHist.push({name:name,message:msg,time:utcDate,color:color});

        if(!userList.includes(name.toLowerCase()))
        {
            userList.push(name.toLowerCase());
            users.push({name:name.toLowerCase(),color:color});
            io.emit('newUser',name,chatHist,color,users);
            console.log("New User entered:", name);
        }
        
        io.emit('test',name, msg, utcDate,color);
        console.log('sent to client');}
    });

    socket.on('disconnect', function () {
        
    console.log("User disconnected");
    });
    
   
    
   
});


server.listen(8080, function() {
  console.log('Chat server running');
});

    



