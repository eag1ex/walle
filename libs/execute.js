
const { onerror } = require('x-utils-es/umd')
try {

    // test executed commands
    const commands = require('./pre-process')

    // send valid to wlle
    const Walle = require('./Walle')(commands)
    const debug = true
    const opts = {
        memory: false // previous commands are written to file as cache
    }
    const wlle = new Walle(opts, debug)

    /// //////// output
    /// ////////////////
    console.log(wlle.walk().print())

} catch (err) {
    onerror(err)
}
