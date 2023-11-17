
//Might have to rename to socket. 
const socket = io('http://localhost:3000');

var input = document.getElementById('textinput');


//When the client recives the wasclicked message, data sent is stored in arg. 
socket.on('wasclicked', function(arg){
    console.log(arg)

})