const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 950 });
    
    console.log('Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Me tab (default)
    console.log('\n=== ME TAB ===');
    const meInfo = await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      
      // Get stats from the page
      const weeksLeftText = document.querySelector('.text-6xl')?.textContent || '';
      const weeksLivedText = document.querySelector('.text-xs.text-gray-400')?.textContent || '';
      
      // Count filled cells in grid
      const allCells = document.querySelectorAll('[style*="rgb(51, 65, 85)"]');
      const filledCells = allCells.length;
      
      return {
        scrollHeight,
        innerHeight,
        needsScrolling: scrollHeight > innerHeight,
        weeksLeft: weeksLeftText.replace(/,/g, ''),
        weeksLivedText,
        filledCells
      };
    });
    
    console.log(`Viewport: 1920x950`);
    console.log(`Scrolling: ${meInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
    console.log(`Weeks left (panel): ${meInfo.weeksLeft}`);
    console.log(`Weeks lived text: ${meInfo.weeksLivedText}`);
    console.log(`Filled cells (grid): ${meInfo.filledCells}`);
    
    await page.screenshot({ path: 'screenshot-me.png', fullPage: false });
    console.log('Screenshot saved: screenshot-me.png');
    
    // Dad tab
    console.log('\n=== DAD TAB ===');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dadButton = buttons.find(b => b.textContent?.includes('Dad'));
      if (dadButton) dadButton.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const dadInfo = await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const weeksLeftText = document.querySelector('.text-6xl')?.textContent || '';
      const weeksLivedText = document.querySelector('.text-xs.text-gray-400')?.textContent || '';
      const allCells = document.querySelectorAll('[style*="rgb(51, 65, 85)"]');
      const filledCells = allCells.length;
      
      return {
        scrollHeight,
        innerHeight,
        needsScrolling: scrollHeight > innerHeight,
        weeksLeft: weeksLeftText.replace(/,/g, ''),
        weeksLivedText,
        filledCells
      };
    });
    
    console.log(`Viewport: 1920x950`);
    console.log(`Scrolling: ${dadInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
    console.log(`Weeks left (panel): ${dadInfo.weeksLeft}`);
    console.log(`Weeks lived text: ${dadInfo.weeksLivedText}`);
    console.log(`Filled cells (grid): ${dadInfo.filledCells}`);
    
    await page.screenshot({ path: 'screenshot-dad.png', fullPage: false });
    console.log('Screenshot saved: screenshot-dad.png');
    
    // Mom tab
    console.log('\n=== MOM TAB ===');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const momButton = buttons.find(b => b.textContent?.includes('Mom'));
      if (momButton) momButton.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const momInfo = await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const weeksLeftText = document.querySelector('.text-6xl')?.textContent || '';
      const weeksLivedText = document.querySelector('.text-xs.text-gray-400')?.textContent || '';
      const allCells = document.querySelectorAll('[style*="rgb(51, 65, 85)"]');
      const filledCells = allCells.length;
      
      return {
        scrollHeight,
        innerHeight,
        needsScrolling: scrollHeight > innerHeight,
        weeksLeft: weeksLeftText.replace(/,/g, ''),
        weeksLivedText,
        filledCells
      };
    });
    
    console.log(`Viewport: 1920x950`);
    console.log(`Scrolling: ${momInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
    console.log(`Weeks left (panel): ${momInfo.weeksLeft}`);
    console.log(`Weeks lived text: ${momInfo.weeksLivedText}`);
    console.log(`Filled cells (grid): ${momInfo.filledCells}`);
    
    await page.screenshot({ path: 'screenshot-mom.png', fullPage: false });
    console.log('Screenshot saved: screenshot-mom.png');
    
    console.log('\n=== COMPLETE ===\n');
    
    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
