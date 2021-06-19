
function prependSorted(list, item, sortedFieldName) {
  for (let i = list.length-1; i < list.length; i++) {
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

export {prependSorted}