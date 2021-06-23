import {nextId} from './id_helper'
import IndexArray from "index-array";

function prependSorted(list, item, sortedFieldName) {
  for (let i = 0; i < list.length; i++) {
    let iItem = list[i]
    if (item[sortedFieldName] >= iItem[sortedFieldName]) {
      list.splice(i, 0, item)
      break
    }
    if (i == list.length-1) {
      list.push(item)
    }
  }
}


function decorate(obj, nested = true) {
  return decorateArrays(decorateUids(obj, nested), nested)
}

function decorateArrays(obj, nested = true) {
  let result = obj

  if (_isObject(obj)) {
    for (let key in obj) {
      obj[key] = decorateArrays(obj[key])
    }
  }
  if (Array.isArray(obj)) {
    for (let i=0; i<obj.length; i++) {
      obj[i] = decorateArrays(obj[i])
    }
  }
  if (Array.isArray(obj) && !(obj instanceof IndexArray)) {
    result = new IndexArray(...obj)
  }

  return result
}


function decorateUids(obj, nested = true) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (_isObject(item) && !item.uid) {
        item.uid = nextId()
      }
    })
  }
  if (obj instanceof Object && nested) {
    for (let key in obj) {
      decorateUids(obj[key], nested)
    }
  }

  return obj
}


function _isObject(obj) {
  return obj instanceof Object && !Array.isArray(obj)
}



export {prependSorted, decorateArrays, decorateUids, decorate}