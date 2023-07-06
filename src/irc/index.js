const input = require('input')
const config = require('../config').init()
const net = require('net')
let callbacks
let clients = {}
let rooms = {}
const isAuthorized = socket => clients[socket].pass === config.get('password') && clients[socket].nick === config.get('login')

const initSettings = async () => {
  let login = config.get('login')
  let password = config.get('password')
  let port = config.get('port')
  let host = config.get('host')

  if (! login) {
    login = await input.text('IRC login: ')
    password = await input.text('IRC password: ')
    port = parseInt(await input.text('IRC port: '))
    host = await input.text('IRC host: ')
    config.set('login', login)
    config.set('password', password)
    config.set('port', port)
    config.set('host', host)
    config.save()
  }

  return [login, password, host, port]
}

const welcome = socket => {
  clients[socket].socket.write(`375 ${clients[socket].nick} :- Welcome to tgirc\n`)
}

const commands = {
  PASS: (line, socket) => {
    clients[socket].pass = line.substr(5).replace('\r', '')
    isAuthorized(socket) && welcome(socket)
  },
  NICK: (line, socket) => {
    clients[socket].nick = line.substr(5).replace('\r', '')
    isAuthorized(socket) && welcome(socket)
  },
  PRIVMSG: (line, socket) => {
    line = line.substr(8)
    const data = line.split(':').map(i => i.trim())
    const to = data[0].replace('#', '')
    const msg = data[1]
    isAuthorized(socket) && to !== clients[socket].nick && callbacks.onMessage(to, msg)
  },
  QUIT: (line, socket) => {
    clients[socket].socket.destroy()
  }
}

const parseData = (data, socket) => {
  const lines = data.split('\n')

  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].trim()) {
      console.log(`> ${lines[i]}`)
      let command = lines[i].match(/^[A-z]+/)
      command && (command = command[0])

      if (command && command in commands) {
        commands[command](lines[i], socket)
      }
    }
  }
}

const sendToClients = command => {
  for (let i in clients) {
    isAuthorized(i) && clients[i].socket.write(command)
  }
}

const sendMessage = (from, msg, chat) => {
  const messages = msg.split('\n')

  if (chat && ! rooms[chat]) {
    rooms[chat] = true
    const join = `JOIN ${chat}\n`
    console.log(`< ${join}`)
    sendToClients(join)
  }

  for (let i = 0; i < messages.length; ++i) {
    const message = `:${from} PRIVMSG ${chat || from} :${messages[i]}\n`
    sendToClients(message)
    console.log(`< ${message}`)
  }
}

const listener = socket => {
  const socketStr = `${socket.remoteAddress}:${socket.remotePort}`
  console.log(`New connection from ${socketStr}`)
  clients[socketStr] = {socket: socket}
  socket.on('data', data => {
    parseData(data.toString(), socketStr)
  })
  socket.on('error', error => {
    console.error('ERROR', error)
  })
  setInterval(() => {
    socket.write(`PING ${new Date().getTime()}\n`)
  }, 300000)
  setTimeout(() => {
    if (! isAuthorized(socketStr)) {
      console.log(`Disconnecting ${socketStr}`)
      socket.destroy()
      delete clients[socketStr]
    }
  }, 3000)

}

const initServer = () => {
  const host = config.get('host')
  const port = config.get('port')
  const server = net.createServer(listener)
  server.listen(port, host)
  console.log(`tgirc started on ${host}:${port}`)
}

const init = async _callbacks => {
  callbacks = _callbacks
  const [login, password, host, port] = await initSettings()
  initServer()
}

module.exports = {
  init: init,
  sendMessage: sendMessage
}
