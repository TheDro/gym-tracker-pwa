

function saveAsFile(data, filename = 'data.json') {
    
    // Create a URL with Blob of data
    const jsonData = JSON.stringify(data)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    // Create a link element to trigger the download
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Simulate a click event to trigger the download
    link.click()

    // Clean up the URL object
    URL.revokeObjectURL(url)
}

function loadJsonFile() {
    // Note: `showOpenilePicker` is not supported in Brave
    return _showOpenFilePicker().then(file => {
        return file.text()
    }).then(text => {
        return JSON.parse(text)
    })
}


function _showOpenFilePicker() {
    let input = document.createElement('input')
    input.type = 'file'
    input.multiple = false
    input.accept = '.json'

    input.style.position = 'fixed'
    input.style.top = '-10000px'
    input.style.left = '-10000px'
    document.body.appendChild(input)

    return new Promise((resolve, reject) => {
        input.addEventListener('change', () => {
            let file = input.files[0]
            if (!file) {
                reject()
            } else {
                resolve(file)
            }
            document.body.removeChild(input)
        })
        input.click()
    })
}


export {saveAsFile, loadJsonFile}