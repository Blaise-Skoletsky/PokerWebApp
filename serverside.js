const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const fs = require('fs')

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "http://localhost:3000"}});

const poker = require('./poker.js')


app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket.io-client', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')));


// Serve your HTML file when accessing the root URL
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Serve client.js file
app.get('/client.js', function (req, res) {


   
    res.sendFile(path.join(__dirname, '/public/client.js'));


});




//Socket keys contains player individual info, like  their bet, their hand, if its their turn, ect. 
let socketKeys = {}

//global vars contains information about the whole table, like who is smallblind, bigblind, what the table bet is
//what the progress of the flop is, ect. 
let globalVars = {'smallblind': -1,
                  'bigblind': 0, 
                  'table_bet': 0,
                  'round_bet': 0, 
                  'game_progress': 'lobby', 
                  'current_player': 0, 
                  'last_person_to_raise': 2,
                  'center': [],
                  'center_img': []}


//Array for turn paths! Every game should shift by 1: each index is [turn1, socket]
let turnPath = []


//shows the progress of the ready-up
let readyVal = 0

//Number of players
let numPlayers = 0

//Variable to make sure that the allready function doesn't run multiple times:
let start = false


io.on('connection', socket => {

    // set player name on ready up
    socket.on('setPlayerName', function(name){
        var playerData = require("./playerData.json")
        console.log("== playerData: ", playerData)
        
        // load in total_money from JSON file
        var playerAllreadyExists = false
        playerData.forEach(function(player){
            if (player.name.toLowerCase() == name.toLowerCase()){
                socketKeys[socket.id].total_money = player.score
                playerAllreadyExists = true
            }
        })

        // create a new player in JSON file if not allready in there
        if (!playerAllreadyExists){
            var newPlayer = {
                "name": name.toLowerCase(),
                "score": 500,
            }
            playerData.push(newPlayer)
            fs.writeFileSync("./playerData.json", JSON.stringify(playerData, null, 2))
            console.log("New player added:", newPlayer)
        }

        socketKeys[socket.id]['name'] = name
    })

    //On connection, socketID is mapped to the 
    if (!(socket.id in socketKeys)){
        socketKeys[socket.id] = {'name': 'Not Ready', 
                                'total_money': 500,
                                'current_bet': 0,
                                'total_bet': 0,
                                'is_folded': false, //They have or haven't folded yet.
                                'is_playing': false, //This means they are dealt hands and are in the 6 game lobby.
                                'is_turn': false, //Currently have buttons showing, can make a move
                                'inskip': false, // if true, means they are still in the game, but have no money, so they should be skipped in the turn order.
                                'hand': [null],
                                'hand_img': [],
                                'best_hand:': []}

        turnPath.push([0, socket.id])
        for (let i = 0; i < turnPath.length; i++){
            turnPath[i][0] = i
        }
    }



    console.log(socketKeys)
    console.log(turnPath)
    
    socket.on('ready', function(){

      
        socketKeys[socket.id].is_ready = true
        socketKeys[socket.id].is_playing = true
        readyVal = 0
        for(socket.id in socketKeys){
            if (socketKeys[socket.id].is_ready){
     
                readyVal++
            }
        }
        console.log("Ready Value: ", readyVal)
        if (readyVal === Object.keys(socketKeys).length && Object.keys(socketKeys).length >= 3){
            globalVars.game_progress = 'pre-flop'
            io.emit('readyClicked')
        }


    })

    //Function starts the game, once all players have said they are ready, it shoots off the first 'turnhappend' event to the client
    socket.on('allready', function(){

        if (!start){
            globalVars.game_progress = 'pre-flop'

            for (let i = 0; i < turnPath.length; i++){
                if (socketKeys[turnPath[i][1]].total_money <= 0){
                    socketKeys[turnPath[i][1]].inskip = true
                }
            }
            
            //makes turns circular!!! - Also skip inskip people
            globalVars.smallblind++
            if (globalVars.smallblind > turnPath.length-1 || globalVars.smallblind > 5){
                globalVars.smallblind = 0
            }



             //Hopefully this works, if bigblind is ever at the last player, when it increments it circles back to 1
            globalVars.bigblind++
            if (globalVars.bigblind > turnPath.length-1 || globalVars.bigblind > 5){
                globalVars.bigblind = 0
            }

            //Make sure they have enough money!
            socketKeys[turnPath[globalVars.smallblind][1]].total_money -= 10
            socketKeys[turnPath[globalVars.smallblind][1]].current_bet = 10
            socketKeys[turnPath[globalVars.smallblind][1]].total_bet += 10
            socketKeys[turnPath[globalVars.bigblind][1]].total_money -= 20
            socketKeys[turnPath[globalVars.bigblind][1]].current_bet = 20
            socketKeys[turnPath[globalVars.bigblind][1]].total_bet += 20

            globalVars.table_bet = 30
            globalVars.round_bet = 20


            for (let i = 0; i < turnPath.length; i++){

                if (turnPath[i][0] === globalVars.bigblind){
                    if (turnPath[i][0] === globalVars.bigblind) {
                        const nextPlayerIndex = (i + 1) % turnPath.length
                    
                        socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true
                        break
                    }
                }
            }

            gameDeck = poker.generateDeck()
            globalVars.center = poker.centerGenerator(gameDeck)
            for (let i = 0; i < globalVars.center.length; i++){
                globalVars.center_img.push(poker.getImage(globalVars.center[i]))
            }

            for (let i = 0; i < turnPath.length; i++){
                socketKeys[turnPath[i][1]].hand = poker.playerHandGenerator(gameDeck)

                for (let j = 0; j < 2; j++){

                    socketKeys[turnPath[i][1]].hand_img.push(poker.getImage(socketKeys[turnPath[i][1]].hand[j]))
                }

            }

            start = true


            io.emit('turnStart', socketKeys, globalVars, turnPath)
        }
    })

    //When a player moves, all their information should be put back into the global info system: the map of the keys
    socket.on('turnEnd', function(arg, localVars, order){
        socketKeys = arg
        globalVars = localVars
        turnPath = order

        let inCount = 0
        for (let i = 0; i < turnPath.length; i++){
            if (!socketKeys[turnPath[i][1]].is_folded){
                inCount++
            }
        }
        if(inCount === 1){

            //Do a win message!!
            //Game should end
            var winner = ' '

            for (let i = 0; i < turnPath.length; i++){
                if (!socketKeys[turnPath[i][1]].is_folded){
                    socketKeys[turnPath[i][1]].total_money += globalVars.table_bet
                    winner = socketKeys[turnPath[i][1]].name
                }
            }
            reset()

            io.emit('restart', socketKeys, globalVars, turnPath, winner)

            
        } else{
                for (let i = 0; i < turnPath.length; i++) {
                    if (socketKeys[turnPath[i][1]].is_turn) {
                        for (let j = 1; j < turnPath.length; j++) {
                            const nextPlayerIndex = (i + j) % turnPath.length;

                            if (!socketKeys[turnPath[nextPlayerIndex][1]].is_folded) {
                                socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true;
                                socketKeys[turnPath[i][1]].is_turn = false;

                                break;
                            }
                            else{
                                if (globalVars.last_person_to_raise === nextPlayerIndex){
                                    var circle = (globalVars.last_person_to_raise+1) % turnPath.length
                                    globalVars.last_person_to_raise = circle
                                }
                                
                            }
                        }
                        break;
                    }
                }
            
            
                for (let i = 0; i < turnPath.length; i++){
                    if (socketKeys[turnPath[i][1]].is_turn && globalVars.last_person_to_raise === i){
                    

                        socketKeys[turnPath[i][1]].is_turn = false
                    
                        for (let x = 0; x < turnPath.length; x++){
                            const nextPlayerIndex = (globalVars.smallblind + x) % turnPath.length
                            if (!socketKeys[turnPath[nextPlayerIndex][1]].is_folded){
                                socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true
                                globalVars.last_person_to_raise = nextPlayerIndex
                                break
                            }
                        }
                    
                    
                        if (globalVars.game_progress === 'pre-flop'){
                            globalVars.game_progress = 'flop'
                        
                            globalVars.round_bet = 0
                        
                            for (j = 0; j < turnPath.length; j++){
                                socketKeys[turnPath[j][1]].current_bet = 0
                            }
                        }
                        else if (globalVars.game_progress === 'flop'){
                            globalVars.game_progress = 'turn'
                        
                            globalVars.round_bet = 0
                        
                            for (j = 0; j < turnPath.length; j++){
                                socketKeys[turnPath[j][1]].current_bet = 0
                            }
                        }
                        else if (globalVars.game_progress === 'turn'){
                            globalVars.game_progress = 'river'
                        
                            globalVars.round_bet = 0
                        
                            for (j = 0; j < turnPath.length; j++){
                                socketKeys[turnPath[j][1]].current_bet = 0
                            }
                        }
                        else if (globalVars.game_progress === 'river'){
                            globalVars.game_progress = 'done'
                        
                            globalVars.round_bet = 0
                        
                            for (j = 0; j < turnPath.length; j++){
                                socketKeys[turnPath[j][1]].current_bet = 0
                            }
                        }
                    
                        break
                    
                    }
            }



            if (globalVars.game_progress  === 'done'){
                //Run lukes code to distribute money. Also need to design restart socket
                let players = []
                for (let z = 0; z < turnPath.length; z++){
                    socketKeys[turnPath[z][1]].best_hand = poker.evaluatePokerHand(socketKeys[turnPath[z][1]].hand, globalVars.center)
                    players = [socketKeys[turnPath[z][1]]]
                }
                
                players = poker.winnerOrder(players)
                players = poker.distributePot(players)
                
                for (let y = 0; y < turnPath.length; y++){
                    for(let x = 0; x < players.length; x++){
                        if(socketKeys[turnPath[y][1]].name === players[x].name){
                            socketKeys[turnPath[y][1]].total_money = players[x].total_money
                        }
                    }
                }

                io.emit('restart', socketKeys, globalVars, turnPath)
            }
            else {
                io.emit('turnStart', socketKeys, globalVars, turnPath)
            }

        }





        //if last person to raise is now the same person who is playing, end the phase, restart play at the small blind

        //change who was playing to false now


        //otherwise, send the new globalVars and arg back to each client and keep playing.

    })




    //Removes a socket when page is refreshed or closed. 
    socket.on('disconnect', function(){
        for (let i = 0; i < turnPath.length; i++){
            if (turnPath[i][1] === socket.id){

                turnPath = turnPath.filter(item => item && item[1] !== socket.id);
            }
        }

        delete socketKeys[socket.id]
        //Code to reset game!!!

    })


});



