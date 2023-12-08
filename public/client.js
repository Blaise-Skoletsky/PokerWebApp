// **** socket stuff wasn't working properly so I commented it out for now to test out raise button functionality. *****

//const e = require("express")


//Might have to rename to socket. 
const socket = io('http://localhost:3000')
var callButton = document.getElementById('call-button')
var raiseButton = document.getElementById('raise-button')
var foldButton = document.getElementById('fold-button')

const raiseAmount = document.getElementById("raise-amount");

//[Player Name(customizeable), Amount of money(before betting), currentBet, isTurn (boolean value), isPlaying (boolean value),hand(should be an array)
//This is all information that is needed to display at every change in turn. 
var allPlayers = {}
var localVars = {'game_progress': 'lobby'}
var turnPath = []
//When any turn happens, this updates the variables: arg contains the dictionaries containing all information

var ourName = '';

socket.on('readyClicked', function(){
    const playerControls = document.querySelector('.person-player.player .player-controls');
    playerControls.style.display = 'flex';
    const allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach(function (player) {
        player.style.display = 'flex';
    });

    socket.emit('allready')


})

socket.on('turnStart', function(arg, globalVars, turns) {
    allPlayers = arg
    localVars = globalVars
    turnPath = turns
    console.log(allPlayers)
    console.log(localVars)

    // Display all players, their money, their cards, and their current bet
    console.log("Num Players? : ", turns)
    
    // remove other players
    var opponents_section = document.getElementById("opponents")
    while (opponents_section.firstChild) {
        opponents_section.removeChild(opponents_section.firstChild);
    }

    // got our index
    var ourIndex = -1;
    for (var i = 0; i < turnPath.length; i++){
        if (turnPath[i][1] == socket.id){
            ourIndex = i;
        }
    }

    // repopulate players
    for(socket.id in allPlayers){
        // skip ourself
        if (allPlayers[socket.id]["name"] == ourName) {
            continue;
        }
        var opponentHTML =
        "<div class='opponent'>"+
            "<div class='player-contents'>"+
                "<div class='player-image-container'>"+
                    "<img src='card-back.png' alt='Card 1'>"+
                    "<img src='card-back.png' alt='Card 2'>"+
                "</div>"+
                "<div class='player-info-container'>"+
                    "<div class='player-info-box'>"+
                        "<a class='player-name'>"+allPlayers[socket.id]["name"]+"</a>"+
                        "<span class='money-made'>Total Winnings: $0</span>"+
                        "<span class='bet-amount'>Bet Amount: $0</span>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"
        var newOpponent = document.createElement('div')
        newOpponent.innerHTML = opponentHTML
        if (allPlayers[socket.id]["is_turn"]){
            newOpponent.childNodes[0].classList.add("green")
        }
        opponents_section.appendChild(newOpponent)
    }

    // Shift the elements so that the next player is always on our left


    // Get the first m child elements
    var firstMChildren = Array.from(opponents_section.children).slice(0, ourIndex);
    firstMChildren.forEach(child => opponents_section.removeChild(child));
    firstMChildren.forEach(child => opponents_section.appendChild(child));

    // Display ourself
    var ourHand = document.getElementsByClassName("own-name")
    ourHand[0].innerText = ourName

    // Remove Call, Raise, Fold buttons if it is not our turn
    var callButton = document.getElementById("call-button")
    var raiseButton = document.getElementById("raise-button")
    var foldButton = document.getElementById("fold-button")
    // remove "hidden" class from each of these elements
    callButton.classList.remove("hidden");
    raiseButton.classList.remove("hidden");
    foldButton.classList.remove("hidden");
    for (socket.id in allPlayers){
        if (allPlayers[socket.id]["name"] == ourName) {
            if (allPlayers[socket.id]["is_turn"] == false){
                // add "hidden" class from each of these elements
                callButton.classList.add("hidden");
                raiseButton.classList.add("hidden");
                foldButton.classList.add("hidden");
                raiseAmount.style.display = "none";
            }
        }
    }

    // Make ourself green if its our turn
    var ourPlayer = document.getElementsByClassName("person-player player")
    ourPlayer[0].classList.remove("green")
    for (socket.id in allPlayers){
        if (allPlayers[socket.id]["name"] == ourName) {

            var img1 = document.getElementById('mc1')
            var img2 = document.getElementById('mc2')

            img1.src = allPlayers[socket.id].hand_img[0]
            img2.src = allPlayers[socket.id].hand_img[1]




            if (allPlayers[socket.id]["is_turn"]){
                ourPlayer[0].classList.add("green")
            }
        }
    }




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

callButton.addEventListener('click', function(){  
    console.log(socket.id)
    //Set turn to false
    //allPlayers[socket.id].is_turn = false
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

raiseAmount.addEventListener('keyup', function(event){

    if (event.keyCode === 13){
        if (allPlayers[socket.id].total_money > 20){
            allPlayers[socket.id].total_money = allPlayers[socket.id].total_money - 20
            allPlayers[socket.id].current_bet = allPlayers[socket.id].current_bet + 20
            
    
            socket.emit('turnEnd', allPlayers, localVars, turnPath)
        } 
    }
})


document.getElementById('ready-button').addEventListener('click', function () {
    const playerNameInput = document.getElementById('player-name-input');
    const playerName = playerNameInput.value.trim();
    if (localVars.game_progress === 'lobby'){
        if (playerName !== '') {
            ourName = playerName;
            socket.emit('setPlayerName', playerName);

            playerNameInput.style.display = 'none';
            document.getElementById('ready-button').style.display = 'none';

            socket.emit('ready')
            console.log('readied!')
        } 
        else {
            alert('Please enter your name before readying up.');
        }
    }
    else {
        playerNameInput.value = ''
    }
});

// function updateCardImages(playerId, card1, card2) {
//     const card1Element = document.getElementById(`mc1_${playerId}`);
//     const card2Element = document.getElementById(`mc2_${playerId}`);

//     if (card1Element && card2Element) {
//         card1Element.src = card1;
//         card2Element.src = card2;
//     }
// }

// socket.on('updateCardImages', ({ playerId, card1, card2 }) => {
//     updateCardImages(playerId, card1, card2);
// });

