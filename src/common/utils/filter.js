import Vue from 'vue'
const filter = {
  https (url) {
    return url.replace('http://', 'https://')
  },
  formatDate (timestamp) {
    const time = parseInt(timestamp)
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
    return `${year}-${addZero(month)}-${addZero(date)} ${addZero(hour)}:${addZero(min)}:${addZero(sec)}`
  }
}

Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key])
})

export default filter
