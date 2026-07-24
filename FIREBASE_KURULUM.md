# DostOS — Firebase Arkadaş Paylaşımı Kurulumu

Bu proje artık **Firebase Authentication** ve **Realtime Database** ile arkadaş kodu üzerinden karşılıklı bağlantı kurar. Bir kullanıcı arkadaşını ekledikten sonra diğer kullanıcının `data/<uid>` altında eklediği içerikler gerçek zamanlı olarak okunur ve **Keşfet → Arkadaşlardan Gelenler** bölümünde görünür. Arkadaş olmayan kullanıcılar bu veriyi okuyamaz.

> **Önemli:** `firebaseConfig` içindeki web uygulaması tanımlayıcıları gizli anahtar değildir. Veriyi koruyan katman, aşağıdaki Realtime Database güvenlik kurallarıdır. Kuralları "test mode" ile açık bırakmayın.

| Bileşen | Bu projedeki işlevi |
| --- | --- |
| Firebase Authentication | E-posta/şifre ile kayıt ve giriş |
| Realtime Database | Kullanıcı verileri, arkadaş kodları ve arkadaşlık bağlantıları |
| `friendCodes` | `DOST-...` kodundan kullanıcıyı bulmak için dizin |
| `friendships` | Karşılıklı arkadaş bağlantısı; veri okuma izni bununla sağlanır |
| `data` | Uygulamada eklenen tüm paylaşılan içerikler |

## 1. Firebase projesini oluştur

Firebase Console'da yeni bir proje açın. Ardından projeye **Web uygulaması** ekleyin. Uygulama kaydı tamamlandığında verilen yapılandırma nesnesini kopyalayın.

`index.html` dosyasındaki **FIREBASE CONFIGURATION** başlığının altındaki aşağıdaki alanı, Firebase Console'un verdiği değerlerle eksiksiz değiştirin:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

> `databaseURL` alanını örnekteki gibi elle tahmin etmeyin; Firebase Console'un verdiği **tam değeri** yapıştırın. Veritabanı bölgenize göre alan adı değişebilir.

## 2. E-posta/şifre girişini etkinleştir

Firebase Console'da **Authentication → Sign-in method** sayfasını açın. **Email/Password** sağlayıcısını etkinleştirip kaydedin. Firebase için varsayılan alt sınırla uyumlu olarak uygulamadaki Firebase hesaplarının parolası en az **6 karakter** olmalıdır. Uygulamada kayıt olan her kişi kendi Firebase kullanıcı kimliğiyle giriş yapar.

## 3. Realtime Database oluştur ve güvenlik kurallarını yayımla

Firebase Console'da **Realtime Database → Create Database** akışını tamamlayın. Üretim kuralı başlangıcını seçin. Ardından **Rules** sekmesine gidin; bu depodaki [`firebase-rules.json`](./firebase-rules.json) dosyasının tamamını kopyalayıp yapıştırın ve **Publish** düğmesine basın.

Bu kuralların davranışı şöyledir:

| İşlem | İzin |
| --- | --- |
| Kullanıcının kendi `users/<uid>` ve `data/<uid>` alanını okuması/yazması | İzinli |
| Arkadaşın `data/<uid>` alanını okuması | Yalnızca `friendships` bağlantısı varsa izinli |
| Arkadaş olmayan bir kullanıcının başka birinin verisini okuması | Reddedilir |
| Arkadaş kodu ile kullanıcı bulma | Giriş yapmış kullanıcılar için izinli |
| Arkadaşlık kaydını oluşturma veya kaldırma | Bağlantıdaki iki taraftan biri için izinli |

## 4. Uygulamayı yayımla

`index.html` ve `firebase-rules.json` dosyalarını GitHub Pages'i besleyen varsayılan dala gönderin. GitHub Pages sayfası güncellendikten sonra tarayıcıda önbelleği temizleyerek veya zorla yenileyerek uygulamayı açın.

## 5. İki hesapla dene

İki farklı e-posta ile hesap oluşturun. İlk hesapta üstteki arkadaş simgesini açın; uygulama size bir **DOST-...** arkadaş kodu verir. Bu kodu ikinci hesaba gönderin. İkinci hesap kodu ilgili alana yazıp **Arkadaş Ekle** dediğinde arkadaşlık iki taraf için oluşur.

Artık herhangi bir hesap aktivite, lig, meydan okuma, harcama, proje, albüm veya uygulamadaki başka bir içerik eklediğinde diğer kişinin uygulamasındaki **Keşfet → Arkadaşlardan Gelenler** bölümünde otomatik görünür. Mevcut Keşfet önerileri ayrıca Keşfet listesinin altındaki "Arkadaşların Önerileri" alanında da görünür.

## Liglere takım ekleme

Arena'da her ligin kartında artık **Takım Ekle** düğmesi bulunmaktadır. Düğme takım adı girişi, mevcut takımların listesi ve yinelenen takım adı kontrolü içerir. Takım eklendikten sonra aynı ligde maç ekleme ve puan durumu takibi kullanılabilir.

## Sorun giderme

| Belirti | Kontrol |
| --- | --- |
| Giriş veya kayıt olmuyor | Authentication içinde Email/Password'un etkin olduğundan emin olun. |
| `permission_denied` hatası | `firebase-rules.json` içeriğinin tamamını Realtime Database Rules sekmesinde yayımladığınızı doğrulayın. |
| Arkadaş kodu bulunamıyor | Kodun iki hesaptan da Firebase yapılandırmasından sonra oluşturulduğunu, boşluk içermediğini ve `DOST-` ile başladığını kontrol edin. |
| Arkadaşın yeni içeriği görünmüyor | İki hesabın da birbirini arkadaş olarak eklediğini, aynı Firebase projesini kullandığını ve sayfanın güncel sürümde olduğunu doğrulayın. |

## Kaynaklar

[1] [Firebase Web kurulumu](https://firebase.google.com/docs/web/setup)

[2] [Firebase Authentication — e-posta/şifre](https://firebase.google.com/docs/auth/web/password-auth)

[3] [Realtime Database güvenlik kuralları](https://firebase.google.com/docs/database/security)

[4] [Realtime Database kural koşulları](https://firebase.google.com/docs/database/security/rules-conditions)
