export function getLatelyMonth() {
  let date = new Date();
  let beforeDate = new Date(date.getTime() - 2678400000);
  let beforeMonth = beforeDate.getMonth() + 1 < 10 ? '0' + beforeDate.getMonth() + 1 : beforeDate.getMonth() + 1
  let beforedate = beforeDate.getDate() < 10 ? '0' + beforeDate.getDate() : beforeDate.getDate()
  let nowMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let nowdate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return [`${beforeDate.getFullYear()}-${beforeMonth}-${beforedate}`, `${date.getFullYear()}-${nowMonth}-${nowdate}`]
}

export function getYYYY_MM_HH(time) {
  let date = new Date(time);
  let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return `${date.getFullYear()}-${month}-${day}`
}

/* 时间转换 */
export function transformSecondsToTime(second) {
  let hours = Math.floor(second / 3600)
  let mins = Math.floor((second / 60) % 60)
  let secs = Math.floor(second % 60)
  hours = hours < 10 ? `0${hours}` : hours
  mins = mins < 10 ? `0${mins}` : mins
  secs = secs < 10 ? `0${secs}` : secs
  return second <= 0 ? '00:00:00' : `${hours}:${mins}:${secs}`
}

export function transformSecondsToTime2(second) {
  let hours = Math.floor(second / 3600)
  let mins = Math.floor((second / 60) % 60)
  let secs = Math.floor(second % 60)
  hours = hours < 10 ? `0${hours}` : hours
  mins = mins < 10 ? `0${mins}` : mins
  secs = secs < 10 ? `0${secs}` : secs
  return second <= 0 ? ['00','00','00'] : [hours, mins, secs]
}

export class TimeCountDown {
  constructor(time, callback) {
    this.time = time
    this.callback = callback
  }
  countDown() {
    if (this.time <= 0) {
      this.callback()
    } else {
      this.time--
      setTimeout(() => {
        this.countDown()
      }, 1000)
    }
  }
}