import puppeteer from 'puppeteer-core';

async function testAll8Diagrams() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const diagrams = [
    // Page 12
    {
      id: 'p12_left',
      code: `flowchart TD
    A([Enter /shop]) --> B[Fetch /api/products]
    B --> C[Render Bedsheet Grid]
    C --> D{Customer Action}
    D -->|Filter Size/Weave| E1[Update Active Cards]
    D -->|Click Dye Swatch| E2[Live Color Photo Swap]
    D -->|Click Card Title| E3([Navigate /product/:id])
    E1 --> C
    E2 --> C`
    },
    {
      id: 'p12_right',
      code: `flowchart TD
    A([Click Quick View]) --> B[Open Flyout Modal]
    B --> C[Fetch Product Details]
    C --> D[Select Bed Size Pill]
    D --> E[Click Add to Bag]
    E --> F[Display Feedback Toast]
    F --> G([Close Modal & Continue])`
    },

    // Page 13
    {
      id: 'p13_left',
      code: `flowchart TD
    A([Open /cart]) --> B{Bag Items?}
    B -->|Empty| C[Show Zero-State CTA]
    B -->|Active| D[Render Line Items]
    D --> E{User Action}
    E -->|Qty +/-| F1[Update Item Quantity]
    E -->|Delete| F2[Remove Line Item]
    F1 --> G[Recalculate Subtotal]
    F2 --> G
    G --> H([Proceed to Checkout])`
    },
    {
      id: 'p13_right',
      code: `flowchart TD
    A([Input Promo Code]) --> B{Evaluate Code}
    B -->|SECRET15| C1[Apply 15% Secret Off]
    B -->|AANUR10| C2[Apply 10% Mill Off]
    B -->|OFFER50| C3[Apply Flat Rs 50 Off]
    B -->|Invalid| C4[Show Invalid Toast]
    C1 --> D{Subtotal >= Rs 999?}
    C2 --> D
    C3 --> D
    C4 --> D
    D -->|Yes| E1[Free Shipping: Rs 0]
    D -->|No| E2[Standard Courier: Rs 49]
    E1 --> F([Render Gross Net Total])
    E2 --> F`
    },

    // Page 14
    {
      id: 'p14_left',
      code: `flowchart TD
    A([Enter /checkout]) --> B{Auth Status}
    B -->|Guest| C1[Manual Address Entry]
    B -->|Member| C2[Autofill Saved Address]
    C1 --> D{Validate 6-Digit PIN}
    C2 --> D
    D -->|Invalid Digits| E1[Alert: 6 Digits Required]
    E1 --> C1
    D -->|Valid PIN| E2([Proceed to Payment])`
    },
    {
      id: 'p14_right',
      code: `flowchart TD
    A([Select Payment]) --> B{Payment Mode}
    B -->|Cash on Delivery| C1[Status: Pending Delivery]
    B -->|Pre-paid Online| C2[Gateway Simulation]
    C1 --> D[Click Complete Order]
    C2 --> D
    D --> E[POST /api/orders]
    E --> F[Issue AT-XXXXXX Ref]
    F --> G[Dual Resend Email Dispatch]
    G --> H([Redirect /verify-order])`
    },

    // Page 15
    {
      id: 'p15_left',
      code: `flowchart TD
    A([Open Sign In Modal]) --> B[Input Mobile or Email]
    B --> C{Rate Limit Check}
    C -->|Exceeded > 5| D1[429 Rate Limit Alert]
    D1 --> B
    C -->|Allowed| D2[Generate 6-Digit OTP]
    D2 --> E{Channel}
    E -->|Email| F1[Resend API Gateway]
    E -->|Phone| F2[SMS Gateway Mock]
    F1 --> G([Display 6-Digit Modal])
    F2 --> G`
    },
    {
      id: 'p15_right',
      code: `flowchart TD
    A([Enter 6-Digit OTP]) --> B[Start 60s Countdown]
    B --> C{Verify Code & TTL}
    C -->|Mismatch/Expired| D1[Show Error Alert]
    D1 --> A
    C -->|Valid Code| D2[Sign HMAC-SHA256 Token]
    D2 --> E[Save aanur_is_logged_in]
    E --> F[Hydrate Customer Profile]
    F --> G([Close Modal & Resume])`
    }
  ];

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <script src='https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'></script>
    <script>
      window.onload = () => {
        mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      };
    </script>
  </head>
  <body>
    ${diagrams.map(d => `<div class='mermaid' id='${d.id}'>${d.code}</div>`).join('')}
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => {
    const svgs = document.querySelectorAll('svg');
    return svgs.length === 8;
  }, { timeout: 20000 });

  const errors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.mermaid')).map(el => ({
      id: el.id,
      hasError: el.innerText.includes('Syntax error')
    }));
  });

  errors.forEach(e => {
    console.log(`${e.id} -> Syntax Error: ${e.hasError}`);
  });

  await browser.close();
}

testAll8Diagrams().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
