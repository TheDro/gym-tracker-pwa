import shortId from 'short-uuid'

function nextId() {
  return shortId.generate()
}

export {nextId}