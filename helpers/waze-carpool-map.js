let puppeteer = require('puppeteer'),
    cheerio = require('cheerio');


let data = false;
(async () => {
    let browser = await puppeteer.launch({headless: false})
    page = await browser.newPage();
    await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36" });
    await page.goto('https://www.waze.com/es/livemap/directions?utm_campaign=waze_website&utm_expid=.z8gftr2fShy0HjCgmeawNQ.0&utm_referrer=https%3A%2F%2Fwww.waze.com%2Fes%2Fcarpool&utm_source=waze_website&latlng=20.59%2C-100.425');
    await page.mouse.click(420, 10)
    await page.mouse.click(420, 10)
    await page.keyboard.press('ArrowUp')
    await page.waitFor(1000)
    await page.evaluate(() => {
        let dom = document.querySelector('.wm-cards.with-poi')
        dom.remove()
    })
    await page.waitFor(1000)
    
    
    let icons = await page.$('.wm-alert-icon--zoom15')

    console.log('woorks')
    for(let i = 0; i <= 35; i++) {

        if(i % 10 === 0) {
            await page.keyboard.press('ArrowLeft')
        }
        await page.waitFor(1000)
        let icons = await page.$$('.wm-alert-icon--zoom15')
        
        for(let icon of icons) {
            let coords = await page.evaluate(icon => {
                let {left, top} = icon.getBoundingClientRect()
                return {x: left, y: top}
            }, icon)
            
            if(coords.x < 1000 && coords.x > 10 && coords.y < 500 && coords.y > 10) {
                // await page.mouse.click(coords.x, coords.y)
                await page.mouse.click(coords.x + 20, coords.y + 30, {button: 'right'})
                data = true
                console.log(coords)
                break;
            }
        }
        if(data) break;
    }
        
    await page.waitFor(1000)
    await page.click('button.wm-action:nth-child(1)')
    // }

    //  const header = await page.$('a');
//   const rect = await page.evaluate((header) => {
//     const {top, left, bottom, right} = header.getBoundingClientRect();
//     return {top, left, bottom, right};
//   }, header);
//   console.log(rect);
    // await browser.close();
})();
  