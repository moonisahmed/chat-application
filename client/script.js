var socket = io();

//$('#submit').click(function() {
//        $("#nameDivs").css("display","none");
        
            
//    });
//$('form').submit(function () {
//    var text = $('#name').val();
//    socket.emit('name', text);
//    $('#name').val('');
//    return false;
//});

$('form').submit(function () {
    var text = $('#message').val();
    var nickname = $('#name').val();
    socket.emit('message', text, nickname);
    $('#message').val('');
    $('#name').val('');
    return false;
});

/*
//message
socket.on('message', function (msg) {
  //$('<li class="list-group-item">').text(msg).appendTo('#history');
    $('#history').append($('<h4 class="list-group-item" id="currentUserMessage">').text(msg));
    $('#currentUserMessage').css("font-weight","bold");
    $('#currentUserMessage' ).css("background-color","yellow");
});


//timestamp
socket.on('time', function(time) {
  $('#history').append($('<p>').text(time));
});



//User
socket.on('name', function(name) {   
    $('#history').append($('<p id="currentUserHistory">').text("By: " + name));
    $('#currentUserHistory').css("font-weight","bold");
    $('#currentUserHistory' ).css("background-color","yellow");
    
});
*/
//CurrentUser
socket.on('newUser', function(name,chatHist) {
    $('#users').append($('<li class="list-group-item" class="currentUser">').text(name));
    $('.currentUser' ).css("background-color","yellow");
    $('.currentUser').css("font-weight","bold");
    // $("#nameDivs").css("display","none");
    
    for(var chat in chatHist)
    {
        $('#history').append($('<h4 class="list-group-item" id="currentUserMessage">').text(chatHist[chat].message));
        $('#history').append($('<p>').text(chatHist[chat].time));
        $('#history').append($('<p class="currentUserHistory">').text("By: " + chatHist[chat].name));
    }
    
    
});



socket.on('test', function(name,msg,time) {

    $('#history').append($('<h4 class="list-group-item" id="currentUserMessage">').text(msg));
    $('#currentUserMessage').css("font-weight","bold");
    $('#currentUserMessage' ).css("background-color","yellow");
    
    $('#history').append($('<p>').text(time));
    
    
    $('#history').append($('<p class="currentUserHistory">').text("By: " + name));
    $('.currentUserHistory').css("font-weight","bold");
    $('.currentUserHistory' ).css("background-color","yellow");
    
    console.log(time + "time");
    console.log(msg + "message");
    console.log(name + "name");
});