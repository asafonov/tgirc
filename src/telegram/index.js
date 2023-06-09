const {TelegramClient} = require('telegram')
const {StringSession} = require('telegram/sessions')
const {NewMessage} = require('telegram/events')
const input = require('input')
const cache = require('../config').init('cache')
let client

const getMessage = async message => {
  const sender = await message.getSender()
  const chat = await message.getChat()
  return {
    text: message.text,
    sender: sender.username || sender.phone || sender.id,
    title: chat.title,
    chatId: chat.id + '',
    self: sender.self
  }
}

const init = async (apiId, apiHash, callbacks) => {
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

    if (callbacks && callbacks.onMessage) {
      callbacks.onMessage(message)
    }

    console.log(message)
  }, new NewMessage({}))
}

const sendMessage = (to, message) => {
  client.sendMessage(to, {message: message})
}

module.exports = {
  init: init,
  sendMessage: sendMessage
}
