// **** socket stuff wasn't working properly so I commented it out for now to test out raise button functionality. *****


 //Might have to rename to socket. 
 const socket = io('http://localhost:3000')
 var callButton = document.getElementById('call-button')
 var raiseButton = document.getElementById('raise-button')
 var foldButton = document.getElementById('fold-button')
 var tempStart = document.getElementById('temp')
 //[Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)
 //This is all information that is needed to display at every change in turn. 
 var allPlayers = {}
 var localVars = {}
 var turnPath = []
 //When any turn happens, this updates the variables: arg contains the dictionaries containing all information
 socket.on('turnStart', function(arg, globalVars, turns) {
     allPlayers = arg
     localVars = globalVars
     turnPath = turns
     console.log(allPlayers)
     console.log(localVars)

     if (allPlayers[socket.id].is_playing){
        //Display their own cards, otherwise leave the backs showing
     }
     
     for (var i = 0; i < turnPath.length; i++){
        if (allPlayers[turnPath[i][1]].is_playing){
            if (allPlayers[turnPath[i][1]].is_turn){
                //If it is their turn, highlight their background green or do something to indicate it!
            }

            //Display the amount each player has bet, total amount left, other info, ect.

        }
     }

     //Graphical information should update, player who's turn it is should be highlighted
     if (localVars.game_progess === 'pre-flop'){
         //display no cards
     }
     else if (localVars.game_progess === 'flop'){
         //display 3 cards
     }
     else if (localVars.game_progess === 'turn'){
         //display 4 cards
     }
     else if (localVars.game_progess === 'river'){
         //display 5 cards
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

const raiseAmount = document.getElementById("raise-amount");

raiseButton.addEventListener('click', function(){

    if (raiseAmount.style.display == "none") {
        raiseAmount.style.display = "inline-block";
    } else {
        raiseAmount.style.display = "none";
        raiseButton.style.display = "inline-block";
    }

    if (allPlayers[socket.id].total_money > 20){
        allPlayers[socket.id].total_money = allPlayers[socket.id].total_money - 20
        allPlayers[socket.id].current_bet = allPlayers[socket.id].current_bet + 20
        

        socket.emit('turnEnd', allPlayers, localVars)
    }

})


document.getElementById('ready-button').addEventListener('click', function () {
    const playerNameInput = document.getElementById('player-name-input');
    const playerName = playerNameInput.value.trim();

    if (playerName !== '') {

        socket.emit('setPlayerName', playerName);

        playerNameInput.style.display = 'none';
        document.getElementById('ready-button').style.display = 'none';

        const playerControls = document.querySelector('.person-player.player .player-controls');
        playerControls.style.display = 'flex';

        const allPlayers = document.querySelectorAll('.player');
        allPlayers.forEach(function (player) {
            player.style.display = 'flex';
        });
    } 
    else {
        alert('Please enter your name before readying up.');
    }
});