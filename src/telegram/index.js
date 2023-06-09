const {TelegramClient} = require('telegram')
const {StringSession} = require('telegram/sessions')
const {NewMessage} = require('telegram/events')
const input = require('input')
const cache = require('../config').init('cache')

const init = async (apiId, apiHash, callbacks) => {
  const session = new StringSession(cache.get('session') || '')
  const client = new TelegramClient(session, apiId, apiHash, {connectionRetries: 5})
  await client.start({
    phoneNumber: async () => await input.text('Phone number: '),
    password: async () => await input.text('Password: '),
    phoneCode: async () => await input.text('Code: '),
    onError: e => console.error(e)
  })
  cache.set('session', client.session.save())
  cache.save()
  client.addEventHandler(event => {
    const message = getMessage(event)

    if (callbacks.onMessage) {
      callbacks.onMessage(message)
    }

    console.log(event)
  }, new NewMessage({}))
}

module.exports = {
  init: init
}
