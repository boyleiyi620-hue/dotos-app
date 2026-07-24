# Firebase Kurulum Rehberi (SADECE DATABASE)

Bu sistemde **Firebase Authentication (Gmail/E-posta)** ayarı yapmanıza gerek yoktur. Sadece **Realtime Database** kurallarını yapıştırmanız yeterlidir.

---

## ADIM 1 — Firebase Projesi Oluştur

1. [https://console.firebase.google.com](https://console.firebase.google.com) adresine git.
2. **"Add project"** butonuna tıkla, adını yaz ve oluştur.

---

## ADIM 2 — Realtime Database Oluştur

1. Sol menüden **Build → Realtime Database** seç.
2. **"Create Database"** butonuna tıkla.
3. Bölgeyi seç (örn: Europe-west1) → **Enable**.

---

## ADIM 3 — Kuralları (Rules) Ayarla (EN ÖNEMLİ ADIM)

1. Database içinde üstteki **Rules** sekmesine tıkla.
2. Mevcut her şeyi sil ve aşağıdaki kodu **aynen yapıştır**, sonra **Publish** butonuna bas:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
*(Not: Bu kural veritabanını herkese açık yapar, şuanlık en kolay yöntem budur.)*

---

## ADIM 4 — Config Değerlerini Uygulamaya Ekle

1. Sol üstteki **Proje Ayarları** (dişli simgesi) → **Project settings**'e git.
2. Sayfanın en altında **"Your apps"** kısmında **`</>`** (Web) simgesine tıkla.
3. Bir ad ver ve kaydet. Karşına şöyle bir kod çıkacak:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "proje-id.firebaseapp.com",
  databaseURL: "https://proje-id-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proje-id",
  storageBucket: "proje-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

4. Bu kodun içindeki değerleri `index.html` dosyasının en başındaki `const firebaseConfig = { ... }` kısmına kopyala-yapıştır yap.

---

## "Gerçek Değeri Yaz" Dediğim Yerler Ne Demek?

Firebase sana yukarıdaki gibi bir liste verir. Senin yapman gereken:

- Firebase'deki `apiKey` değerini al, uygulamadaki `apiKey` tırnaklarının içine yapıştır.
- Firebase'deki `databaseURL` değerini al, uygulamadaki `databaseURL` tırnaklarının içine yapıştır.
- Diğerlerini de (`projectId`, `appId` vb.) aynı şekilde eşleştir.

Bu kadar! Artık arkadaş ekleme ve anlık veri paylaşımı çalışacaktır.
