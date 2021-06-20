

function todayDate() {
  let today = new Date()
  let year = today.getFullYear()
  let month = ('0' + (today.getMonth()+1)).slice(-2)
  let day = ('0' + today.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

function midDay(date) {
  let hour = ('0'+ (12 + new Date().getTimezoneOffset()/60)).slice(-2)
  let day = new Date(`${date}T${hour}:00:00`)

  return day
}

export {todayDate, midDay}