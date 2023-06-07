#!/usr/bin/env node

const tgirc = require('./src/tgirc')

const app = async () => {
  tgirc.init()
}

app()
