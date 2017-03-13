var socket = io();
var currentName;
var changePossible = true;
//Random color generator
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//first form submited. Checks for cookie too.
$('form').submit(function () {
    var text = $('#message').val();
    var nickname = $('#name').val();
    //checkCookie();
    if(getCookie('username'))
        {
            nickname = getCookie('username');
            socket.emit('message', text, nickname,getRandomColor());
        }
    else{
            socket.emit('message', text, nickname,getRandomColor());    
    }
     
    $("#nameDivs").css("display","none");
    $('#message').val('');
    $('#name').val('');
    return false; 
});

//NewUser added and cookie is set
socket.on('newUser', function(name,chatHist,color,userList){
    setCookie("username",name,2);
    
    $('#chatName').html(name);
    $('#users').append($('<li class="list-group-item">').text(name).css({
        'backgroundColor':color}));

});

//Real time messages
socket.on('test', function(name,msg,time,color) {
    
    $('#history').append($('<h4 class="list-group-item">').text(msg).css({
        'font-weight':'bold','color':color}));
    $('#history').append($('<p>').text(time));
    $('#history').append($('<p>').text("By2: " + name).css({
        'font-weight':'bold','color':color}));
});

// Update Chat and User List on Connect
socket.on('serverUpdate', function(userList,chatHist) {
          var oldname = getCookie('username');
        $('#chatName').html(oldname);
         for(var user in userList)
        {
                $('#users').append($('<li class="list-group-item">').text(userList[user].name).css({
                    'backgroundColor':userList[user].color}));   
        }
    
        for(var chat in chatHist)
            {
        
        
                $('#history').append($('<h4 class="list-group-item">').text(chatHist[chat].message));
                $('#history').append($('<p>').text(chatHist[chat].time));
                $('#history').append($('<p class="currentUserHistory">').text("By: " + chatHist[chat].name).css({'color':chatHist[chat].color}));
                console.log(chatHist[chat].name);
    
        
            } 
    });

//Update user color or nickname
socket.on('userUpdate', function(currentName,newName,type,users,userList) {
        if(type === "nick")
        {
            for(var user in users)
                {
                    if(users[user].name === newName || isBlank(newName) )
                        {
                            changePossible = false;
                        }
                }
            if(changePossible)
                {
                    setCookie('username',newName,2);
                    for(var user in users)
                        {
                            console.log(users[user].name);
                            if(users[user].name === currentName)
                            {
                                users[user].name = newName;
                                $('#history').append($('<p>').text("Name changed to " + newName).css({'color':"red"}));
                                console.log("name changed users");
                                socket.emit("updateUsers",users);
                            }
                        }
                    for(var user in userList)
                        {
                            if(userList[user] === currentName)
                            {
                                userList[user] = newName;
                                //$('#history').append($('<p>').text("Name changed to "++newName).css({'color':"red"}));
                                console.log("name changed userlist");
                                socket.emit("updateUserList",userList);
                                
                            }
                        }
                    //io.emit('serverUpdate', users,chatHist);
                    
                }
            changePossible = true;
        }

        if(type === "color")
        {
            for(var user in users)
                        {
                            if(users[user].name === currentName)
                            {
                                users[user].color = getRandomColor();
                                $('#history').append($('<p>').text("color changed to "+ users[user].color ).css({'color':"red"}));
                                console.log("color changed");
                                socket.emit("updateUsers",users);
                            }
                        }
        
        }
    
    });
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
// TAKEN FROM W3SCHOOL.COM
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
    
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
    
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}
