const {TelegramClient} = require('telegram')
const {StringSession} = require('telegram/sessions')
const cache = require('../config').init('cache')

const init = (apiId, apiHash) => {
}

module.exports = {
  init: init
}
