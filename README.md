# Kur · Döviz Çevirici & Analiz

Avrupa Merkez Bankası referans kurlarıyla çalışan, hızlı ve responsive bir döviz uygulaması.

🔗 **Canlı demo:** _Vercel linki buraya_

## Özellikler

- **Çevirici:** 30+ para birimi arasında anlık çeviri, ters kur, hızlı miktar butonları
- **Paylaşılabilir link:** Çevirici durumu URL'de tutulur (`?amount=250&from=EUR&to=TRY`)
- **Kur tablosu:** Seçilen ana para birimine göre kurlar, günlük % değişim, 2 haftalık mini grafikler, arama ve favoriler
- **Geçmiş grafiği:** 1 hafta – 10 yıl aralığı, değişim / en düşük / en yüksek / ortalama
- **Kur alarmları:** "USD/TRY 52'nin üstüne çıkarsa" gibi hedefler; tarayıcıda saklanır
- **Karanlık / aydınlık tema**, mobil uyumlu arayüz, skeleton yükleme durumları
- Veritabanı ve API key yok: tercihler `localStorage`'da tutulur

## Teknolojiler

| Alan | Kullanılan |
|---|---|
| Arayüz | React 19, TypeScript, Vite |
| Stil | Tailwind CSS v4 |
| Sunucu durumu | TanStack Query (önbellek, iptal, `keepPreviousData`) |
| İstemci durumu | Zustand + `persist` |
| Grafik | Recharts (lazy-load ile ayrı chunk) |
| Veri | [Frankfurter API](https://frankfurter.dev) (ECB) |

## Proje yapısı

```
src/
├─ components/   Converter, RatesBoard, HistoryChart, Alerts, CurrencySelect, Sparkline
├─ lib/          api.ts (API istemcisi), queries.ts (React Query hook'ları),
│                format.ts, currency.ts, useUrlState.ts
├─ store.ts      Tema, favoriler, alarmlar (kalıcı)
└─ App.tsx
```

## Kurulum

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # üretim derlemesi
```

## Notlar

Kurlar ECB tarafından iş günlerinde ~16:00 CET'te güncellenir; anlık piyasa fiyatı değildir. Yatırım tavsiyesi değildir.

---

Geliştiren: [Enes Civelek](https://enescivelek.com)