server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});



function reset(){
    globalVars.table_bet = 0
    globalVars.round_bet = 0
    globalVars.game_progress = 'lobby'
    globalVars.current_player = 0
    globalVars.last_person_to_raise = 2 //Change later
    globalVars.center = []
    globalVars.center_img = []

    for (let z = 0; z < turnPath.length; z++){
        socketKeys[turnPath[z][1]].current_bet = 0
        socketKeys[turnPath[z][1]].is_folded = false
        socketKeys[turnPath[z][1]].is_turn = false
        socketKeys[turnPath[z][1]].inskip = false
        socketKeys[turnPath[z][1]].hand = [null]
        socketKeys[turnPath[z][1]].hand_img = []
        socketKeys[turnPath[z][1]].best_hand = [null]
    }

    start = false
    //Code to go back to lobby maybe? 
}

function savePlayerToJSON(name){
    var total_money = 0;
    socketKeys.forEach(function(socket){
        if (socket.name.toLowerCase() == name.toLowerCase()){
            total_money = socket.total_money
        }
    })
    
    var playerData = require("./playerData.json")
    playerData.forEach(function(player){
        if (player.name.toLowerCase() == name.toLowerCase()){
            player.score = total_money
        }
    })
    fs.writeFileSync("./playerData.json", JSON.stringify(playerData, null, 2))
}

