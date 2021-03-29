import Vue from 'vue'

const commonTime = (timestamp) => {
  const time = parseInt(timestamp) // ms
  const addZero = (num) => {
    if (num < 10) return `0${num}`
    return `${num}`
  }
  const dateObj = new Date(time)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const date = dateObj.getDate()

  const hour = dateObj.getHours()
  const min = dateObj.getMinutes()
  const sec = dateObj.getSeconds()
  return {
    year,
    month: addZero(month),
    date: addZero(date),
    hour: addZero(hour),
    min: addZero(min),
    sec: addZero(sec)
  }
}
const filter = {
  https (url) {
    return url.replace('http://', 'https://')
  },
  formatDate (timestamp) { // YYYY-MM-DD  HH:mm:ss
    const time = commonTime(timestamp)
    return `${time.year}-${time.month}-${time.date} ${time.hour}:${time.min}:${time.sec}`
  },
  formatShortDate(timestamp) { // YYYY/MM/DD  HH:mm
    const time = commonTime(timestamp * 1000)
    return `${time.year}/${time.month}/${time.date} ${time.hour}:${time.min}`
  },
  formatTime(timestamp) { // mm:ss
    const time = commonTime(timestamp * 1000)
    return `${time.min}:${time.sec}`
  }
}

Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key])
})

export default filter
