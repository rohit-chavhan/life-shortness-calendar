const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Switch to light mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  const boxStyles = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid not found' };
    
    const columns = Array.from(grid.children);
    if (columns.length === 0) return { error: 'No columns' };
    
    const firstColumn = columns[0];
    const boxes = Array.from(firstColumn.children);
    
    if (boxes.length === 0) return { error: 'No boxes in first column' };
    
    // Check first 10 boxes
    const boxInfo = [];
    for (let i = 0; i < Math.min(10, boxes.length); i++) {
      const box = boxes[i];
      const computed = window.getComputedStyle(box);
      boxInfo.push({
        index: i,
        inlineStyle: box.getAttribute('style'),
        backgroundColor: computed.backgroundColor,
        width: computed.width,
        height: computed.height,
      });
    }
    
    return { boxInfo };
  });
  
  console.log('Box styles in LIGHT mode:');
  console.log(JSON.stringify(boxStyles, null, 2));
  
  await browser.close();
})();
