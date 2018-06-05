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
const EE = require('events'); //node module that gives access to 
const eventEmit = new EE(); //
const net = require('net'); //node module used for creating the server
const uuid = require('uuid/v4'); //way to identify individual users
const port = process.env.PORT || 3003;
const server = net.createServer(); //creating a "server isntance"
let socketPool = {};
////////////////////////////////////

//user constructor
let User = function(socket) {
  let id = uuid();
  this.id = id;
  this.nick = `Nickname ${id}`;
  this.socket = socket;
};

//connection listener / on user connection to the server
server.on('connection', (socket) => {
  let user = new User(socket);
  //called a dictionary
  socketPool[user.id] = user;
  console.log(`New User Added`);
  socket.on('data', (buffer) => disAct(user.id,buffer));
});


let disAct = (userId, buffer) => {
  let entry = parse(buffer);
  entry && eventEmit.emit(entry.command, entry, userId);
};

//command parser (when entering commands into telnet)
let parse = (buffer) => {
  let text = buffer.toString().trim();

  if(!text.startsWith('@')) { 
    return console.log(`${text} is an incorrect command`);
  }
  let [command,payload] = text.split(/\s+(.*)/);
  let [target,message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command,payload,target,message};
};

//command handlers
eventEmit.on('@all', (data, userId) => {
  for( let connection in socketPool ) {
    console.log('connection: ', connection);
    let user = socketPool[connection];
    user.socket.write(`<${socketPool[userId].nick}>: ${data.payload}\n`);
  }
});

eventEmit.on('@exit', (data, userId) => {
  socketPool[userId].socket.destroy();
  console.log(`${socketPool[userId].nick} left the game`);
  delete socketPool[userId];
});

eventEmit.on('@nick', (data, userId) => {
  socketPool[userId].nick = data.target;
  console.log(`${socketPool[userId].id} changed their nickname to ${socketPool[userId].nick}`);
});

eventEmit.on('@dm', (data, userId) => {
  let findUser = data.target;
  for (let find in socketPool) {
    if (findUser === socketPool[find].nick) {
      let dmUser = socketPool[find];
      dmUser.socket.write(`FROM ${socketPool[userId].nick} TO ${data.target}>::::: ${data.message}`);
    }
  }
});

eventEmit.on('@list', (data ,userId) => {
  console.log('SOCKET POOL>>>>>',socketPool);
  let userArr = [];
  for ( let connection in socketPool ) {
    let user = socketPool[connection];
    userArr.push(user.nick);
  }
  console.log('USER ID>>>>', userId);
  socketPool[userId].socket.write(`The List contains: ${userArr}`);
});


server.listen(port, ()=>{
  console.log('ITS ALIVE');
});