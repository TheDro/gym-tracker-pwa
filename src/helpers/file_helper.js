

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
    return window.showOpenFilePicker().then(fileHandle => {
        return fileHandle[0].getFile()
    }).then(file => {
        return file.text()
    }).then(text => {
        return JSON.parse(text)
    })
}

export {saveAsFile, loadJsonFile}