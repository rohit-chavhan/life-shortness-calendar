const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const gridInfo = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid container not found' };
    
    console.log('Grid found:', grid);
    
    // Get all children
    const columns = Array.from(grid.children);
    console.log('Number of columns:', columns.length);
    
    if (columns.length > 0) {
      const firstColumn = columns[0];
      console.log('First column:', firstColumn);
      console.log('First column children:', firstColumn.children.length);
      
      if (firstColumn.children.length > 0) {
        const firstBox = firstColumn.children[0];
        console.log('First box:', firstBox);
        console.log('First box style:', firstBox.getAttribute('style'));
        const computed = window.getComputedStyle(firstBox);
        console.log('First box backgroundColor:', computed.backgroundColor);
        console.log('First box width:', computed.width);
        console.log('First box height:', computed.height);
      }
    }
    
    // Try to find boxes by all divs in grid
    const allDivs = grid.querySelectorAll('div');
    console.log('Total divs in grid:', allDivs.length);
    
    return {
      columns: columns.length,
      totalDivs: allDivs.length,
    };
  });
  
  console.log('Grid info:', gridInfo);
  
  await browser.close();
})();
