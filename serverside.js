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




socketKeys = {}
io.on('connection', socket => {
    console.log("socketID:", socket.id);



    //On connection, socketID is mapped to the 
    if (!(socket.id in socketKeys)){
        socketKeys[socket.id] = ['name', 500, 0, false, false, ['temp']]
    }
    

    console.log(socketKeys)


    // Temporary function
    socket.on('clicked', function (data){
        console.log('found a click:', data);
        //for (var item in socketKeys){
        //    console.log(item + '  :  ' +  socketKeys[item] + ' : '+ socket.connected[socketKeys[item]])
        //}
   
    })
  

    //Removes a socket when page is refreshed or closed. 
    socket.on('disconnect', function(){
        delete socketKeys[socket.id]
    })



    
    
    
});





server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
