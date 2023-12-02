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
        document.getElementById('player')
     }
     
     var opponents = document.getElementsByClassName('player-info-container')
     for (var i = 0; i < turnPath.length; i++){
        if (allPlayers[turnPath[i][1]].is_playing && !allPlayers[turnPath[i][1].is_folded]){
            
            
            if (allPlayers[turnPath[i][1]].is_turn){
                //Show buttons, highlight them green

                //If it is their turn, highlight their background green or do something to indicate it!
            }
            else{

                //hide buttons
            }

            //Display the amount each player has bet, total amount left, other info, ect.

        }
     }

     //Graphical information should update, player who's turn it is should be highlighted
     var images
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

foldButton.addEventListener('click', function(){
    allPlayers[socket.id].is_folded = true
    allPlayers[socket.id].is_turn = false
    socket.emit('turnEnd', allPlayers, localVars, turnPath)
})


 callButton.addEventListener('click', function(){  
    
    //Set turn to false

    var difference = localVars.round_bet - allPlayers[socket.id].current_bet

    allPlayers[socket.id].current_bet += difference
    allPlayers[socket.id].total_money -= difference

    localVars.table_bet += difference

    allPlayers[socket.id].is_turn = false
    //after checking, check to see if the game would end, if it does change the gameprogress var to 'declare-winner'
    socket.emit('turnEnd', allPlayers, localVars, turnPath)
 })

raiseButton.addEventListener('click', function(){

    if (raiseAmount.style.display == "none") {
        raiseAmount.style.display = "inline-block";
    } else {
        raiseAmount.style.display = "none";
        raiseButton.style.display = "inline-block";
    }

})

const raiseAmount = document.getElementById("raise-amount");
raiseAmount.addEventListener('keyup', function(event){
    if(event.keyCode == 13){

        //make sure it's a number
        var amountRaised = raiseAmount.value 
        if (amountRaised > allPlayers[socket.id].total_money + allPlayers[socket.id].current_bet){
            raiseAmount.value = ''
        }
        else{
            var difference = amountRaised - allPlayers[socket.id].current_bet
            allPlayers[socket.id].total_money -= difference
            allPlayers[socket.id].current_bet = amountRaised
            localVars.table_bet += difference
            localVars.round_bet = amountRaised
            
            raiseAmount.value = ''

            for(let i = 0; i < turnPath.length; i++){
                if (turnPath[i][i] === socket.id){
                    localVars.last_person_to_raise = i
                }
            }

            socket.emit('turnEnd', allPlayers, localVars, turnPath)
        }
    }
})


