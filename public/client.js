
//Might have to rename to socket. 
const socket = io('http://localhost:3000');

var input = document.getElementById('textinput');


//When the client recives the wasclicked message, data sent is stored in arg. 
socket.on('clicked', function(arg){
    //not imp

})



input.addEventListener('madeMove', function(){
    socket.emit('clicked', [1, 2,3,4,5,6, 'apple'])

})

