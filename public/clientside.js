

//Might have to rename to socket. 
const io = io('http://localhost:3000');

var input = document.getElementById('textinput');



io.on('wasclicked', function(arg){
    console.log(arg)

})