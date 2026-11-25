const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check for any console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  // Take a screenshot in dark mode
  await page.screenshot({ path: 'test-dark.png' });
  console.log('Dark mode screenshot saved');
  
  // Switch to light mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  // Take a screenshot in light mode
  await page.screenshot({ path: 'test-light.png' });
  console.log('Light mode screenshot saved');
  
  // Check if boxes are visible
  const boxCheck = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid not found' };
    
    const boxes = grid.querySelectorAll('div[style*="borderRadius: 2px"]');
    console.log('Total boxes found:', boxes.length);
    
    let livedCount = 0;
    let remainingCount = 0;
    let livedColor = null;
    let remainingColor = null;
    
    boxes.forEach(box => {
      const bg = window.getComputedStyle(box).backgroundColor;
      // Lived: slate-300 in light (203, 213, 225) or slate-700 in dark (51, 65, 85)
      if (bg.includes('203, 213, 225') || bg.includes('51, 65, 85')) {
        livedCount++;
        livedColor = bg;
      }
      // Remaining: amber-500 (245, 158, 11) or amber-400 (251, 146, 60)
      else if (bg.includes('245, 158, 11') || bg.includes('251, 146, 60')) {
        remainingCount++;
        remainingColor = bg;
      }
    });
    
    return {
      totalBoxes: boxes.length,
      livedCount,
      remainingCount,
      livedColor,
      remainingColor,
    };
  });
  
  console.log('\nBox check in LIGHT mode:');
  console.log(JSON.stringify(boxCheck, null, 2));
  
  // Check the stats
  const stats = await page.evaluate(() => {
    const weeksLeftEl = document.querySelector('.text-6xl');
    const yearsLeftEl = document.querySelector('.flex.justify-between.text-xs');
    
    return {
      weeksLeft: weeksLeftEl ? weeksLeftEl.textContent : 'not found',
      yearsInfo: yearsLeftEl ? yearsLeftEl.textContent : 'not found',
    };
  });
  
  console.log('\nStats:');
  console.log(JSON.stringify(stats, null, 2));
  
  await browser.close();
})();
