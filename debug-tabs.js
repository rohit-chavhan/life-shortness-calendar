const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('Testing tab switching...\n');
  
  // Check initial state (Me tab)
  let stats = await page.evaluate(() => {
    const weeksLeftEl = document.querySelector('.text-6xl');
    const yearsTextEl = document.querySelector('.flex.justify-between.text-xs');
    const match = yearsTextEl ? yearsTextEl.textContent.match(/(\d{1,3}(?:,\d{3})*)\s*weeks lived/) : null;
    
    return {
      weeksLeft: weeksLeftEl ? weeksLeftEl.textContent : 'not found',
      weeksLived: match ? match[1] : 'not found',
    };
  });
  
  console.log('Me tab (initial):');
  console.log('  Weeks lived:', stats.weeksLived);
  console.log('  Weeks left:', stats.weeksLeft);
  
  // Find tab buttons
  const tabButtons = await page.$$('button');
  console.log(`\nFound ${tabButtons.length} buttons total`);
  
  // Check which buttons are the tab buttons
  for (let i = 0; i < Math.min(10, tabButtons.length); i++) {
    const text = await tabButtons[i].textContent();
    console.log(`  Button ${i}: "${text}"`);
  }
  
  // Click Dad tab (should be button with text "Dad")
  console.log('\nClicking Dad button...');
  await page.click('button:has-text("Dad")');
  await page.waitForTimeout(1000);
  
  stats = await page.evaluate(() => {
    const weeksLeftEl = document.querySelector('.text-6xl');
    const yearsTextEl = document.querySelector('.flex.justify-between.text-xs');
    const match = yearsTextEl ? yearsTextEl.textContent.match(/(\d{1,3}(?:,\d{3})*)\s*weeks lived/) : null;
    
    return {
      weeksLeft: weeksLeftEl ? weeksLeftEl.textContent : 'not found',
      weeksLived: match ? match[1] : 'not found',
    };
  });
  
  console.log('\nDad tab (after clicking Dad):');
  console.log('  Weeks lived:', stats.weeksLived);
  console.log('  Weeks left:', stats.weeksLeft);
  console.log('  Expected: 2,769 lived, 1,027 left');
  
  // Click Mom tab
  console.log('\nClicking Mom button...');
  await page.click('button:has-text("Mom")');
  await page.waitForTimeout(1000);
  
  stats = await page.evaluate(() => {
    const weeksLeftEl = document.querySelector('.text-6xl');
    const yearsTextEl = document.querySelector('.flex.justify-between.text-xs');
    const match = yearsTextEl ? yearsTextEl.textContent.match(/(\d{1,3}(?:,\d{3})*)\s*weeks lived/) : null;
    
    return {
      weeksLeft: weeksLeftEl ? weeksLeftEl.textContent : 'not found',
      weeksLived: match ? match[1] : 'not found',
    };
  });
  
  console.log('\nMom tab (after clicking Mom):');
  console.log('  Weeks lived:', stats.weeksLived);
  console.log('  Weeks left:', stats.weeksLeft);
  console.log('  Expected: 2,543 lived, 1,253 left');
  
  await browser.close();
})();
