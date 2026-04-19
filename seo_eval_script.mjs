import puppeteer from 'puppeteer';

(async () => {
    console.log("Starting high-level SEO evaluation of freetoolonline.com with Puppeteer...\n");

    const browser = await puppeteer.launch({ headless: true });
    
    // Evaluate sitemap
    console.log("==> Fetching and parsing sitemap.xml");
    const page = await browser.newPage();
    const sitemapUrl = 'https://freetoolonline.com/sitemap.xml';
    await page.goto(sitemapUrl, { waitUntil: 'domcontentloaded' });
    const sitemapContent = await page.content();
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
    const urls = urlMatches.map(m => m.replace(/<\/?loc>/g, ''));
    console.log(`Found ${urls.length} URLs in sitemap (or sitemap indices).`);
    
    // Sample URLs to test
    const sampleUrls = [
        'https://freetoolonline.com/',
        'https://freetoolonline.com/zip-file.html',
        'https://freetoolonline.com/md5-converter.html',
        'https://freetoolonline.com/image-tools.html'
    ];

    console.log("\n==> Crawling representative pages to evaluate structure and AI blocks...");
    
    for (const url of sampleUrls) {
        console.log(`\nEvaluating ${url}...`);
        const p = await browser.newPage();
        
        // Measure basic perf
        const start = Date.now();
        await p.goto(url, { waitUntil: 'networkidle2' });
        const loadTime = Date.now() - start;
        console.log(`- Load Time: ${loadTime}ms`);
        
        // Evaluate DOM
        const pageData = await p.evaluate(() => {
            const title = document.title;
            const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
            const metaDesc = document.querySelector('meta[name="description"]')?.content || 'MISSING';
            const canonical = document.querySelector('link[rel="canonical"]')?.href || 'MISSING';
            const adSlots = document.querySelectorAll('.adsbygoogle').length;
            const textHTMLRatio = (document.body.innerText.length / document.body.innerHTML.length).toFixed(2);
            
            // Check for answer blocks (usually step lists or definitions before the main tool UI)
            const mainContent = document.body.innerText.substring(0, 1500);
            const hasAnswerBlock = mainContent.toLowerCase().includes('what is') || mainContent.toLowerCase().includes('how to');
            
            // Schema check
            const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
                try { return JSON.parse(s.innerText)['@type']; } catch(e) { return 'Invalid'; }
            });
            
            return {
                title,
                h1s,
                metaDescLength: metaDesc.length,
                canonical,
                adSlots,
                textHTMLRatio,
                hasAnswerBlock,
                schemas,
                contentPreview: mainContent.substring(0, 100).replace(/\n/g, ' ')
            };
        });
        
        console.log(`- Title: ${pageData.title}`);
        console.log(`- H1 count: ${pageData.h1s.length} -> [${pageData.h1s.join(', ')}]`);
        console.log(`- Meta Desc Length: ${pageData.metaDescLength} chars`);
        console.log(`- Canonical: ${pageData.canonical}`);
        console.log(`- Ad Slots: ${pageData.adSlots}`);
        console.log(`- Answer Block Detected: ${pageData.hasAnswerBlock}`);
        console.log(`- Schemas found: ${pageData.schemas.join(', ')}`);
        
        await p.close();
    }

    await browser.close();
    console.log("\nEvaluation Complete.");
})();