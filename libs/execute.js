//require('./_support')

const { onerror, warn, log } = require('x-utils-es/umd')
try {

    // test executed commands
    const commands = require('./Pre-process')

    // send valid to wlle
    const Walle = require('./Walle')(commands)
    const debug = true
    const wlle = new Walle({}, debug)
    wlle.walk()
} catch (err) {
    onerror(err)
}


