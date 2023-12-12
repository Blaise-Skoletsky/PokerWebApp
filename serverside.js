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
                  'game_progress': 'pre-flop', 
                  'current_player': 0, 
                  'last_person_to_raise': 0,
                  'center': [],
<<<<<<< Updated upstream
                  'center-img': [],
                }

=======
                  'center_img': [],
                  'num_call': 0}
>>>>>>> Stashed changes


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
                                'is_folded': false, //They have or haven't folded yet.
                                'is_playing': false, //This means they are dealt hands and are in the 6 game lobby.
                                'is_turn': false, //Currently have buttons showing, can make a move
                                'hand': [null],
                                'hand_img': []
                                }

        turnPath.push([0, socket.id])
        for (let i = 0; i < turnPath.length; i++){
            turnPath[i][0] = i
        }
    }



    console.log(socketKeys)
    console.log(turnPath)
    

    //Function starts the game, once all players have said they are ready, it shoots off the first 'turnhappend' event to the client
    socket.on('allready', function(){

        globalVars.ready_players++

        console.log(globalVars.ready_players)
        if (globalVars.ready_players >= turnPath.length){

            console.log('1')

            for (let i = 0; i < turnPath.length; i++){
                if (i < 6){
                    socketKeys[turnPath[i][1]].is_playing = true
                }
            }
            
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
        
                for (let j = 0; j < 2; j++){
                    socketKeys[turnPath[i][1]].hand_img.push(poker.getImage(socketKeys[turnPath[i][1]].hand[j]))
                }


               

            }
    
            socket.emit('turnStart', socketKeys, globalVars, turnPath)
        }
        

    })

    //When a player moves, all their information should be put back into the global info system: the map of the keys
    socket.on('turnEnd', function(arg, localVars, order){
        socketKeys = arg
        globalVars = localVars
        turnPath = order

        for(let i = 0; i < turnPath.length; i++){
            if (socketKeys[turnPath[i][1]].is_turn){
                
        

                const nextPlayerIndex = (i + 1) % turnPath.length
                socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true
                socketKeys[turnPath[i][1]].is_turn = false

                break

            }
        }


        for (let i = 0; i < turnPath.length; i++){
            if (socketKeys[turnPath[i][1]].is_turn && globalVars.last_person_to_raise === i){
                for (let j = 0; j < turnPath.length; j++){
                    if (socketKeys[turnPath[j][1]].is_turn){
                        socketKeys[turnPath[j][1]].is_turn = false
                    }
                }
<<<<<<< Updated upstream

                if (turnPath[i][0] === globalVars.bigblind){
                    if (turnPath[i][0] === globalVars.bigblind) {
                        const nextPlayerIndex = (i + 1) % turnPath.length
                
                        socketKeys[turnPath[nextPlayerIndex][1]].is_turn = true
                        break
=======
             
                var inter = 0
                for (let i = 0; i < turnPath.length;i++ ){
                
                    if (!socketKeys[turnPath[i][1]].is_folded){
                        inter++
                    }
                }
                
                for (let i = 0; i < turnPath.length; i++){
                    if ((socketKeys[turnPath[i][1]].is_turn)){
                        if (globalVars.last_person_to_raise === i || globalVars.num_call === inter){
                            globalVars.num_call = 0

                            socketKeys[turnPath[i][1]].is_turn = false
                        
                            for (let x = 1; x < turnPath.length; x++){
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
>>>>>>> Stashed changes
                    }
                }
                socketKeys[turnPath[i][1]].is_turn = false
                if (globalVars.game_progress === 'pre-flop'){
                    globalVars.game_progress = 'flop'
                    console.log('flop')
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

            //Run lukes code to distribute money. 
            socket.emit('readyUp', socketKeys, globalVars, turnPath)
        }
        else {
            socket.emit('turnStart', socketKeys, globalVars, turnPath)
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