async function sendHttpRequest(body, url = '/user/auth', method = 'POST', headers = {'Content-Type': 'application/json'}) {
    let response = await fetch(url, {
        method,
        body,
        headers
    })

    return await response.json()
}

function getDataFromLocalStorage(key) {
    return localStorage.getItem(key)
}