
//Might have to rename to socket. 
const socket = io('http://localhost:3000');

var callButton = document.getElementById('callbutton')
var raiseButton = document.getElementById('raisebutton')
var foldButton = document.getElementById('foldbutton')
var tempStart = document.getElementById('temp')

//[Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)]

//This is all information that is needed to display at every change in turn. 
var allPlayers = {}
var localVars = 0


//When any turn happens, this updates the variables: arg contains the dictionaries containing all information
socket.on('turnStart', function(arg, globalVars){

    allPlayers = arg
    localVars = globalVars

    allPlayers[socket.id].name = 'Blaise'
    console.log(allPlayers)

    socket.emit('turnEnd', allPlayers, localVars )

    //Graphical information should update, player who's turn it is should be highlighted
    if (localVars.game_progess === 'pre-flop'){
        //display cards
    }
    else if (localVars.game_progess === 'flop'){
        //display cards
    }
    else if (localVars.game_progess === 'turn'){
        //display cards
    }
    else if (localVars.game_progess === 'river'){
        //display cards
    }
    else if (localVars.game_progess === 'declare-winner'){
        //at this point the localVars should contain a winner value, display it along with graphical changes.

    }


    if (localVars.currentPlayer === socket.id){
        // Unhide the buttons, allow them to play
    }



})
tempStart.addEventListener('click', function(){

    socket.emit('allready')
    console.log('start')

})


callButton.addEventListener('click', function(){
    
    console.log(socket.id)

    //Set turn to false
    //allPlayers[socket.id].is_turn = false

    //after checking, check to see if the game would end, if it does change the gameprogress var to 'declare-winner'
    socket.emit('turnEnd', allPlayers, localVars)

})

raiseButton.addEventListener('click', function(){
    
    //if (allPlayers[socket.id].total_money > 20){
    //    allPlayers[socket.id].total_money = allPlayers[socket.id].total_money - 20
    //    allPlayers[socket.id].current_bet = allPlayers[socket.id].current_bet + 20
    //    
//
    //    socket.emit('turnEnd', allPlayers, localVars)
    //}

})

