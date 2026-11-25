const puppeteer = require('puppeteer');

async function takeScreenshots(theme) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 950 });
  
  console.log(`\n=== ${theme.toUpperCase()} MODE ===`);
  console.log('Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Set theme
  await page.evaluate((themeMode) => {
    localStorage.setItem('theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, theme);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Me tab
  console.log('\n--- ME TAB ---');
  const meInfo = await page.evaluate(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const weeksLeftText = document.querySelector('.text-6xl')?.textContent || '';
    const weeksLivedText = Array.from(document.querySelectorAll('.text-xs')).find(el => 
      el.textContent?.includes('weeks lived')
    )?.textContent || '';
    
    // Count lived cells by looking for the lived color
    const allDivs = Array.from(document.querySelectorAll('div[style*="background"]'));
    const livedPattern = /rgb\(203,\s*213,\s*225\)|rgb\(51,\s*65,\s*85\)/; // slate-300 or slate-700
    const filledCells = allDivs.filter(div => {
      const style = div.getAttribute('style');
      return style && livedPattern.test(style);
    }).length;
    
    return {
      scrollHeight,
      innerHeight,
      needsScrolling: scrollHeight > innerHeight,
      weeksLeft: weeksLeftText.replace(/,/g, ''),
      weeksLivedText,
      filledCells
    };
  });
  
  console.log(`Scrolling: ${meInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
  console.log(`Weeks left: ${meInfo.weeksLeft}`);
  console.log(`Weeks lived text: ${meInfo.weeksLivedText}`);
  console.log(`Filled cells: ${meInfo.filledCells}`);
  
  await page.screenshot({ path: `screenshot-${theme}-me.png`, fullPage: false });
  console.log(`Screenshot saved: screenshot-${theme}-me.png`);
  
  // Dad tab
  console.log('\n--- DAD TAB ---');
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
    const weeksLivedText = Array.from(document.querySelectorAll('.text-xs')).find(el => 
      el.textContent?.includes('weeks lived')
    )?.textContent || '';
    
    const allDivs = Array.from(document.querySelectorAll('div[style*="background"]'));
    const livedPattern = /rgb\(203,\s*213,\s*225\)|rgb\(51,\s*65,\s*85\)/;
    const filledCells = allDivs.filter(div => {
      const style = div.getAttribute('style');
      return style && livedPattern.test(style);
    }).length;
    
    return {
      scrollHeight,
      innerHeight,
      needsScrolling: scrollHeight > innerHeight,
      weeksLeft: weeksLeftText.replace(/,/g, ''),
      weeksLivedText,
      filledCells
    };
  });
  
  console.log(`Scrolling: ${dadInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
  console.log(`Weeks left: ${dadInfo.weeksLeft}`);
  console.log(`Weeks lived text: ${dadInfo.weeksLivedText}`);
  console.log(`Filled cells: ${dadInfo.filledCells}`);
  
  await page.screenshot({ path: `screenshot-${theme}-dad.png`, fullPage: false });
  console.log(`Screenshot saved: screenshot-${theme}-dad.png`);
  
  // Mom tab
  console.log('\n--- MOM TAB ---');
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
    const weeksLivedText = Array.from(document.querySelectorAll('.text-xs')).find(el => 
      el.textContent?.includes('weeks lived')
    )?.textContent || '';
    
    const allDivs = Array.from(document.querySelectorAll('div[style*="background"]'));
    const livedPattern = /rgb\(203,\s*213,\s*225\)|rgb\(51,\s*65,\s*85\)/;
    const filledCells = allDivs.filter(div => {
      const style = div.getAttribute('style');
      return style && livedPattern.test(style);
    }).length;
    
    return {
      scrollHeight,
      innerHeight,
      needsScrolling: scrollHeight > innerHeight,
      weeksLeft: weeksLeftText.replace(/,/g, ''),
      weeksLivedText,
      filledCells
    };
  });
  
  console.log(`Scrolling: ${momInfo.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
  console.log(`Weeks left: ${momInfo.weeksLeft}`);
  console.log(`Weeks lived text: ${momInfo.weeksLivedText}`);
  console.log(`Filled cells: ${momInfo.filledCells}`);
  
  await page.screenshot({ path: `screenshot-${theme}-mom.png`, fullPage: false });
  console.log(`Screenshot saved: screenshot-${theme}-mom.png`);
  
  await browser.close();
}

(async () => {
  try {
    await takeScreenshots('dark');
    await takeScreenshots('light');
    console.log('\n=== COMPLETE ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
