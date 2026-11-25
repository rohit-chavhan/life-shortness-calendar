const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 950 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Get scroll info
  const scrollInfo = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    needsScrolling: document.documentElement.scrollHeight > window.innerHeight
  }));
  
  console.log('Scroll Info:', JSON.stringify(scrollInfo, null, 2));
  
  await page.screenshot({ path: 'screenshot.png', fullPage: false });
  await browser.close();
})();
