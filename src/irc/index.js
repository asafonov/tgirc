const input = require('input')
const config = require('../config').init()
const net = require('net')
let callbacks
let client
let pass
let nick
let rooms = {}
const isAuthorized = () => pass === config.get('password') && nick === config.get('login')

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

const welcome = () => {
  client.write(`375 ${nick} :- Welcome to tgirc\n`)
}

const commands = {
  PASS: line => {
    pass = line.substr(5).replace('\r', '')
    isAuthorized() && welcome()
  },
  NICK: line => {
    nick = line.substr(5).replace('\r', '')
    isAuthorized() && welcome()
  },
  PRIVMSG: line => {
    line = line.substr(8)
    const data = line.split(':').map(i => i.trim())
    const to = data[0].replace('#', '')
    const msg = data[1]
    to !== nick && callbacks.onMessage(to, msg)
  },
  QUIT: () => {
    client.destroy()
  }
}

const parseData = data => {
  const lines = data.split('\n')

  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].trim()) {
      console.log(`> ${lines[i]}`)
      let command = lines[i].match(/^[A-z]+/)
      command && (command = command[0])

      if (command && command in commands) {
        commands[command](lines[i])
      }
    }
  }
}

const sendMessage = (from, msg, chat) => {
  const messages = msg.split('\n')

  if (chat && ! rooms[chat]) {
    rooms[chat] = true
    const join = `JOIN ${chat}\n`
    console.log(`< ${join}`)
    client && client.write(join)
  }

  for (let i = 0; i < messages.length; ++i) {
    const message = `:${from} PRIVMSG ${chat || from} :${messages[i]}\n`
    client && client.write(message)
    console.log(`< ${message}`)
  }
}

const listener = socket => {
  console.log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`)
  client = socket
  socket.on('data', data => {
    parseData(data.toString())
  })
  socket.on('error', error => {
    console.error('ERROR', error)
  })
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
