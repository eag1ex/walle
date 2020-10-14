module.exports = (executed) => {

    const { operators, Validate,CommandsSchema } = require('./Commands.schema')

    // NOTE failed validation, and do not move forward
    CommandsSchema(executed)
    //if (!new Validate(executed).pass()) return

    const Helpers = require('./Robotech.helpers')()
    return class Robotech extends Helpers {

        constructor(opts, debug) {
            super(opts, debug)
        }

    }

}   