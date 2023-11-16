
//Might have to rename to socket. 
const socket = io('http://localhost:3000');

var input = document.getElementById('textinput');



socket.on('wasclicked', function(arg){
    console.log(arg)

})