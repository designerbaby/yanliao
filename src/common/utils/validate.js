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
  const valueArray = value.split('')
  const r = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/
  for (let i = 0; i < valueArray.length; i += 1) {
    const item = valueArray[i]
    if (item === '-' || r.test(item)) {
      continue
    } else {
      callback(new Error('必须为中文或者“-”'))
      return
    }
  }
  callback()
}

export const validatePhone = (rule, value, callback) => {
  let r = /^1[3-9]\d{9}$/
  if (!r.test(value)) {
    callback(new Error('必须为正确的手机号码'))
    return
  }
  callback()
}

export const validatePassword = (rule, value, callback) => {
  let r = /^[\da-zA-Z]{6}$/
  if (!r.test(value)) {
    callback(new Error('必须为正确的密码'))
    return
  }
  callback()
}

export const validatorAuthCode = (rule, value ,callback) => {
  let r = /^\d{4}$/
  if (!r.test(value)) {
    callback(new Error('必须为正确的4位数验证码'))
    return
  }
  callback()
}
