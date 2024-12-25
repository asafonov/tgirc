const telegram = require('../telegram')
const irc = require('../irc')

const onIRCMessage = (to, message) => {
  telegram.sendMessage(to, message)
}

const onTelegramMessage = (from, msg, chat) => {
  irc.sendMessage(from, msg, chat)
}

const init = async () => {
  await irc.init({
    onMessage: onIRCMessage
  })
  await telegram.init({
    onMessage: onTelegramMessage
  })
}

module.exports = {
  init: init
}
