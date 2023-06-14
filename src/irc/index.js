const input = require('input')
const config = require('../config').init()

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

const init = async callbacks => {
  const [login, password, host, port] = await initSettings()
}

module.exports = {
  init: init
}
