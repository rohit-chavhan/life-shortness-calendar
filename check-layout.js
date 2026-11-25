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
    
    // Get scroll and box size info
    const info = await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const needsScrolling = scrollHeight > innerHeight;
      
      // Try to find the box size debug text
      const debugText = document.querySelector('.absolute.bottom-2.right-2');
      const boxSize = debugText ? debugText.textContent : 'Not found';
      
      return {
        scrollHeight,
        innerHeight,
        needsScrolling,
        boxSize,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    
    console.log('\n=== LAYOUT CHECK ===');
    console.log(`Viewport: ${info.viewportWidth}x${info.viewportHeight}`);
    console.log(`Document scroll height: ${info.scrollHeight}px`);
    console.log(`Window inner height: ${info.innerHeight}px`);
    console.log(`Needs scrolling: ${info.needsScrolling ? 'YES ❌' : 'NO ✓'}`);
    console.log(`Box size: ${info.boxSize}`);
    console.log('==================\n');
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'layout-check.png', fullPage: false });
    console.log('Screenshot saved to layout-check.png');
    
    await browser.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
