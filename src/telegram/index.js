const {TelegramClient} = require('teleproto')
const {StringSession} = require('teleproto/sessions')
const {NewMessage} = require('teleproto/events')
const input = require('input')
const cache = require('../config').init('cache')
const config = require('../config').init()
const alias = require('../config').init('alias')
let client
const chatCache = {}

const getTextFromText = text => {
  if (text.className === 'TextPlain') return text.text
  if (text.className === 'TextBold') return `**${getTextFromText(text.text)}**`
  if (text.className === 'TextItalic') return `*${getTextFromText(text.text)}*`
  if (text.className === 'TextFixed') return '`' + getTextFromText(text.text) + '`'
  if (text.className === 'TextConcat') return text.texts.map(getTextFromText).join('')
}

const getTextFromBlock = block => {
  if (block.text) return getTextFromText(block.text)
  if (block.items) = return block.items.map(getTextFromBlock).join('\n')
  if (block.blocks) return block.blocks.map(getTextFromBlock).join('\n')
  return ''
}

const getMessage = async message => {
  const sender = await message.getSender()
  const chat = await message.getChat()
  const chatTitle = chat?.title ? chat.title.replace(/ /g, '_').replace(/\:/g, '_') : ''
  const senderId = sender.username || sender.phone || sender.id
  const chatKey = chatTitle || senderId

  if (chat?.id) chatCache[chatKey] = chat.id

  const text = message.text || getTextFromBlock(message.richMessage) || ''

  return {
    text,
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
  const address = alias.get(to) || chatCache[to] || to

  if (message.substr(0, 6) === 'upload') {
    client.sendFile(address, {file: message.substr(7)})
  } else if (message.substr(0, 5) === 'alias') {
    const a = message.substr(6)
    alias.set(a, address)
    alias.save()
  } else {
    client.sendMessage(address, {message: message})
  }
}

module.exports = {
  init: init,
  sendMessage: sendMessage
}
