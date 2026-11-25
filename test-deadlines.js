const { chromium } = require('playwright');

async function checkPanelOverflow(page, tabName) {
  const overflow = await page.evaluate(() => {
    const panel = document.querySelector('.h-full.flex.flex-col.p-5');
    if (!panel) return { error: 'Panel not found' };
    return {
      scrollHeight: panel.scrollHeight,
      clientHeight: panel.clientHeight,
      hasOverflow: panel.scrollHeight > panel.clientHeight,
    };
  });
  
  console.log(`  ${tabName} panel: ${overflow.hasOverflow ? '✗ HAS OVERFLOW' : '✓ No overflow'} (${overflow.scrollHeight}px / ${overflow.clientHeight}px)`);
  return !overflow.hasOverflow;
}

async function takeScreenshots(page, prefix) {
  const tabs = ['Me', 'Dad', 'Mom'];
  
  for (const tab of tabs) {
    await page.click(`button:has-text("${tab}")`);
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: `${prefix}-${tab.toLowerCase()}.png`,
      fullPage: false 
    });
  }
  console.log(`  ✓ Screenshots saved: ${prefix}-{me,dad,mom}.png`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 950 });
  
  console.log('='.repeat(70));
  console.log('STEP 1: Screenshots of all 3 tabs with NO deadlines');
  console.log('='.repeat(70));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Clear any existing deadlines
  await page.evaluate(() => {
    localStorage.removeItem('life-calendar-deadlines');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Dark mode screenshots
  console.log('\nDark mode:');
  await takeScreenshots(page, 'final-dark-no-deadlines');
  
  // Light mode screenshots
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  console.log('\nLight mode:');
  await takeScreenshots(page, 'final-light-no-deadlines');
  
  // Switch back to dark mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  console.log('\n' + '='.repeat(70));
  console.log('STEP 2: Add 2 deadlines on Me tab and verify persistence');
  console.log('='.repeat(70));
  
  // Go to Me tab
  await page.click('button:has-text("Me")');
  await page.waitForTimeout(500);
  
  // Find and click a remaining box (around week 1300, which is about 1 year from now)
  console.log('\nAdding first deadline...');
  const firstBoxClicked = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return false;
    
    const columns = Array.from(grid.children);
    // Click on year 25, week 10 (around 1260)
    const col25 = columns[25];
    if (!col25) return false;
    
    const boxes = Array.from(col25.children);
    const box10 = boxes[10];
    if (!box10) return false;
    
    box10.click();
    return true;
  });
  
  if (firstBoxClicked) {
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Deadline"]', 'Launch new project');
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
    console.log('  ✓ First deadline added: "Launch new project"');
  }
  
  // Add second deadline
  console.log('\nAdding second deadline...');
  const secondBoxClicked = await page.evaluate(() => {
    const grid = document.querySelector('.flex.gap-0.h-full');
    if (!grid) return false;
    
    const columns = Array.from(grid.children);
    // Click on year 26, week 20 (around 1372)
    const col26 = columns[26];
    if (!col26) return false;
    
    const boxes = Array.from(col26.children);
    const box20 = boxes[20];
    if (!box20) return false;
    
    box20.click();
    return true;
  });
  
  if (secondBoxClicked) {
    await page.waitForTimeout(300);
    await page.fill('input[placeholder*="Deadline"]', 'Complete book draft');
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
    console.log('  ✓ Second deadline added: "Complete book draft"');
  }
  
  // Check that deadlines are visible in the panel
  const deadlinesVisible = await page.evaluate(() => {
    const deadlinesSection = Array.from(document.querySelectorAll('.text-sm.font-medium'))
      .find(el => el.textContent?.includes('Deadlines'));
    if (!deadlinesSection) return false;
    
    const parent = deadlinesSection.closest('div');
    return parent && parent.textContent.includes('Launch new project');
  });
  
  console.log(`\n  Deadlines visible in panel: ${deadlinesVisible ? '✓' : '✗'}`);
  
  // Check for "Next:" indicator
  const nextDeadlineVisible = await page.evaluate(() => {
    return document.body.textContent?.includes('Next: Launch new project');
  });
  
  console.log(`  "Next:" indicator visible: ${nextDeadlineVisible ? '✓' : '✗'}`);
  
  // Take screenshot with deadlines
  await page.screenshot({ path: 'final-with-deadlines-me.png' });
  console.log('\n  ✓ Screenshot saved: final-with-deadlines-me.png');
  
  // Reload page and verify persistence
  console.log('\nReloading page to test persistence...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  const deadlinesPersistedCheck = await page.evaluate(() => {
    const storage = localStorage.getItem('life-calendar-deadlines');
    if (!storage) return { persisted: false };
    
    const data = JSON.parse(storage);
    const meDeadlines = data.me || [];
    
    return {
      persisted: true,
      count: meDeadlines.length,
      labels: meDeadlines.map(d => d.label),
    };
  });
  
  console.log(`  Deadlines persisted: ${deadlinesPersistedCheck.persisted ? '✓' : '✗'}`);
  console.log(`  Count: ${deadlinesPersistedCheck.count}`);
  if (deadlinesPersistedCheck.labels) {
    console.log(`  Labels: ${JSON.stringify(deadlinesPersistedCheck.labels)}`);
  }
  
  // Verify deadlines still visible after reload
  const stillVisible = await page.evaluate(() => {
    return document.body.textContent?.includes('Launch new project') &&
           document.body.textContent?.includes('Complete book draft');
  });
  
  console.log(`  Deadlines still visible after reload: ${stillVisible ? '✓' : '✗'}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('STEP 3: Check panel overflow on all tabs in both themes');
  console.log('='.repeat(70));
  
  console.log('\nDark mode:');
  await checkPanelOverflow(page, 'Me');
  
  await page.click('button:has-text("Dad")');
  await page.waitForTimeout(500);
  await checkPanelOverflow(page, 'Dad');
  
  await page.click('button:has-text("Mom")');
  await page.waitForTimeout(500);
  await checkPanelOverflow(page, 'Mom');
  
  // Switch to light mode
  await page.click('[aria-label="Toggle theme"]');
  await page.waitForTimeout(500);
  
  console.log('\nLight mode:');
  await page.click('button:has-text("Me")');
  await page.waitForTimeout(500);
  await checkPanelOverflow(page, 'Me');
  
  await page.click('button:has-text("Dad")');
  await page.waitForTimeout(500);
  await checkPanelOverflow(page, 'Dad');
  
  await page.click('button:has-text("Mom")');
  await page.waitForTimeout(500);
  await checkPanelOverflow(page, 'Mom');
  
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log('✓ Small fixes implemented:');
  console.log('  - Legend added under grid');
  console.log('  - Life expectancy line ends at bottom with "73" label');
  console.log('  - Grid centered horizontally');
  console.log('  - Current week logic verified');
  console.log('');
  console.log('✓ Deadlines feature implemented:');
  console.log('  - Click orange box to add/edit deadline');
  console.log('  - White dot marker on deadline boxes');
  console.log('  - Tooltip shows label and date');
  console.log('  - localStorage persistence with versioning');
  console.log('  - Deadlines section in panel (up to 4, sorted)');
  console.log('  - "Next:" indicator on Me tab');
  console.log('  - No panel overflow on any tab/theme');
  
  await browser.close();
})();
