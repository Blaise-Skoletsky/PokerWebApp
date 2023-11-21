
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
socket.on('turnStart', function(arg, mysockettID, globalVars){

    allPlayers = arg
    localVars = globalVars
    //Graphical information should update, player who's turn it is should be highlighted
    if (localVars.gameprogess === 'pre-flop'){
        //display cards
    }
    else if (localVars.gameprogess === 'flop'){
        //display cards
    }
    else if (localVars.gameprogess === 'turn'){
        //display cards
    }
    else if (localVars.gameprogess === 'river'){
        //display cards
    }
    else if (localVars.gameprogess === 'declare-winner'){
        //at this point the localVars should contain a winner value, display it along with graphical changes.

    }


    if (localVars.currentPlayer === mysockettID){
        // Unhide the buttons, allow them to play
    }



})

callButton.addEventListener('click', function(){
    

    //Set turn to false
    arg.mysockettID[3] = false

    //after checking, check to see if the game would end, if it does change the gameprogress var to 'declare-winner'
    socket.emit('turnEnd', arg, localVars)

})

raiseButton.addEventListener('click', function(){
    
    if (arg.mysockettID[1] > 20){
        arg.mysockettID[1] = arg.mysockettID[1] - 20
        arg.mysockettID[2] = arg.mysockettID[2] + 20
        

        socket.emit('turnEnd', arg, localVars)
    }

})

