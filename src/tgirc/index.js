const telegram = require('../telegram')
const irc = require('../irc')

const init = async () => {
  await irc.init()
  await telegram.init()
}

module.exports = {
  init: init
}
