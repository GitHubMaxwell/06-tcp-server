/* REQUIREMENTS
Clients should be able to connect to the chatroom through the use of telnet. Clients should also be able to run special commands
exit the chatroom    @exit
list all users       @list
reset their nickname @nick
send direct messages. @dm 

testing is not required.
*/

'use strict';
//1st and 3rd party modules to require and 
const EE = require('event'); //node module that gives access to 
const eventEmit = new EE(); //
const net = require('net'); //node module used for creating the server
const uuid = require('uuid/v4'); //way to identify individual users
const port = process.env.PORT || 3003;
const server = net.createServer(); //creating a "server isntance"
const socketPool = {};
////////////////////////////////////

//user constructor
let User = function(socket) {
  let id = uuid();
  this.id = id;
  this.nick = `Nickname`;
  this.socket = socket;
};

//connection listener / on user connection to the server
server.on('connection', (socket) => {
  let user = new User(socket);
  socketPool[user.id] = user;
  console.log(`New User Added`);
  //what is this data event and why does it 
  socket.on('data', (buffer) => { disAct(user.id, buffer);
  });
});

//dispatchAction = function that takes in the user.id and the buffer (that was derived from 'data' event) and PARSES the command buffer
let disAct = (userId, buffer) => {
  // the buffer comes in as an object so we have to convert to string
  let entry = parse(buffer);
};

//command parser (when entering commands into telnet)

//command handlers

//server listener
server.listen(port, ()=>{
  console.log('ITS ALIVE');
});