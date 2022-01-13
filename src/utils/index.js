// 员工号补零
export function add0 (num) {
  let str = num.toString()
  let length = str.length
  for (let i = 0; i < 8 - length; i++) {
    str = '0' + str
  }
  return str
}
