// **** socket stuff wasn't working properly so I commented it out for now to test out raise button functionality. *****


//Might have to rename to socket. 
<<<<<<< Updated upstream
 const socket = io('http://localhost:3000')
 var callButton = document.getElementById('call-button')
 var raiseButton = document.getElementById('raise-button')
 var foldButton = document.getElementById('fold-button')
 var tempStart = document.getElementById('temp')
=======
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
    var smallCount = 0
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
>>>>>>> Stashed changes

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
    

     //I think there is some file routing errors, as I am 
     let playerImg1 = document.getElementById('mc1')
     let playerImg2 = document.getElementById('mc2')

     //playerImg1.src = allPlayers[socket.id].hand_img[0]
     //playerImg2.src = allPlayers[socket.id].hand_img[1]
     
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

<<<<<<< Updated upstream
foldButton.addEventListener('click', function(){
    allPlayers[socket.id].is_folded = true
    allPlayers[socket.id].is_turn = false
=======
    
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

    localVars.num_call++

    console.log(turnPath)
    
>>>>>>> Stashed changes
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


<<<<<<< Updated upstream
=======
document.getElementById('ready-button').addEventListener('click', function () {
<<<<<<< Updated upstream
    var players = document.querySelectorAll('.player');
    players.forEach(function (player) {
        player.style.display = 'flex';
    });
    document.getElementById('ready-button').style.display = 'none';
=======
    const playerNameInput = document.getElementById('player-name-input');
    const playerName = playerNameInput.value.trim();
    
    console.log(localVars.game_progress)

    if (localVars.game_progress === 'lobby'){
        
        if (playerName !== '') {
            ourName = playerName;
            socket.emit('setPlayerName', playerName);
>>>>>>> Stashed changes

    socket.emit('allready')
});

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
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

socket.on('unhide', function(){
    var rBut = document.getElementById('ready-button')
    var rBar = document.getElementById('player-name-input')
    rBut.classList.remove('hidden')
    rBar.classList.remove('hidden')

})

socket.on('restartScreen', function (){
    var playerPic = document.getElementsByClassName('person-player player')
    playerPic[0].style.display = 'none'
    var rBut = document.getElementById('ready-button')
    var rBar = document.getElementById('player-name-input')

    //rBut.classList.remove('hidden')
    //rBar.classList.remove('hidden')

    rBut.style.display = 'inline-block'
    rBar.style.display = 'inline-block'
    
    var thePot = document.getElementById('pot')
    thePot.innerText = ""

    var opponents_section = document.getElementById("opponents")
    while (opponents_section.firstChild) {
        opponents_section.removeChild(opponents_section.firstChild);
    }

    callButton.classList.add('hidden')
    raiseButton.classList.add('hidden')
    foldButton.classList.add('hidden')

    

    

    





})
>>>>>>> Stashed changes
