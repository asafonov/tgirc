const {TelegramClient} = require('telegram')
const {StringSession} = require('telegram/sessions')
const {NewMessage} = require('telegram/events')
const input = require('input')
const cache = require('../config').init('cache')
const config = require('../config').init()
let client
const chatCache = {}

const getMessage = async message => {
  const sender = await message.getSender()
  const chat = await message.getChat()
  const chatTitle = chat?.title ? chat.title.replace(/ /g, '_').replace(/\:/g, '_') : ''
  const senderId = sender.username || sender.phone || sender.id
  const chatKey = chatTitle || senderId

  if (chat?.id) chatCache[chatKey] = chat.id

  return {
    text: message.text,
    sender: senderId,
    title: chatTitle,
    chatId: chat?.id + '',
    self: sender.self
  }
}

const initApi = async () => {
  let apiId = config.get('apiId')
  let apiHash = config.get('apiHash')

  if (! apiId) {
    apiId = await input.text('api id: ')
    apiHash = await input.text('api hash: ')
    let apiId = parseInt(apiId)
    config.set('apiId', apiId)
    config.set('apiHash', apiHash)
    config.save()
  }

  return [apiId, apiHash]
}

const init = async callbacks => {
  const [apiId, apiHash] = await initApi()
  const session = new StringSession(cache.get('session') || '')
  client = new TelegramClient(session, apiId, apiHash, {connectionRetries: 5})
  await client.start({
    phoneNumber: async () => await input.text('Phone number: '),
    password: async () => await input.text('Password: '),
    phoneCode: async () => await input.text('Code: '),
    onError: e => console.error(e)
  })
  cache.set('session', client.session.save())
  cache.save()
  client.addEventHandler(async event => {
    const message = await getMessage(event.message)

    if (callbacks && callbacks.onMessage && ! message.self) {
      callbacks.onMessage(message.sender, message.text, message.title ? `#${message.title}` : false)
    }
  }, new NewMessage({}))
}

const sendMessage = (to, message) => {
  const address = chatCache[to] || to

  if (message.substr(0, 6) === 'upload') {
    client.sendFile(address, {file: message.substr(7)})
  } else {
    client.sendMessage(address, {message: message})
  }
}

module.exports = {
  init: init,
  sendMessage: sendMessage
}
