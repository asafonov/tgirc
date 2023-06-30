const telegram = require('../telegram')
const irc = require('../irc')

const init = async () => {
  await irc.init({
    onMessage: telegram.sendMessage
  })
  await telegram.init({
    onMessage: irc.sendMessage
  })
}

module.exports = {
  init: init
}
