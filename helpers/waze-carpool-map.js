let puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.waze.com/es/livemap?sms=true&utm_source=waze_website&utm_campaign=waze_website&utm_expid=.z8gftr2fShy0HjCgmeawNQ.1&utm_referrer=https%3A%2F%2Fwww.waze.com%2Fes%2Fapps');
    await page.waitFor(5000)
    await page.screenshot({path: 'example.png'});
    // await browser.close();
})();
  