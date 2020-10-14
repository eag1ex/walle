
module.exports = () => {
    const { isNumber } = require('x-utils-es/umd')

    return class Helpers {
        constructor(opts = {}, debug) {
            this.debug = debug

            this.options = {
                memory: opts.memory || null
            }

            this._commands = []
            this._directionNum = 0 // facing north
            this._direction = {/** { name, value, coordinates, pos} */ }
            this.x = 0
            this.y = 0
            this.d = null // cached var
            this._state = {} // last state
        }

        /** 
         * @startPosition
         * - start position translates to `{ name: 'North', value: 0, coordinates: 'y', pos:'+' }`
        */
        get startPosition() {
            return [{ o: 'L', val: 0, inx: -1 },
                { o: 'W', val: 0, inx: -1 }]
        }
        /** 
        * - increment decrement value
        * @returns number
       */
        set directionNum(v) {
            if (!isNumber(v)) {
                console.log('direction must be a number')
                return
            }
            // initial state
            if (v === 0) {
                this._directionNum = 0
                return
            }

            if (this._directionNum >= 360 && v === 90) {
                this._directionNum = 90
                return
            }

            if (this._directionNum >= 360 && v === -90) {
                this._directionNum -= 90
                return
            }

            if (this._directionNum === 0 && v === -90) {
                this._directionNum = 270
                return
            }

            if (v === -90) {
                this._directionNum -= 90
                return
            }

            if (v === 90) {
                this._directionNum += v
                
            }
        }

        get directionNum() {
            return this._directionNum
        }

        get cardinals() {

            return [
                {
                    name: 'North',
                    value: 0,
                    coordinates: 'y',
                    pos: '+'
                },
                {
                    name: 'East',
                    value: 90,
                    coordinates: 'x',
                    pos: '+'
                },
                {
                    name: 'South',
                    value: 180,
                    coordinates: 'y',
                    pos: '-'
                },
                {
                    name: 'West',
                    value: 270,
                    coordinates: 'x',
                    pos: '-'
                },
                {
                    name: 'North',
                    value: 360,
                    coordinates: 'y',
                    pos: '+'
                }
            ]
        }
    }
}