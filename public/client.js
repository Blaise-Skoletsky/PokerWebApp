// **** socket stuff wasn't working properly so I commented it out for now to test out raise button functionality. *****


// //Might have to rename to socket. 
// const socket = io('http://localhost:3000');

// var callButton = document.getElementById('callbutton')
// var raiseButton = document.getElementById('raisebutton')
// var foldButton = document.getElementById('foldbutton')
// var tempStart = document.getElementById('temp')

// //[Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)]

// //This is all information that is needed to display at every change in turn. 
// var allPlayers = {}
// var localVars = 0
// var turnPath = []


// //When any turn happens, this updates the variables: arg contains the dictionaries containing all information
// socket.on('turnStart', function(arg, globalVars){

//     allPlayers = arg
//     localVars = globalVars

//     console.log(allPlayers)
//     console.log(localVars)

//     //Graphical information should update, player who's turn it is should be highlighted
//     if (localVars.game_progess === 'pre-flop'){
//         //display cards
//     }
//     else if (localVars.game_progess === 'flop'){
//         //display cards
//     }
//     else if (localVars.game_progess === 'turn'){
//         //display cards
//     }
//     else if (localVars.game_progess === 'river'){
//         //display cards
//     }

//     if (localVars.currentPlayer === socket.id){
//         // Unhide the buttons, allow them to play
//     }



// })
// tempStart.addEventListener('click', function(){

//     socket.emit('allready')
//     console.log('start')

// })


// callButton.addEventListener('click', function(){
    
//     console.log(socket.id)

//     //Set turn to false
//     //allPlayers[socket.id].is_turn = false

//     //after checking, check to see if the game would end, if it does change the gameprogress var to 'declare-winner'
//     socket.emit('turnEnd', allPlayers, localVars)

// })


const raiseButton = document.getElementById("raise-button");
const raiseAmount = document.getElementById("raise-amount");

raiseButton.addEventListener('click', function(){

    if (raiseAmount.style.display == "none") {
        raiseAmount.style.display = "inline-block";
    } else {
        raiseAmount.style.display = "none";
        raiseButton.style.display = "inline-block";
    }

    //if (allPlayers[socket.id].total_money > 20){
    //    allPlayers[socket.id].total_money = allPlayers[socket.id].total_money - 20
    //    allPlayers[socket.id].current_bet = allPlayers[socket.id].current_bet + 20
    //    
//
    //    socket.emit('turnEnd', allPlayers, localVars)
    //}

})

