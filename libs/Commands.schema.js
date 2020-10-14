

const {warn,log,onerror,isFalsy, isNumber} = require('x-utils-es/umd')
//const {} =require('./utils')
/** 
 * - Operators logic
*/
const operators = {
    "W":Number, // positive integer to indicate the distance
    "R":Number, // Turn 90 degree to the right clockwise)
    "L":Number // Turn 90 degree to the left (counterclockwise)
}


/** 
 * - iterate thru entire string from start to end, reduce processed/matched values
 * @param input:string example input: `W5RW5RW2RW1R`
 * @returns [{},...]
*/
const operatorValueSetter = (input='') => {
  
    let dStr = input // reducing string left to right
    let oValues = []
    for (let i = 0; i < input.split('').length; i++) {
        if (input[i] === 'W') {

            // check if there is valid integer upto to decimals after W, else assing W0 value
            let integ = !isNaN(Number(input.substr(i + 1, 2))) ? Number(input.substr(i + 1, i + 2)) : Number(input.substr(i + 1, 1))

            if (!isNaN(integ)) oValues.push({ o: 'W', val: integ, inx:i })  
            else {
                oValues.push({ error: `invalid W{integer} provided, setting default {W0} at index:${i}`})
                oValues.push({ o: 'W', val: 0 })  
            }  
            dStr = dStr.substring(i,(integ).toString().length) + dStr.substring(i, dStr.length);
        }

        if (input[i] === 'R') {
            dStr = dStr.substring(i,i - 1) + dStr.substring(i, dStr.length);
            oValues.push({ o: 'R', val: 90,inx:i })
        }

        if (input[i] === 'L') {
            dStr = dStr.substring(i,i - 1) + dStr.substring(i, dStr.length);
            oValues.push({ o: 'L', val: -90,inx:i })
        }

        if (input[i] ==='L' || input[i] ==='R') {
            // if we provided wron combination for example L1 or R2 
            if (!isNaN(Number(input[i + 1]))) oValues.push({ error: `invalid combination after { ${ input[i] } }` })
        }
    }

    if(dStr.trim()) oValues.push({ error: `found un matched commads : ${dStr}`})
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
   if(!pre) return
   let errors = pre.filter(n=>n.error)
    // soft error but still allow to continue
    if (errors.length) {
        errors.forEach(err => {
            warn(err)
        });
    }
    // filter out errors
   return pre.filter(n=>n.error===undefined && !!n)
}

function CommandsSchema(rawData){
    console.log( Validate(rawData) )
    
}

exports.CommandsSchema = CommandsSchema
exports.operators = operators
exports.Validate = Validate