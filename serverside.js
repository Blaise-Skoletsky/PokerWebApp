const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "http://localhost:3000"}});


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
let globalVars = {'smallblind': 0,
                  'bigblind': 0, 
                  'table_bet': 0, 
                  'game_progress': 'pre-flop', 
                  'current_player': 0, 
                  'last_person_to_raise': 0}


//Array for turn paths! Every game should shift by 1: each index is [turn1, socket]
let turnPath = []


//shows the progress of the ready-up
let readyVal = 0

//Number of players
let numPlayers = 0


io.on('connection', socket => {

    //On connection, socketID is mapped to the 
    if (!(socket.id in socketKeys)){
        socketKeys[socket.id] = {'name': 'temp', 
                                'total_money': 500,
                                'current_bet': 0,
                                'is_playing': false,
                                'is_turn': false,
                                'hand': [null]}
        turnPath.push([0, socket.id])
        for (let i = 0; i < turnPath.length; i++){
            turnPath[i][0] = i + 1
        }
    }



    console.log(socketKeys)
    console.log(turnPath)
    

    //Function starts the game, once all players have said they are ready, it shoots off the first 'turnhappend' event to the client
    socket.on('allready', function(){
        readyVal++ 
        //if (readyVal === Object.keys(socketKeys).length){
        //    //Fire off the first turn happened, selecting a random player to start: 
//
        //    socket.emit('turnStart', socketKeys, globalVars)
//
//
//
        //}
        console.log('turn start')
        socketKeys[socket.id].is_turn = true
        socket.emit('turnStart', socketKeys, globalVars)

    })

    //When a player moves, all their information should be put back into the global info system: the map of the keys
    socket.on('turnEnd', function(arg, localVars){
        socketKeys = arg
        globalVars = localVars
        //if last person to raise is now the same person who is playing, end the phase, restart play at the small blind

        console.log(socketKeys[socket.id].name)

        //otherwise, send the new globalVars and arg back to each client and keep playing.

        console.log(arg)
    })




    //Removes a socket when page is refreshed or closed. 
    socket.on('disconnect', function(){
        for (let i = 0; i < turnPath.length; i++){
            if (turnPath[i][1] === socket.id){
                //turnPath.splice(i, i)
                turnPath = turnPath.filter(item => item && item[1] !== socket.id);
            }
        }

        delete socketKeys[socket.id]
    })



    
    
    
});





server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
