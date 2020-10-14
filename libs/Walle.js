module.exports = (executed) => {
    const { onerror, isNumber, log, warn, isFalsy, isObject } = require('x-utils-es/umd')
    const config = require('../config')
    const { readFile, writeFile } = require('x-fs')({ dir: config.memoryPath, ext: '.json', silent: true })
    const { Schema } = require('./Schema')

    // NOTE failed validation, and do not move forward
    const schema = new Schema(executed) // {commands,errors}

    const Helpers = require('./Walle.helpers')()
    return class Walle extends Helpers {

        constructor(opts, debug) {
            super(opts, debug)
            if (schema.errors.length) {
                onerror(schema.errors)
                throw ('schema error')
            }
            
            /// set commands 
            this.updateCommands()  
         
        }

        /** 
         * - set start position
         * - set commands
         * - if memory/state was set update current state
         * - do not set initial state if memory was enabled
        */
        updateCommands() {
            if (this.options.memory) {
                if (this.debug) log('walle memory/state is enabled')
                let availState = readFile('walle_state') || {}
                if (!isFalsy(availState)) {
                    this.commands = schema.commands
                    this.updateSate(availState)
                      
                } else this.commands = [].concat(this.startPosition, schema.commands || [])
            } else {
                this.commands = [].concat(this.startPosition, schema.commands || [])
            }
        }

        updateSate(availState = {}) {
            if (isNumber(availState.x) && isNumber(availState.y) && isObject(availState.direction)) {
                this.x = availState.x
                this.y = availState.y
                this.directionNum = availState.direction.value
                this.state = availState
                if (this.debug) log('walle memory/state updated')
            }   
        }

        set commands(v) {
            this._commands = v
        }
        /** 
        * @commands
        * example: schema.commands >>
        [  { o: 'R', val: 90, inx: 1 }, // RIGHT
           { o: 'L', val: -90, inx: 10 } // LEFT
           { o: 'W', val: 5, inx: 2 }, // moving
            ]
           @returns []
       */
        get commands() {
            return this._commands
        }

        output() {
            return {
                X: this.state.x,
                Y: this.state.y,
                Direction: this.state.direction.name
            }
        }

        /**
         * @state
         * - keep last state of walle
         */
        set state(v) {
            this._state = v
        }
        get state() {
            return this._state
        }

        print() {
            let o = this.output()
            return `X: ${o.X} Y: ${o.Y} Direction: ${o.Direction}`
        }

        /** 
         * @walk
         * wall-e walks :)
         * - loop thru 
        */
        walk() {
            this.commands.forEach(({ o, val, inx }, i) => {
               
                // direction
                if (o === 'R' || o === 'L') this.directionNum = val

                // walking walue
                if (o === 'W') {
                    if (this.direction.coordinates === 'y') {
                        if (this.direction.pos === '+') this.y += val
                        if (this.direction.pos === '-') this.y -= val
                    }
                    if (this.direction.coordinates === 'x') {
                        if (this.direction.pos === '+') this.x += val
                        if (this.direction.pos === '-') this.x -= val
                    }
                }

                // set last recorded state 
                this.state = {
                    x: this.x,
                    y: this.y,
                    direction: this.direction
                }
                if (this.debug) {
                    if (inx === -1) log('Walle walking, start position', this.output())
                    log('Walle walking', this.output())
                }
            })

            if (this.options.memory) writeFile('walle_state', this.state)
            return this
        }

        /** 
         * map assigned directionNum to cardinals
         * @returns {name, value,coordinates,pos} last direction 
        */
        get direction() {
            let d = this.cardinals.filter(({ name, value, coordinates, pos }) => {
                if (this.directionNum === value) return { name, value, coordinates, pos }
            })[0]
            if (!d) {
                warn('invalid direction', this.directionNum)
                return {}
            }
            return d
        }
        memory() {
            return this.mem
        }
    }

}   