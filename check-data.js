const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  const data = await page.evaluate(() => {
    const storageData = localStorage.getItem('life-calendar-data');
    const storageVersion = localStorage.getItem('life-calendar-version');
    return { data: storageData, version: storageVersion };
  });
  
  console.log('Storage version:', data.version);
  console.log('Storage data:', data.data);
  
  if (data.data) {
    const parsed = JSON.parse(data.data);
    console.log('\nParsed data:');
    console.log(JSON.stringify(parsed, null, 2));
  }
  
  await browser.close();
})();
