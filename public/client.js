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
var ourSocketId = '';
var ourIndex = -1;
var indexAllreadyFound = false

socket.on('readyClicked', function(){
    const playerControls = document.querySelector('.person-player.player .player-controls');
    playerControls.style.display = 'flex';
    const allPlayers = document.querySelectorAll('.player');
    allPlayers.forEach(function (player) {
        player.style.display = 'flex';
    });

    socket.emit('allready')
    ourSocketId = socket.id
    //console.log("== ourSocketId: ", ourSocketId)


})

socket.on('turnStart', function(arg, globalVars, turns) {
    allPlayers = arg
    localVars = globalVars
    turnPath = turns
    console.log(allPlayers)
    console.log(localVars)

    //display pot
    var thePot = document.getElementById('pot')
    thePot.innerText = "Total Pot: $" + localVars.table_bet


    // remove other players
    var opponents_section = document.getElementById("opponents")
    while (opponents_section.firstChild) {
        opponents_section.removeChild(opponents_section.firstChild);
    }

    // get our index
    
    if (indexAllreadyFound == false){
        for (var i = 0; i < turnPath.length; i++){
            if (turnPath[i][1] == socket.id){
                ourIndex = i;
            }
        }
        indexAllreadyFound = true
    }

    console.log("ourIndex", ourIndex)

    // repopulate players
    for(socket.id in allPlayers){
        // skip ourself
        if (socket.id == ourSocketId) {
            var myMoney = document.getElementById('my-money')
            var myBet = document.getElementById('my-bet')
            myMoney.innerText= "Total Winnings: $" + allPlayers[socket.id].total_money
            myBet.innerText = "Bet Amount: $" + allPlayers[socket.id].current_bet
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
                        "<span class='money-made'>Total Winnings: $" + allPlayers[socket.id].total_money +"</span>"+
                        "<span class='bet-amount'>Bet Amount: $" +allPlayers[socket.id].current_bet + "</span>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"
        var newOpponent = document.createElement('div')
        newOpponent.innerHTML = opponentHTML
        if (allPlayers[socket.id]["is_turn"]){
            newOpponent.childNodes[0].classList.add("green")
        }
        if(allPlayers[socket.id]["is_folded"]){
            newOpponent.childNodes[0].classList.add('red')
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
        if (socket.id == ourSocketId) {
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
    ourPlayer[0].classList.remove('red')
    for (socket.id in allPlayers){
        if (socket.id == ourSocketId) {

            var img1 = document.getElementById('mc1')
            var img2 = document.getElementById('mc2')

            img1.src = allPlayers[socket.id].hand_img[0]
            img2.src = allPlayers[socket.id].hand_img[1]




            if (allPlayers[socket.id]["is_turn"]){
                ourPlayer[0].classList.add("green")
            }
            if(allPlayers[socket.id]["is_folded"]){
                ourPlayer[0].classList.add('red')
            }
        }
    }
    if (localVars.game_progress === 'pre-flop'){
        var centerImgs = document.getElementsByClassName('card')
        for (let i =0 ;i < 5; i++){
            centerImgs[i].src = 'card-back.png'
        }
    }

    if (localVars.game_progress === 'flop'){
   
        var centerImgs = document.getElementsByClassName('card')
        for (i = 0; i < 3; i++){
            centerImgs[i].src = localVars.center_img[i]
        }
        
         //display 3 cards
    }
    if (localVars.game_progress === 'turn'){
         //display 4 cards
         var centerImgs = document.getElementsByClassName('card')
        for (i = 0; i < 4; i++){
            centerImgs[i].src = localVars.center_img[i]
        }
    }
    if (localVars.game_progress === 'river'){
         //display 5 cards
         var centerImgs = document.getElementsByClassName('card')
        for (i = 0; i < 5; i++){
            centerImgs[i].src = localVars.center_img[i]
        }
    }

    
})

callButton.addEventListener('click', function(){
    for(socket.id in allPlayers){
        if (socket.id == ourSocketId){

            var difference = localVars.round_bet - allPlayers[socket.id].current_bet
            console.log(difference)

            if (allPlayers[socket.id].total_money >= difference){
                allPlayers[socket.id].current_bet += difference
                allPlayers[socket.id].total_money -= difference
                allPlayers[socket.id].total_bet += difference
                localVars.table_bet += difference
            }
            else {
                localVars.table_bet += allPlayers[socket.id].total_money
                allPlayers[socket.id].current_bet += allPlayers[socket.id].total_money
                allPlayers[socket.id].total_bet += allPlayers[socket.id].total_money
                allPlayers[socket.id].total_money = 0
            }
        }
    }

    console.log(turnPath)
    
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

        var raise = parseInt(raiseAmount.value)
        

        for (let i = 0; i < turnPath.length; i++){
            if (turnPath[i][1] == ourSocketId){
                if (raise + allPlayers[turnPath[i][1]].current_bet <= localVars.round_bet){
                    break
                }
                if (allPlayers[turnPath[i][1]].total_money >= raise){
                    allPlayers[turnPath[i][1]].total_money -= raise
                    allPlayers[turnPath[i][1]].total_bet += raise
                    allPlayers[turnPath[i][1]].current_bet += raise
                    localVars.table_bet += raise
                    localVars.round_bet = raise 
                    localVars.last_person_to_raise = i

                    socket.emit('turnEnd', allPlayers, localVars, turnPath)
                }
            }
        
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
        
        } 
        else {
            alert('Please enter your name before readying up.');
        }
    }
    else {
        playerNameInput.value = ''
    }
});

foldButton.addEventListener('click', function(){
    for (let i = 0; i < turnPath.length; i++){
        if (allPlayers[turnPath[i][1]].name == ourName){
            allPlayers[turnPath[i][1]].is_folded = true
            break
        }
        
    }
    socket.emit('turnEnd', allPlayers, localVars, turnPath)

})



socket.on('restart', function(arg, globalVars, turns, winner){
    allPlayers = arg
    localVars = globalVars
    turnPath = turns

    alert(winner + ' had the best hand!')

    //Run the code to hide screen?
    socket.emit('allready')
})