# X Royal — Şirket & İçerik CMS (Admin V2)

## Kapsam
- `/admin/company`: marka, resmî ünvan (isteğe bağlı), vergi/kayıt numarası (isteğe bağlı), telefon, WhatsApp, e-posta, lokasyon, adres, çalışma saati, harita, sosyal bağlantılar ve footer açıklaması güncelleme.
- `/admin/pages`: sayfa listesi, oluşturma, görüntüleme, güncelleme, taslak/yayın, footer görünürlüğü, silme.
- Korunan yerleşik içerikler: `ana-sayfa` (`/`), `hakkimizda` (`/hakkimizda`), `iletisim` (`/iletisim`). Slug/sistem tipi değiştirilemez ve silinemez.
- Yeni sayfa adresi `/sayfa/<slug>`. Sadece yayınlanmış sayfalar herkese görünür; taslaklar 404.
- İçerik **düz metindir**; HTML/JS çalıştırılmaz. Paragraflar boş satırla ayrılır.
- Başlangıç metinleri ve iletişim bilgileri mevcut siteden alınır. Gerçek hukuki şirket bilgileri bilinmediğinden boş bırakılır.

## Migration
Hedef yalnızca XROYALPROJECT — `mfsszpjbuikwbzwpwchp`.
`scripts/004_xroyal_content_cms.sql` eklemeli migrasyondur: `site_settings`, `site_pages`, başlangıç kayıtları ve RLS. Mevcut `cars`, `car_images` verilerine dokunmaz.

## Güvenlik
Yazma işlemleri `requireAdmin()` ve Supabase RLS üzerinden korunur. Public `site_pages` sorguları yalnızca `published=true` getirir. Admin üyeliği `admin_users` tablosundadır. Şifre / service_role anahtarı yeni kodda kullanılmaz.

## Yerel kabul
```bash
git fetch origin
git pull --rebase origin feat/xroyal-admin-v1
node --test tests/cms-contract.test.mjs
npx tsc --noEmit
npm run lint
npm run build
npm run dev -- -p 3001
```

### Manuel test
1. `/admin/company` alanlarından yalnızca telefon/brand gibi bir değeri değiştir; `/iletisim` ve footer'da değişimi gözle; eski haline getir.
2. `/admin/pages` içinde Ana Sayfa / Hakkımızda / İletişim metinlerini incele; Hakkımızda giriş metnini değiştir ve sayfayı yenile.
3. Yeni özel sayfa oluştur: önce taslak durumda `/sayfa/slug` 404 olmalı; yayımlayınca 200; footer işareti açılınca footer bağlantısı görünmeli; ardından sil.
4. Oturum kapalıyken `/admin/company` ve `/admin/pages` girişe yönlenmeli.
5. Public anon kullanıcı yeni tabloya INSERT/UPDATE/DELETE yapamamalı; admin JWT ile yapabilmeli (gerçek JWT negatif kabul testi henüz ayrı).

## Yayın
Yalnızca `feat/xroyal-admin-v1` branch güncellenir. `main` ve Vercel üretim dağıtımı ayrıca yapılır.
