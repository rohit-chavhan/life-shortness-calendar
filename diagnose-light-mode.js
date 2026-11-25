const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Switch to light mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  // Check if light mode is active
  const hasLightMode = await page.evaluate(() => {
    return !document.documentElement.classList.contains('dark');
  });
  
  console.log('Light mode active:', hasLightMode);
  
  // Get computed styles of a lived box
  const livedBoxStyle = await page.evaluate(() => {
    const livedBox = document.querySelector('.week-lived');
    if (!livedBox) return { found: false };
    
    const computed = window.getComputedStyle(livedBox);
    return {
      found: true,
      backgroundColor: computed.backgroundColor,
      width: computed.width,
      height: computed.height,
    };
  });
  
  console.log('Lived box:', livedBoxStyle);
  
  // Get computed styles of a remaining box
  const remainingBoxStyle = await page.evaluate(() => {
    const remainingBox = document.querySelector('.week-remaining');
    if (!remainingBox) return { found: false };
    
    const computed = window.getComputedStyle(remainingBox);
    return {
      found: true,
      backgroundColor: computed.backgroundColor,
    };
  });
  
  console.log('Remaining box:', remainingBoxStyle);
  
  // Get page background
  const pageBackground = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body);
    return computed.backgroundColor;
  });
  
  console.log('Page background:', pageBackground);
  
  // Check if colors are different
  if (livedBoxStyle.found && remainingBoxStyle.found) {
    if (livedBoxStyle.backgroundColor === remainingBoxStyle.backgroundColor) {
      console.error('ERROR: Lived and remaining boxes have the same color!');
    }
    if (livedBoxStyle.backgroundColor === pageBackground) {
      console.error('ERROR: Lived boxes match page background!');
    }
    if (remainingBoxStyle.backgroundColor === pageBackground) {
      console.error('ERROR: Remaining boxes match page background!');
    }
  }
  
  await browser.close();
})();
