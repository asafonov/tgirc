const config = require('../config').init()
const telegram = require('../telegram')

const showLoginForm = f => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  readline.question('apiId: ', apiId => {
    readline.question('apiHash: ', apiHash => {
      readline.close()
      return f(apiId, apiHash)
    })
  })
}

const init = () => {
  const apiId = config.get('apiId')

  if (! apiId) {
    showLoginForm((apiId, apiHash) => {
      config.set('apiId', apiId)
      config.set('apiHash', apiHash)
      config.save()
      telegram.init(apiId, apiHash)
    })
  } else {
    const apiHash = config.get('apiHash')
    telegram.init(parseInt(apiId), apiHash)
  }
}

module.exports = {
  init: init
}
