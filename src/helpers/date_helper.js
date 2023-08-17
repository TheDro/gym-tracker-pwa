

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

// Run every dt milliseconds until callback returns true
function every(dt, callback) {
  let status = {
    _running: false,
    _handle: null,
    stop() {
      status._running = false
      clearTimeout(status._handle)
    },
    restart() {
      if (status._running === false) {
        status._running = true
        _every(status, dt, callback)
      }
    }
  }

  status.restart()
  
  return status;
}

function _every(status, dt, callback) {
  status._handle = setTimeout(() => {
    if (!status._running) {return}
    let result = callback();
    if (result === true) {
      return
    } else {
      _every(status, dt, callback)
    }
  }, dt);
}
window.every = every

export {todayDate, midDay, every}