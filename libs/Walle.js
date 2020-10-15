module.exports = () => {
    const { onerror, isNumber, log, warn, isFalsy, isObject } = require('x-utils-es/umd')
    const config = require('../config')
    const { readFile, writeFile } = require('x-fs')({ dir: config.memoryPath, ext: '.json', silent: true })

    const Helpers = require('./Walle.helpers')()
    return class Walle extends Helpers {

        constructor(opts, debug) {
            super(opts, debug)   

            /// set commands 
            this.initCommands()  
         
        }

        /** 
         * - set start position
         * - set commands
         * - if memory/state was set update current state
         * - do not set initial state if memory was enabled
        */
        initCommands() {
            if (this.options.memory) {
                if (this.debug) log('walle memory/state is enabled')
                let availState = readFile('walle_state') || {}
                if (!isFalsy(availState)) {
                    this.commands = this.schema.commands
                    this.updateSate(availState)
                      
                } else this.commands = [].concat(this.startPosition, this.schema.commands || [])
            } else {
                this.commands = [].concat(this.startPosition, this.schema.commands || [])
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


        /** 
         * @output
         * - get latest walking output
        */
        output() {
            return {
                X: this.state.x,
                Y: this.state.y,
                Direction: this.state.direction.name
            }
        }

        print() {
            let o = this.output()
            return `X: ${o.X} Y: ${o.Y} Direction: ${o.Direction}`
        }


        /** 
        * - operational data for walle, 
        * - source file `Schema.js`
        * @returns {commands, operators}
       */
        get schema() {
            return this.options.schema
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

        set commands(v) {
            this._commands = v
        }
        /** 
        * @commands
        * example: this.schema.commands >>
        [  { o: 'R', val: 90, inx: 1 }, // RIGHT
           { o: 'L', val: -90, inx: 10 } // LEFT
           { o: 'W', val: 5, inx: 2 }, // moving
            ]
           @returns []
       */
        get commands() {
            return this._commands
        }

      
        /** 
         * @walk
         * wall-e walks :)
         * - loop thru each command
        */
        walk() {
            if(this.debug) log('Walle starting to walk...')
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

    }

}   