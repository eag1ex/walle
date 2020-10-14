//require('./_support')

const { onerror, warn, log } = require('x-utils-es/umd')
try {

    // test executed commands
    const commands = require('./Pre-process')

    // send valid to Robotech
    const Robotech = require('./Robotech')(commands)
    const debug = true
    const rt = new Robotech({}, debug)
} catch (err) {
    onerror(err)
}


