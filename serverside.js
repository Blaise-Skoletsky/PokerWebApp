const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

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
                  'last_person_to_raise': 0,
                  'center': []}


//Array for turn paths! Every game should shift by 1: each index is [turn1, socket]
let turnPath = []


//shows the progress of the ready-up
let readyVal = 0

//Number of players
let numPlayers = 0


io.on('connection', socket => {

    // set player name on ready up
    socket.on('setPlayerName', function(name){
        socketKeys[socket.id]['name'] = name
    })

    //On connection, socketID is mapped to the 
    if (!(socket.id in socketKeys)){
        socketKeys[socket.id] = {'name': 'Not Ready', 
                                'total_money': 500,
                                'current_bet': 0,
                                'is_folded': false, //They have or haven't folded yet.
                                'is_playing': false, //This means they are dealt hands and are in the 6 game lobby.
                                'is_turn': false, //Currently have buttons showing, can make a move
                                'hand': [null]}

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

        globalVars.game_progress = 'pre-flop'
        
        //makes turns circular!!!
        globalVars.smallblind++
        if (globalVars.smallblind > turnPath.length-1 || globalVars.smallblind > 5){
            globalVars.smallblind = 0
        }


         //Hopefully this works, if bigblind is ever at the last player, when it increments it circles back to 1
        globalVars.bigblind++
        if (globalVars.bigblind > turnPath.length-1 || globalVars.bigblind > 5){
            globalVars.bigblind = 0
        }

        for (let i = 0; i < turnPath.length; i++){
            //TO FUTURE ME: Might be an error in the if statements, hopefulyl acts as circular. 

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
        for (let i = 0; i < turnPath.length; i++){
            socketKeys[turnPath[i][1]].hand = poker.playerHandGenerator(gameDeck)
        }


        io.emit('turnStart', socketKeys, globalVars, turnPath)

    })

    //When a player moves, all their information should be put back into the global info system: the map of the keys
    socket.on('turnEnd', function(arg, localVars, order){
        socketKeys = arg
        globalVars = localVars
        turnPath = order

        for(let i = 0; i < turnPath.length; i++){
            if (socketKeys[turnPath[i][1]].is_turn){
                if(turnPath.length <= i+1){
                    socketKeys[turnPath[0][1]].is_turn = true
                }
                else{
                    socketKeys[turnPath[i+1][0]].is_turn = true
                }
            }
        }
        socketKeys[turnPath[i][1]].is_turn = false


        for (let i = 0; i < turnPath.length; i++){
            if (socketKeys[turnPath[i][1].is_turn] && globalVars.last_person_to_raise === i){
                if (turnPath[i][0] === globalVars.bigblind){
                    if (turnPath[i][0] === globalVars.bigblind) {
                        const nextPlayerIndex = (i + 1) % turnPath.length
                
                        socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true
                        break
                    }
                }
                socketKeys[turnPath[i][1]].is_turn = false
                if (globalVars.game_progress === 'pre-flop'){
                    globalVars.game_progress = 'flop'
                }
                else if (globalVars.game_progress === 'flop'){
                    globalVars.game_progress = 'turn'
                }
                else if (globalVars.game_progress === 'turn'){
                    globalVars.game_progress = 'river'
                }
                else if (globalVars.game_progress === 'river'){
                    globalVars.game_progress = 'done'
                }
            }
        }

        if (globalVars.game_progress  === 'done'){
            

            
            
            //Run lukes code to distribute money. Also need to design restart socket
            io.emit('restart', socketKeys, globalVars, turnPath)
        }
        else {
            io.emit('turnStart', socketKeys, globalVars, turnPath)
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
    })


});





server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});