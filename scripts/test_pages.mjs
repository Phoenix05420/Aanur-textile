import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPaging() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const pagesHtml = Array.from({length: 22}, (_, i) => `<div class="page-sheet"><h1>Page ${i+1}</h1><p>Content for page ${i+1}</p></div>`).join('\n');
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      @page {
        size: A4 portrait;
        margin: 10mm 12mm 10mm 12mm;
        @bottom-right {
          content: "Page " counter(page) " of " counter(pages);
        }
      }
      body { margin: 0; padding: 0; }
      .page-sheet {
        height: 245mm;
        max-height: 245mm;
        overflow: hidden;
        box-sizing: border-box;
      }
      .page-sheet:not(:last-child) {
        page-break-after: always;
        break-after: page;
      }
      .page-sheet:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    </style>
  </head>
  <body>
    ${pagesHtml}
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: 'test_clean_22.pdf',
    format: 'A4',
    margin: { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' }
  });
  await browser.close();
}

testPaging().then(() => console.log('Done test_clean_22.pdf'));
