
/** 
 * - extract all numbers from range until next char
 * - allow numbers with decimals, and round them
 * @param start:Number start index
 * @param str:String
 * @returns number or undefined
*/
exports.numInRange = (start = 0, str = '') => {
    let str_position = str.substr(start, str.length)
    let s = ''
    for (let i = 0; i < str_position.length; i++) {
        if (str_position[i] !== '.' && /[a-z]/i.test(str_position[i])) {
            break
        }
        if (!isNaN(parseInt(str_position[i])) ||
            str_position[i] === '.'
        ) {
            s = s + str_position[i]
        }
    }
    if (!isNaN(parseInt(s))) {
        return Math.round(s)
    } else return undefined
}