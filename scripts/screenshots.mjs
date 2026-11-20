// README ekran görüntülerini üretir: `npm run dev` açıkken `node scripts/screenshots.mjs`
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const PAGES = [
  ['home', '/'],
  ['kurlar', '/kurlar'],
  ['cevirici', '/cevirici?amount=250&from=EUR&to=TRY'],
  ['grafikler', '/grafikler?from=USD&to=TRY'],
  ['alarmlar', '/alarmlar'],
  ['hakkinda', '/hakkinda'],
  ['iletisim', '/iletisim'],
]

const browser = await chromium.launch({ channel: 'msedge' })
const shoot = async (opts, suffix, list) => {
  const ctx = await browser.newContext({ colorScheme: 'dark', locale: 'tr-TR', ...opts })
  await ctx.addInitScript(() => {
    localStorage.setItem(
      'kur-store',
      JSON.stringify({
        state: {
          theme: 'dark',
          lang: 'tr',
          base: 'TRY',
          favorites: ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CNY'],
          alerts: [
            { id: '1', from: 'USD', to: 'TRY', op: 'above', target: 50 },
            { id: '2', from: 'EUR', to: 'TRY', op: 'below', target: 54 },
          ],
        },
        version: 0,
      }),
    )
  })
  const page = await ctx.newPage()
  for (const [name, path] of list) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `docs/screenshots/${name}${suffix}.png` })
    console.log('✓', name + suffix)
  }
  await ctx.close()
}

await shoot({ viewport: { width: 1440, height: 900 } }, '', PAGES)
await shoot({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true }, '-mobile', PAGES.slice(0, 2))
await browser.close()
