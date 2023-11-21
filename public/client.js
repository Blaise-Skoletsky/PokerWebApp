
//Might have to rename to socket. 
const socket = io('http://localhost:3000');

var callButton = document.getElementById('callbutton')
var raiseButton = document.getElementById('raisebutton')
var foldButton = document.getElementById('foldbutton')
//[Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)]

//This is all information that is needed to display at every change in turn. 
var allPlayers = {}
var localVars = 0

//When any turn happens, this updates the variables: arg contains the dictionaries containing all information
socket.on('turnHappened', function(arg, mysockettID, globalVars){

    allPlayers = arg
    localVars = globalVars


})

callButton.addEventListener('click', function(){
    

    //Set turn to false
    arg.mysockettID[3] = false
    socket.emit('turnEnd', arg, localVars)

})

raiseButton.addEventListener('click', function(){
    
    if (arg.mysockettID[1] > 20){
        arg.mysockettID[1] = arg.mysockettID[1] - 20
        arg.mysockettID[2] = arg.mysockettID[2] + 20
        

        socket.emit('turnEnd', arg, localVars)
    }

})

