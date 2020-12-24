export const validateInt = (rule, value, callback) => {
  let r = /^\d+$/
  if (!r.test(value) || value < 1) {
    callback(new Error('必须为正整数'))
  }
  callback()
}

export const validateFenmu = (rule, value, callback) => {
  if (value === 2 || value === 4 || value === 8 || value === 16) {
    callback()
  } else {
    callback(new Error('只能为2,4,8或16'))
  }
}