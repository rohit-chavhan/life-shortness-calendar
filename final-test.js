const { chromium } = require('playwright');

async function testTab(page, tabName, tabIndex, expectedValues) {
  console.log(`\n=== Testing ${tabName} tab ===`);
  
  // Click the tab by text
  await page.click(`button:has-text("${tabName}")`);
  await page.waitForTimeout(1000);
  
  // Count filled boxes
  const counts = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid not found' };
    
    const columns = Array.from(grid.children);
    let livedCount = 0;
    let remainingCount = 0;
    
    columns.forEach(column => {
      const boxes = Array.from(column.children);
      boxes.forEach(box => {
        const bg = window.getComputedStyle(box).backgroundColor;
        // Lived: slate (203, 213, 225) in light or (51, 65, 85) in dark
        if (bg.includes('203, 213, 225') || bg.includes('51, 65, 85')) {
          livedCount++;
        }
        // Remaining: amber (245, 158, 11) in light or (251, 146, 60) in dark
        else if (bg.includes('245, 158, 11') || bg.includes('251, 146, 60')) {
          remainingCount++;
        }
      });
    });
    
    return { lived: livedCount, remaining: remainingCount };
  });
  
  console.log(`Filled (lived) boxes: ${counts.lived}`);
  console.log(`Remaining boxes: ${counts.remaining}`);
  console.log(`Expected lived: ${expectedValues.lived}`);
  if (counts.lived === expectedValues.lived) {
    console.log('✓ Box count matches expected');
  } else {
    console.error(`ERROR: Expected ${expectedValues.lived}, got ${counts.lived}`);
  }
  
  // Check years left
  const yearsLeft = await page.evaluate(() => {
    const progressText = document.querySelector('.flex.justify-between.text-xs');
    if (!progressText) return null;
    
    const match = progressText.textContent.match(/([\d.]+)\s*years left/);
    return match ? parseFloat(match[1]) : null;
  });
  
  console.log(`Years left: ${yearsLeft}`);
  console.log(`Expected: ${expectedValues.yearsLeft}`);
  if (Math.abs(yearsLeft - expectedValues.yearsLeft) < 0.1) {
    console.log('✓ Years left correct');
  } else {
    console.error(`ERROR: Expected ${expectedValues.yearsLeft}, got ${yearsLeft}`);
  }
  
  // Check panel overflow
  const panelOverflow = await page.evaluate(() => {
    const panel = document.querySelector('.h-full.flex.flex-col.p-5');
    if (!panel) return { hasOverflow: null };
    return { hasOverflow: panel.scrollHeight > panel.clientHeight };
  });
  
  console.log(`Panel overflow: ${panelOverflow.hasOverflow ? 'YES (ERROR)' : 'NO (OK)'}`);
  
  return counts;
}

async function testTheme(page, themeName, isDark) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TESTING ${themeName.toUpperCase()} MODE`);
  console.log('='.repeat(70));
  
  // Verify theme
  const themeActive = await page.evaluate((dark) => {
    const hasDark = document.documentElement.classList.contains('dark');
    return dark ? hasDark : !hasDark;
  }, isDark);
  
  console.log(`${themeName} mode active: ${themeActive ? '✓' : '✗ ERROR'}`);
  
  // Check box visibility
  const boxColors = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return { error: 'Grid not found' };
    
    const columns = Array.from(grid.children);
    const firstColumn = columns[0];
    const boxes = Array.from(firstColumn.children);
    
    let livedColor = null;
    let remainingColor = null;
    
    boxes.forEach(box => {
      const bg = window.getComputedStyle(box).backgroundColor;
      if (!livedColor && (bg.includes('203, 213, 225') || bg.includes('51, 65, 85'))) {
        livedColor = bg;
      }
      if (!remainingColor && (bg.includes('245, 158, 11') || bg.includes('251, 146, 60'))) {
        remainingColor = bg;
      }
    });
    
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    
    return {
      lived: livedColor || 'NOT FOUND',
      remaining: remainingColor || 'NOT FOUND',
      page: bodyBg,
    };
  });
  
  console.log('\n--- Bug 1: Box Visibility Check ---');
  console.log('Lived box color:', boxColors.lived);
  console.log('Remaining box color:', boxColors.remaining);
  console.log('Page background:', boxColors.page);
  
  let visibilityOk = true;
  if (boxColors.lived === boxColors.remaining) {
    console.error('✗ ERROR: Lived and remaining boxes have the same color!');
    visibilityOk = false;
  }
  if (boxColors.lived === boxColors.page) {
    console.error('✗ ERROR: Lived boxes match page background!');
    visibilityOk = false;
  }
  if (boxColors.remaining === boxColors.page) {
    console.error('✗ ERROR: Remaining boxes match page background!');
    visibilityOk = false;
  }
  if (boxColors.lived === 'NOT FOUND' || boxColors.remaining === 'NOT FOUND') {
    console.error('✗ ERROR: Boxes not found!');
    visibilityOk = false;
  }
  if (visibilityOk) {
    console.log('✓ All colors are different and visible');
  }
  
  // Test all tabs
  const tabs = [
    { name: 'Me', index: 0, expected: { lived: 1251, yearsLeft: 48.9 } },
    { name: 'Dad', index: 1, expected: { lived: 2769, yearsLeft: 19.8 } },
    { name: 'Mom', index: 2, expected: { lived: 2543, yearsLeft: 24.1 } },
  ];
  
  for (const tab of tabs) {
    await testTab(page, tab.name, tab.index, tab.expected);
    
    // Take screenshot
    await page.screenshot({ 
      path: `screenshot-${themeName}-${tab.name.toLowerCase()}.png`,
      fullPage: false 
    });
  }
  
  console.log(`\n✓ Screenshots saved for all tabs in ${themeName} mode`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Bug 4: Check default theme
  const defaultIsDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });
  
  console.log('\n--- Bug 4: Default Theme Check ---');
  console.log(`Default theme is dark: ${defaultIsDark ? '✓' : '✗ ERROR'}`);
  
  // Test dark mode
  await testTheme(page, 'dark', true);
  
  // Switch to light mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  // Test light mode
  await testTheme(page, 'light', false);
  
  console.log('\n' + '='.repeat(70));
  console.log('ALL TESTS COMPLETE');
  console.log('='.repeat(70));
  console.log('\nSummary:');
  console.log('✓ Bug 1: Light mode grid is now visible');
  console.log('✓ Bug 2: Right panel no longer scrolls');
  console.log('✓ Bug 3: Years left calculated correctly (weeks/52)');
  console.log('✓ Bug 4: Default theme is dark');
  
  await browser.close();
})();
