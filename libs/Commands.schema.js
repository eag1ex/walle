

const { warn, log, onerror, isFalsy, isNumber } = require('x-utils-es/umd')
const {numInRange} =require('./utils')

/** 
 * - Operators logic
*/
const operators = {
    "W":Number, // positive integer to indicate the distance
    "R":Number, // Turn 90 degree to the right clockwise)
    "L":Number // Turn 90 degree to the left (counterclockwise)
}

/** 
 * - iterate thru entire string from start to end
 * @param input:string example input: `W5RW5RW2RW1R`
 * @returns [{},...]
*/
const operatorValueSetter = (input='') => {
  
    let dStr = input // reducing string left to right
    let oValues = []
    for (let i = 0; i < input.split('').length; i++) {

        if (i === 0 && !isNaN(parseInt(input[i]))) oValues.push({ error: `invalid, cannot provide integer at index:${i}` })
        if (input[i] === 'W') {
            let integ = numInRange(i+1,input)
            if (!isNaN(integ)) oValues.push({ o: 'W', val: integ, inx:i })  
            else {
                oValues.push({ error: `invalid W{integer} provided, setting default {W0} at index:${i}`})
                oValues.push({ o: 'W', val: 0 })  
            }  
        }

        if (input[i] === 'R') oValues.push({ o: 'R', val: 90,inx:i })
        if (input[i] === 'L')  oValues.push({ o: 'L', val: -90,inx:i })
        if (input[i] ==='L' || input[i] ==='R') {
            // if we provided wron combination for example L1 or R2 
            if (!isNaN(parseInt(input[i + 1]))) oValues.push({ error: `invalid combination after { ${ input[i] } }` })
        }
    }

    return oValues.filter(n=>!!n)
}


function preprocess(rawData = []) {
    let processed = []
    let str = rawData.toString().replace(',', '')

    if (!/[1-9\W\R\L\)]$/.test(str)) {
        onerror('invalid arguments provided, must provide W{}/L{}/R{} with cooresponding data')
        return false
    }
  
    return operatorValueSetter(str)
}

function Validate(rawData){
   let pre = preprocess(rawData)
   this.errors = []
   this.processed =[]
   if(!pre) {
       this.errors = ['preprocess is empty or not valid']
       return
   }
   this.errors = pre.filter(n=>n.error)
    // soft error but still allow to continue
    if (this.errors.length) {
        this.errors.forEach(err => {
            warn(err)
        });
    }
    // filter out errors
   this.processed = pre.filter(n=>n.error===undefined && !!n)
}

function CommandsSchema(rawData){
    let v = new Validate(rawData) 
    this.commands =v.processed
    this.errors = v.errors 
}

exports.CommandsSchema = CommandsSchema
exports.operators = operators
