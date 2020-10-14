
// const {onerror,warn} = require('x-utils-es/umd')
/** 
 * validate if cli entered commands can be executed.
 * 
*/
const argv = (...args) => {
    const commands = args.flat().map((n, i) => i > 1 ? n : null).filter(n => !!(n || "").trim())

    if(!commands.length){
        throw('No commands provided')
    }
    return commands
}

module.exports = argv(process.argv)


