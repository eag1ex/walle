module.exports = (executed) => {
    const {onerror,isNumber, log,warn} = require('x-utils-es/umd') 
    const { operators, Validate,CommandsSchema } = require('./Commands.schema')

    // NOTE failed validation, and do not move forward
    const schema = new CommandsSchema(executed) // {commands,errors}

    // possible/mixed choices for W/R/L commands
    /** 
     * example: schema.commands >>
     [  { o: 'R', val: 90, inx: 1 },
        { o: 'W', val: 5, inx: 2 },
        { o: 'L', val: -90, inx: 10 } ]
    */

    console.log(schema.commands)

    const Helpers = require('./Walle.helpers')()
    return class Walle extends Helpers {

        constructor(opts, debug) {
            super(opts, debug)
            if(schema.errors.length){
                onerror(schema.errors)
                throw('schema error') 
            } 

            // keep record of previous actions
            this.mem = {
                x: 0,
                y: 0,
                r:0,
                l:0,
                w:0
            }
 
            this._directionNum =0 // facing north
            this._direction = { name: 'North', value: 0, coordinates: 'y' }
            this.x = 0
            this.y = 0

        }

        // X: 15 Y: -1 Direction: South
        output(){
            return {
                X:this.x,
                Y:this.y,
                Direction: this.direction.name
            }
        }

        /** 
         * wall-e walks :)
        */
        walk() {
            this.commands.forEach(({ o, val }, i) => {
                if (o === 'R' || o === 'L') {
                    this.directionNum = val
                   // console.log('directionNum',this.directionNum)
                }

                if (o === 'W') {
                    console.log
                    if (this.direction.coordinates === 'y') {
                        if(this.direction.pos==='+') this.y += val
                        if(this.direction.pos==='-') this.y -= val
                    }
                    if (this.direction.coordinates === 'x') {
                        if(this.direction.pos==='+') this.x += val
                        if(this.direction.pos==='-') this.x -= val
                    }
                }
                if(this.debug) log('-- walking',this.output())
                //this.mem
            })
            return this
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

            let dir = this._directionNum
            if (dir >= 360 && v > 0) return
            if (dir <= 0 && v < 0) return

            if (v === -90) this._directionNum -= v
            if (v === 90) this._directionNum += v

        }

        get directionNum(){
            return this._directionNum
        }

        get cardinals() {

            return [
                {
                    name: 'North',
                    value: 0,
                    coordinates:'y',
                    pos:'+'
                },
                {
                    name: 'East',
                    value: 90,
                    coordinates:'x',
                    pos:'+'
                },
                {
                    name: 'South',
                    value: 180,
                    coordinates:'y',
                    pos:'-'
                },
                {
                    name: 'West',
                    value: 270,
                    coordinates:'x',
                    pos:'-'
                },
                {
                    name: 'North',
                    value: 360,
                    coordinates:'y',
                    pos:'+'
                }
            ]
        }

        /** 
         * map assigned directionNum to cardinals
         * @returns {name, value,coordinates,pos} last direction 
        */
        get direction() {
            let d = this.cardinals.filter(({ name, value,coordinates,pos }) => {
                if (this.directionNum === value) return { name, value,coordinates,pos }
            })[0]
            if (!d) {
                warn('invalid direction',this.directionNum )
                return {}
            }
            return d
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
        get commands(){
            return schema.commands ||[]
        }

        memory(){
            return this.mem
        }

        // declining value max 360
        // set dLeft(v){
        //     this._dLeft = Number(v)
        // }
        // get dLeft(){
        //     return this._dLeft
        // }

        // // inclining value max 360
        // set dRight(v){
        //     this._dRight = Number(v)
        // }

        // get dRight(){
        //     return this._dRight
        // }

        

    }

}   