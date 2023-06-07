const data = {}

const init = name => {
  if (! name) name = process.argv[2] || 'tgirc'
  if (data[name]) return data[name]

  const fs = require('fs')
  const dirName = `${process.env.HOME}/.config/tgirc`

  try {
    fs.mkdirSync(dirName, {recursive: true})
  } catch {}

  let filename = `${dirName}/${name}`
  let config

  const save = () => {
    let data = 'module.exports = {\n'

    for (let k in config) {
      data += `  ${JSON.stringify(k)}: ${JSON.stringify(config[k])},\n`
    }

    data += '}'
    fs.writeFileSync(filename, data)
  }
  const get = name => config[name]
  const set = (name, value) => config[name] = value
  const unset = name => delete config[name]
  const join = data => config = {...config, ...data}

  try {
    config = require(filename)
  } catch {
    config = {}
  }

  data[name] = {get: get, set: set, unset: unset, join: join, save: save}
  return data[name]
}

module.exports = {init: init}
