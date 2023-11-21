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
    res.sendFile(path.join(__dirname, '/public/play.html'));
});

// Serve client.js file
app.get('/client.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/client.js'));
});



//Socket keys contains player individual info, like  their bet, their hand, if its their turn, ect. 
let socketKeys = {}

//global vars contains information about the whole table, like who is smallblind, bigblind, what the table bet is
//what the progress of the flop is, ect. 
let globalVars = {}


//shows the progress of the ready-up
let readyVal = 0

io.on('connection', socket => {

    //On connection, socketID is mapped to the 
    if (!(socket.id in socketKeys)){
        socketKeys[socket.id] = ['name', 500, 0, false, false, ['temp']]
    }


    
    console.log("socketID:", socket.id);
    console.log(socketKeys)
    

    //Function starts the game, once all players have said they are ready, it shoots off the first 'turnhappend' event to the client
    socket.on('allready', function(){
        readyVal++ 
        if (readyVal === Object.keys(socketKeys).length){
            //Fire off the first turn happened, selecting a random player to start: 



        }
    })

    //When a player moves, all their information should be put back into the global info system: the map of the keys
    socket.on('turnEnd', function(arg, globalVars){
        console.log(arg)
        console.log(globalVars)
    })




    //Removes a socket when page is refreshed or closed. 
    socket.on('disconnect', function(){
        delete socketKeys[socket.id]
    })



    
    
    
});





server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
