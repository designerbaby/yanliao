export const validateInt = (rule, value, callback) => {
  const val = parseInt(value)
  let r = /^\d+$/
  if (!r.test(val) || val < 1) {
    callback(new Error('必须为正整数'))
    return
  }
  callback()
}

export const validateFenmu = (rule, value, callback) => {
  const values = [2, 4, 8, 16]
  if (!values.includes(parseInt(value))) {
    callback(new Error('只能为2,4,8或16'))
    return
  }
  callback()
}

export const validateChinese = (rule, value, callback) => {
  const r = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/
  if (!r.test(value)) {
    callback(new Error('必须为中文'))
    return
  }
  callback()
}