# Firebase Kurulum Rehberi (Yeni Sistem)

> **Gmail gerekmez.** Kullanıcılar sadece **görünen ad + şifre** ile kayıt olur ve giriş yapar.  
> Arkadaş sistemi **istek gönder → kabul et** şeklinde çalışır. Kabul edilince anlık olarak arkadaş eklenir.

---

## ADIM 1 — Firebase Projesi Oluştur

1. [https://console.firebase.google.com](https://console.firebase.google.com) adresine git
2. **"Add project"** (Proje ekle) butonuna tıkla
3. Proje adını yaz (örn: `dostos-app`) → Devam et → Oluştur

---

## ADIM 2 — Authentication Ayarla

1. Sol menüden **Build → Authentication** seç
2. **"Get started"** butonuna tıkla
3. **Sign-in method** sekmesine geç
4. **Email/Password** satırına tıkla
5. **Enable** (Etkinleştir) aç → **Kaydet**

> **Not:** Kullanıcılar gerçek e-posta girmez. Uygulama, görünen adı otomatik olarak  
> `adınız@dostos.app` formatına çevirir. Bu tamamen arka planda olur, kullanıcı görmez.

---

## ADIM 3 — Realtime Database Oluştur

1. Sol menüden **Build → Realtime Database** seç
2. **"Create Database"** butonuna tıkla
3. Bölge seç: **Europe-west1** (Avrupa) veya istediğin bölge
4. Güvenlik kuralları için **"Start in test mode"** seç (sonra değiştireceğiz) → **Enable**

---

## ADIM 4 — Firebase Config Kodunu Al

1. Sol üstte **Project Overview** (dişli simgesi yanı) → **Project settings**
2. Aşağı kaydır → **"Your apps"** bölümü → **`</>`** (Web) ikonuna tıkla
3. Uygulama adı yaz (örn: `dostos-web`) → **Register app**
4. Aşağıdaki gibi bir kod göreceksin:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "dostos-app.firebaseapp.com",
  databaseURL: "https://dostos-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dostos-app",
  storageBucket: "dostos-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. `index.html` dosyasını aç, en üstte şu kısmı bul:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  ...
};
```

6. **Tüm bu bloğu** Firebase'den kopyaladığın gerçek değerlerle değiştir.

---

## ADIM 5 — Database Güvenlik Kurallarını Ayarla

1. **Realtime Database** → **Rules** sekmesine git
2. Mevcut kuralları **tamamen sil**
3. Aşağıdaki kuralları **kopyala → yapıştır → Publish** (Yayınla) butonuna bas:

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },

    "slugs": {
      "$slug": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },

    "friendCodes": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() ? newData.child('uid').val() === auth.uid : data.child('uid').val() === auth.uid)",
        ".validate": "!newData.exists() || (newData.hasChildren(['uid', 'displayName', 'code']) && newData.child('uid').val() === auth.uid && newData.child('code').val() === $code && newData.child('displayName').isString() && newData.child('displayName').val().length <= 80)"
      }
    },

    "friendRequests": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".read": "auth != null && (auth.uid === $toUid || auth.uid === $fromUid)",
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "!newData.exists() || (newData.hasChildren(['fromUid', 'fromName', 'fromCode', 'status', 'sentAt']) && newData.child('fromUid').val() === $fromUid && newData.child('status').isString() && newData.child('fromName').isString() && newData.child('fromName').val().length <= 80)"
        }
      }
    },

    "friendships": {
      "$ownerUid": {
        ".read": "auth != null && auth.uid === $ownerUid",
        "$friendUid": {
          ".write": "auth != null && (auth.uid === $ownerUid || auth.uid === $friendUid)",
          ".validate": "!newData.exists() || (newData.hasChildren(['uid', 'displayName', 'friendCode', 'addedAt']) && newData.child('uid').val() === $friendUid && newData.child('displayName').isString() && newData.child('displayName').val().length <= 80 && newData.child('friendCode').isString() && newData.child('addedAt').isNumber())"
        }
      }
    },

    "data": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('friendships').child(auth.uid).child($uid).exists())",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

## ADIM 6 — Test Et

Uygulamayı iki farklı tarayıcıda (veya gizli sekmede) aç:

**Kullanıcı A (1. tarayıcı):**
1. **Hesap Oluştur** → Ad: `Ahmet`, Şifre: `1234` → Kayıt Ol
2. Sağ üstteki 👤+ butonuna tıkla → **Arkadaş Kodunu** kopyala

**Kullanıcı B (2. tarayıcı / gizli sekme):**
1. **Hesap Oluştur** → Ad: `Mehmet`, Şifre: `1234` → Kayıt Ol
2. 👤+ butonuna tıkla → Arama kutusuna `Ahmet` yaz → **Gönder** butonuna bas

**Kullanıcı A'ya dön:**
1. 👤+ butonunda kırmızı badge görünür (1 istek var)
2. Tıkla → **"Kabul"** butonuna bas
3. Mehmet arkadaş olarak eklenir ✅

**Anlık paylaşım:**
- Kullanıcı A bir şey eklediğinde (aktivite, borç, vs.) Kullanıcı B'nin **Keşfet → Arkadaşlardan Gelenler** bölümünde **anlık** görünür.

---

## Veritabanı Yapısı (Özet)

| Node | Ne İçeriyor |
|------|-------------|
| `users/{uid}` | Kullanıcı adı, slug, arkadaş kodu |
| `slugs/{slug}` | slug → uid eşleştirme (isimle arama için) |
| `friendCodes/{code}` | Arkadaş kodu → uid eşleştirme |
| `friendRequests/{toUid}/{fromUid}` | Bekleyen arkadaş istekleri |
| `friendships/{uid}/{friendUid}` | Onaylanmış arkadaşlıklar |
| `data/{uid}` | Kullanıcının tüm uygulama verisi |

---

## Sık Sorulan Sorular

**S: "Bu isim zaten alınmış" hatası alıyorum.**  
C: Aynı görünen adla başka biri kayıt olmuş. Biraz farklı bir ad dene (örn: `Ahmet K` veya `Ahmet123`).

**S: "Bu isimde kullanıcı bulunamadı" diyor.**  
C: Arkadaşının uygulamada kullandığı adı tam olarak yaz. Büyük/küçük harf fark etmez ama Türkçe karakterler (ş, ğ, ü vs.) fark yaratabilir. DOST-... kodunu kullanmak daha güvenilir.

**S: Arkadaş isteği gönderiyorum ama karşı taraf görmüyor.**  
C: Firebase kurallarının doğru girildiğinden emin ol (Adım 5). Özellikle `friendRequests` kuralının eksiksiz olması gerekiyor.
