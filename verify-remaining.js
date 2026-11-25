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
  
  const boxColors = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid not found' };
    
    const columns = Array.from(grid.children);
    
    // Check the 25th column (year 24, which should have both lived and remaining boxes for Me)
    const col25 = columns[24];
    if (!col25) return { error: 'Column 25 not found' };
    
    const boxes = Array.from(col25.children);
    
    const colors = boxes.map((box, i) => {
      const bg = window.getComputedStyle(box).backgroundColor;
      return { index: i, color: bg };
    });
    
    return {
      columnIndex: 24,
      boxCount: boxes.length,
      firstFew: colors.slice(0, 10),
      lastFew: colors.slice(-10),
    };
  });
  
  console.log('Column 24 (age 24, should have lived and remaining boxes for Me):');
  console.log(JSON.stringify(boxColors, null, 2));
  
  await browser.close();
})();
