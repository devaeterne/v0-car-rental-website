# X Royal — Birden fazla yönetici hesabı

## Tasarım
- Kullanıcı kendi **e-postası + şifresi** ile Supabase Auth üzerinden giriş yapar.
- Müşteri yönetici kullanıcı adı: **`xroyal`** → Supabase Auth `xroyalszr@gmail.com` hesabına eşlenir (şifre mevcut Supabase şifresidir).\n- Eskiden kullanılan `admin` kısa adı da desteklenir: `XROYAL_ADMIN_USERNAME=admin` ve `XROYAL_ADMIN_EMAIL=info@dasoft.me`.
- `XROYAL_ADMIN_EMAIL` **tek yönetici kısıtlaması değildir**: yalnızca kısa adın hangi hesaba ait olduğunu belirtir.
- Herhangi bir e-posta yalnızca `auth.users` içinde bulunması ve `public.admin_users` tablosunda **o kullanıcının UUID'si** yer alması halinde admin panelini açabilir.
- Client tarafında service_role/secret key kesinlikle kullanmayın.
- Tüm `admin_users` üyeleri V1'de aynı yetkilere sahiptir: araçlar, fotoğraflar, sayfalar ve şirket bilgileri. Farklı roller/izinler bu sürümde yoktur.

## Müşteriye admin hesabı verme (manuel, güvenli)
1. **Yalnızca XROYALPROJECT** dashboard'unu açın (`mfsszpjbuikwbzwpwchp`).
2. Authentication → Users → Add user → **Create new user** seçin. Müşterinin kendi e-postasını girin, güçlü tek kullanımlık başlangıç şifresi oluşturun. Müşteriye şifreyi güvenli bir kanaldan iletin; kodda veya sohbet geçmişinde tutmayın. E-posta doğrulama durumunu kontrol edin.
3. Supabase SQL Editor'da aşağıdaki SQL'de `customer@example.com` yerine müşterinin e-posta adresini yazın. Bu işlem yalnızca zaten mevcut bir Auth kullanıcıyı admin olarak ekler:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('customer@example.com')
on conflict (user_id) do nothing;

select u.email, a.user_id is not null as is_admin
from auth.users u
left join public.admin_users a on a.user_id = u.id
where lower(u.email) = lower('customer@example.com');
```
4. Müşteri `https://xroyalrentacar.me/admin/login` ekranından **`xroyal` + kendi şifresi** ile (veya e-posta + şifresiyle) giriş yapar.
5. Giriş yapılamazsa önce doğru XROYALPROJECT URL/publishable anahtar ve son uygulama deployment'ının yeni kodu içerdiğini doğrulayın.

**Güvenlik notu:** Supabase Dashboard'da kullanıcı oluşturulan başlangıç şifresi mümkün olan ilk fırsatta müşteriye ait benzersiz şifreyle değiştirilmelidir. Bunu otomatik zorlayan ekran henüz eklenmedi. Müşteriye hazır bir şifreyi e-posta veya açık sohbet üzerinden göndermeyin.

## İsteğe bağlı e-posta daveti
Supabase Authentication → Users → Add user → **Send invitation** akışı kullanılabilir. Ancak dış müşteriye e-posta göndermek için üretim ortamında **Custom SMTP** gerekir. Ayrıca bu projede davet linkini karşılayıp müşterinin şifre oluşturmasını sağlayan özel onboarding sayfası henüz bulunmuyor. Bu akışı ancak tamamladıktan ve test ettikten sonra kullanın.

## Kullanıcının yetkisini kaldırma

```sql
delete from public.admin_users
where user_id = (
  select id from auth.users
  where lower(email) = lower('customer@example.com')
);
```

Yalnızca üyelik kaldırılır; Auth hesabı otomatik silinmez. Mevcut oturumlar için yeni admin sorguları artık RLS ile reddedilir. Gerektiğinde Auth oturumlarını ayrıca iptal edin.

## Test
```bash
npm run test:admin-auth
npm run test:cms
npx tsc --noEmit
npm run build
```
- `admin` + teknik şifre: beklenen giriş.
- Teknik e-posta + teknik şifre: beklenen giriş.
- Müşteri `xroyal` veya kendi e-postası + kendi şifre + `admin_users` üyeliği: beklenen giriş.
- Üyeliği olmayan Auth kullanıcısı: reddedilmeli.
- Şifresi yanlış kullanıcı: reddedilmeli.
- Yönetici olmayan kullanıcının araç/ayar yazma sorguları: RLS reddetmeli.

## Yayın
Önce fork içindeki branch test edilir. Yalnızca `main` birleştirmesi ve orijinal repository güncellemesi sonrasında production'da çalışır.
