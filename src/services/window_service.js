import IndexArray from "index-array";

const [SECOND, MINUTE, HOUR] = [1000, 60*1000, 60*60*1000]
let refocusCallbacks = new IndexArray() // [{delay: integer, callback: function}]
let lastBlur = new Date()

window.addEventListener('focus', checkRefocusCallbacks)
window.addEventListener('blur', () => {
  lastBlur = new Date()
})
function checkRefocusCallbacks() {
  let currentDelay = new Date() - lastBlur
  console.log(`Refocus after ${currentDelay/SECOND} seconds`)
  refocusCallbacks.forEach(({delay, callback}) => {
    if (currentDelay > delay) {
      callback()
    }
  })
}

function addRefocusListener(delay, callback) {
  refocusCallbacks.push({delay, callback})
  return callback
}

function removeRefocusListener(callback) {
  refocusCallbacks.remove({callback})
}


export {SECOND, MINUTE, HOUR, addRefocusListener, removeRefocusListener}