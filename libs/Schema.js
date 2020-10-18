

// Returns valid Schema
// @returns {schema,operators}
module.exports = (rawInput) => {

    const { onerror } = require('x-utils-es/umd')
    const { numInRange } = require('./utils')

    /** 
     * - Operators logic
    */
    const operators = {
        "W": Number, // positive integer to indicate the distance, always rounded
        "R": Number, // Turn 90 degree to the right clockwise)
        "L": Number // Turn -90 degree to the left (counterclockwise)
    }

    /** 
     * - iterate thru entire string from start to end
     * @param input:string example input: `W5RW5RW2RW1R`
     * @returns [{ o, val, inx},...]
    */
    const operatorValueSetter = (input = '') => {

        let oValues = []
        for (let i = 0; i < input.split('').length; i++) {

            if (i === 0 && !isNaN(parseInt(input[i]))) oValues.push({ error: `invalid, cannot provide integer at index:${i}` })
            if (input[i] === 'W') {
                let integ = numInRange(i + 1, input)
                if (!isNaN(integ)) oValues.push({ o: 'W', val: integ, inx: i })
                else {
                    // NOTE soft error, will still pass when not set to {strict} with default start position
                    oValues.push({ error: `invalid W{integer} provided, setting default {W0} at index:${i}` })
                    oValues.push({ o: 'W', val: 0 })
                }
            }

            if (input[i] === 'R') oValues.push({ o: 'R', val: 90, inx: i })
            if (input[i] === 'L') oValues.push({ o: 'L', val: -90, inx: i })
            if (input[i] === 'L' || input[i] === 'R') {
                // if we provided wrong combination for example L1 or R2 
                if (!isNaN(parseInt(input[i + 1]))) oValues.push({ error: `invalid combination after { ${input[i]} }` })
            }
        }

        return oValues.filter(n => !!n)
    }

    /** 
     * check operator input, make sure only valid operators can be used
     * @returns [{ o, val, inx},...]
    */
    function preprocess(rawData = []) {

        let input = rawData.toString().replace(/,/g,'')
        input = input.toUpperCase()

        if (!/[0-9W\R\L)]$/.test(input)) {
            onerror('invalid arguments provided, must provide W{}/L{}/R{} with corresponding data')
            return false
        }
        return operatorValueSetter(input)
    }

    function Validate() {
        this.errors = []
        this.processed = []
        this.init = (rawData) => {
            let pre = preprocess(rawData) || []
            this.errors = pre.filter(n => n.error).map(n => n.error)
            // validate schema operators
            pre = pre.map(el => {
                let { o, val } = el
                if (val !== undefined) {
                    if (operators[o].prototype === (val).__proto__) return el
                } else {
                    this.errors.push(`o: [${o}]=${val} is not a valid operator`)
                }
            }).filter(n => !!n)
            // filter out errors
            this.processed = pre.filter(n => n.error === undefined && !!n)
        }
    }


    /** 
     * initiate Schema
     * - can add any additional logic that will reflect commands output 
    */
    Schema.prototype = new Validate()
    Schema.prototype.constructor = Schema
    function Schema(rawData) {
        this.init(rawData)
        this.commands = this.processed
        this.operators = operators
    }

    // create valid schema, ready for export
    const schema = new Schema(rawInput)

    return schema
}