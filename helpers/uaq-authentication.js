let querySelector = require('cheerio'),
    puppeteer = require('puppeteer'),
    path = require('path'),
    fs = require('fs');

let result = []

async function downloadImage(uri, filename) {
    try {
        fs.writeFileSync(path.join(__dirname, '..', 'assets', 'img', 'students', filename), await uri.buffer())
    } catch (error) {
        console.log('Ocurrio un error al descargar la imágen', error)
    }
}

async function main(expedient, password) {
    let {browser, page} = await openBrowser()
    await fillInput(page, '#clave', expedient)
    await fillInput(page, '#nip', password)
    await page.click('#botonSubmit')
    if(isValidUser(page.url())) {
        await closeBrowser(browser)
        return 'Usuario o contraseña incorrectos'
    }
    await page.waitForSelector('#infoAlumno')
    result.push(await getUserInformation(await getNodeInformation(await page.content(), '#infoAlumno')))
    await page.click('#modulo0')
    await getDataFrame(page)
    result.push(await getPicture(await page.content()))
    await downloadImage(await page.goto(result[2]), `${result[0][0]}.png`)
    await closeBrowser(browser)
    return result
}

async function getPicture(html) {
    let str = querySelector('img.foto', html).attr('src')
    return `https://comunidad2.uaq.mx/portal${str.split('.').slice(-1).pop()}`
}

async function getDataFrame(page) {
    try {
        await page.waitForSelector('iframe')
        let frame = await page.frames().find(frame => frame.name() === 'contenido')
        await tryIfCrash(frame, '#tabs', true)
        await searchCurrentCareer(frame, '#tabs > ul')
    } catch (error) {
        console.log('Ocurrio un error al obtener el frame', error)
    }
}

async function tryIfCrash (action, selector, isAsync = true) {
    let crash
    do {
        try {
            await action.waitForSelector(selector)
            crash = false
        } catch (error) {
            crash = true
        }
    } while (crash);
}

async function searchCurrentCareer(frame, selector) {
    for(let i = 1; i <= querySelector(`${selector} > li`, await frame.content()).toArray().length; i++) {
        await frame.click(`${selector} > li:nth-child(${i})`)
        await frame.waitForSelector(`#ui-tabs-${i} > #generalesSection > div.gWrapper`)
        let data = await getUserInformation(await getNodeInformation(await frame.content(), `#ui-tabs-${i} > #generalesSection > div.gWrapper`, 'label', 'val'))
        if(data[4].search(/SI/) !== -1) {
            result.push(data)
            break;
        }
    }
}

async function openBrowser() {
    let browser = await puppeteer.launch({headless: false}),
        page = await browser.newPage();
        await page.goto('https://comunidad2.uaq.mx/portal/index.jsp');

    return {browser, page}
}

async function fillInput(page, selector, str) {
    await page.focus(selector),
    await page.keyboard.type(str)
}

async function getNodeInformation(html, selector, nodeName, nodeClass = '') {
    let nodes = []
    if(!nodeName) {
        nodes = querySelector(selector, html).contents().toArray().filter(node => node.name === nodeName && querySelector(node).text().trim(' ') !== '')
    } else { 
        let findSelector = (!!nodeClass) ? `${nodeName}.${nodeClass}` : nodeName 
        nodes = querySelector(selector, html).find(findSelector).toArray().map(node => querySelector(node).toArray())
    }

    return nodes
}

async function getUserInformation(nodes) {
    return nodes.map(node => querySelector(node).text().trim(' '))
}

function isValidUser(url) {
    return (url.split('/').pop().search(/Login.do/) !== -1) ? true : false
}

async function closeBrowser(browser) {
    await browser.close()
}

module.exports = {
    main
}