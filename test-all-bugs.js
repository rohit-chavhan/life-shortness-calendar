const { chromium } = require('playwright');
const fs = require('fs');

async function testTab(page, tabName, tabIndex) {
  console.log(`\n=== Testing ${tabName} tab ===`);
  
  // Click the tab
  const tabs = await page.$$('[role="tab"]');
  if (tabs[tabIndex]) {
    await tabs[tabIndex].click();
    await page.waitForTimeout(500);
  }
  
  // Count filled boxes by checking background colors
  const filledBoxes = await page.evaluate(() => {
    // Find all week boxes in the grid
    const gridContainer = document.querySelector('.flex.gap-0.h-full');
    if (!gridContainer) return 0;
    
    const allBoxes = gridContainer.querySelectorAll('div[style*="width"][style*="height"][style*="borderRadius"]');
    let count = 0;
    
    allBoxes.forEach(box => {
      const bg = window.getComputedStyle(box).backgroundColor;
      // Check if it's not transparent and not the remaining color (amber)
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && !bg.includes('245, 158, 11') && !bg.includes('251, 146, 60')) {
        count++;
      }
    });
    
    return count;
  });
  
  console.log(`Filled boxes: ${filledBoxes}`);
  
  return filledBoxes;
}

async function testTheme(page, themeName, isDark) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${themeName.toUpperCase()} MODE`);
  console.log('='.repeat(60));
  
  // Set theme
  if (!isDark) {
    await page.click('[aria-label="Toggle theme"]');
    await page.waitForTimeout(500);
  }
  
  // Verify theme is active
  const themeActive = await page.evaluate((dark) => {
    const hasDark = document.documentElement.classList.contains('dark');
    return dark ? hasDark : !hasDark;
  }, isDark);
  
  console.log(`${themeName} mode active: ${themeActive}`);
  
  // Bug 1: Check box visibility
  const boxColors = await page.evaluate(() => {
    // Find boxes by their inline styles
    const gridContainer = document.querySelector('.flex.gap-0.h-full');
    if (!gridContainer) {
      return { error: 'Grid not found' };
    }
    
    const allBoxes = gridContainer.querySelectorAll('div[style*="width"][style*="height"][style*="borderRadius"]');
    let lived = null;
    let remaining = null;
    
    allBoxes.forEach(box => {
      const bg = window.getComputedStyle(box).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') {
        // Lived boxes are slate (darker/muted)
        if (bg.includes('203, 213, 225') || bg.includes('51, 65, 85')) {
          lived = bg;
        }
        // Remaining boxes are amber (brighter)
        else if (bg.includes('245, 158, 11') || bg.includes('251, 146, 60')) {
          remaining = bg;
        }
      }
    });
    
    const bodyStyle = window.getComputedStyle(document.body);
    
    return {
      lived: lived || 'not found',
      remaining: remaining || 'not found',
      page: bodyStyle.backgroundColor,
    };
  });
  
  console.log('\n--- Bug 1: Box Visibility Check ---');
  console.log('Lived box color:', boxColors.lived);
  console.log('Remaining box color:', boxColors.remaining);
  console.log('Page background:', boxColors.page);
  
  let visibilityError = false;
  if (boxColors.lived === boxColors.remaining) {
    console.error('ERROR: Lived and remaining boxes have the same color!');
    visibilityError = true;
  }
  if (boxColors.lived === boxColors.page) {
    console.error('ERROR: Lived boxes match page background!');
    visibilityError = true;
  }
  if (boxColors.remaining === boxColors.page) {
    console.error('ERROR: Remaining boxes match page background!');
    visibilityError = true;
  }
  if (!visibilityError) {
    console.log('✓ All colors are different (boxes visible)');
  }
  
  // Bug 2: Check panel overflow
  const panelOverflow = await page.evaluate(() => {
    const panel = document.querySelector('.h-full.flex.flex-col.p-5');
    if (!panel) return { error: 'Panel not found' };
    
    return {
      scrollHeight: panel.scrollHeight,
      clientHeight: panel.clientHeight,
      hasOverflow: panel.scrollHeight > panel.clientHeight,
    };
  });
  
  console.log('\n--- Bug 2: Panel Overflow Check ---');
  console.log(`Panel scrollHeight: ${panelOverflow.scrollHeight}px`);
  console.log(`Panel clientHeight: ${panelOverflow.clientHeight}px`);
  console.log(`Has overflow: ${panelOverflow.hasOverflow}`);
  
  if (panelOverflow.hasOverflow) {
    console.error('ERROR: Panel has overflow/scrollbar!');
  } else {
    console.log('✓ Panel fits without scrolling');
  }
  
  // Test each tab
  const tabs = [
    { name: 'Me', index: 0, expected: { lived: 1251, yearsLeft: 48.9 } },
    { name: 'Dad', index: 1, expected: { lived: 2769, yearsLeft: 19.8 } },
    { name: 'Mom', index: 2, expected: { lived: 2543, yearsLeft: 24.1 } },
  ];
  
  for (const tab of tabs) {
    const filled = await testTab(page, tab.name, tab.index);
    
    // Bug 3: Check years left calculation
    const yearsLeft = await page.evaluate(() => {
      const progressText = document.querySelector('.flex.justify-between.text-xs');
      if (!progressText) return null;
      
      const match = progressText.textContent.match(/([\d.]+)\s*years left/);
      return match ? parseFloat(match[1]) : null;
    });
    
    console.log(`Years left: ${yearsLeft}`);
    console.log(`Expected: ${tab.expected.yearsLeft}`);
    
    if (Math.abs(yearsLeft - tab.expected.yearsLeft) < 0.1) {
      console.log('✓ Years left correct');
    } else {
      console.error(`ERROR: Expected ${tab.expected.yearsLeft}, got ${yearsLeft}`);
    }
    
    // Check panel overflow for this tab
    const tabPanelOverflow = await page.evaluate(() => {
      const panel = document.querySelector('.h-full.flex.flex-col.p-5');
      if (!panel) return { hasOverflow: false };
      return { hasOverflow: panel.scrollHeight > panel.clientHeight };
    });
    
    console.log(`Panel overflow for ${tab.name}: ${tabPanelOverflow.hasOverflow ? 'YES (ERROR)' : 'NO (OK)'}`);
  }
  
  // Take screenshots for each tab
  for (let i = 0; i < 3; i++) {
    const tabs = await page.$$('[role="tab"]');
    await tabs[i].click();
    await page.waitForTimeout(500);
    
    const tabNames = ['me', 'dad', 'mom'];
    await page.screenshot({ 
      path: `screenshot-${themeName}-${tabNames[i]}.png`,
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
  await page.waitForTimeout(1500);
  
  // Bug 4: Verify default theme is dark
  const defaultIsDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });
  
  console.log('\n--- Bug 4: Default Theme Check ---');
  console.log(`Default theme is dark: ${defaultIsDark}`);
  if (defaultIsDark) {
    console.log('✓ Default theme is dark');
  } else {
    console.error('ERROR: Default theme should be dark!');
  }
  
  // Test dark mode
  await testTheme(page, 'dark', true);
  
  // Test light mode
  await testTheme(page, 'light', false);
  
  console.log('\n' + '='.repeat(60));
  console.log('All tests complete!');
  console.log('='.repeat(60));
  
  await browser.close();
})();
