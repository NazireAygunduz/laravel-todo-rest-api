# Laravel + React Todo List

Bu proje, **Laravel REST API**, **React**, **TypeScript** ve **SQLite** kullanılarak geliştirilmiş full-stack bir Todo List uygulamasıdır.

Proje ilk aşamada kullanıcı arayüzü bulunmadan hazırlanmış ve CRUD işlemleri Postman üzerinden test edilmiştir. Daha sonra React ile bir kullanıcı arayüzü geliştirilerek Laravel API ile bağlantı kurulmuştur.

Uygulamada oluşturulan görevler yalnızca tarayıcıda tutulmaz. React arayüzünden gönderilen HTTP istekleri Laravel tarafından işlenir ve görevler SQLite veritabanına kaydedilir. Bu nedenle sayfa yenilendiğinde veriler kaybolmaz.

## Uygulama Özellikleri

- Yeni görev oluşturma
- Kayıtlı görevleri listeleme
- Görevleri tamamlandı olarak işaretleme
- Tamamlanan görevleri geri alma
- Görev silme
- Verileri SQLite veritabanında kalıcı olarak saklama
- Laravel validation işlemleri
- Postman ile olumlu ve olumsuz API testleri
- Mobil cihazlara uyumlu React arayüzü

## Kullanılan Teknolojiler

### Backend

- PHP
- Laravel
- Laravel REST API
- SQLite
- Laravel Herd

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API

### Test ve Sürüm Kontrolü

- Postman
- Git
- GitHub
- JSON

## Uygulamanın Çalışma Yapısı

```text
Kullanıcı
   ↓
React ve TypeScript arayüzü
   ↓ HTTP isteği
Laravel REST API
   ↓
TodoController
   ↓
Todo Model
   ↓
SQLite veritabanı
   ↓ JSON cevap
React arayüzü
```

Kullanıcı React arayüzünde bir işlem yaptığında `fetch` kullanılarak Laravel API'ye istek gönderilir.

Örneğin yeni bir görev eklendiğinde:

```text
React formu
   ↓ POST /api/todos
Laravel
   ↓
SQLite veritabanı
   ↓
Oluşturulan görev JSON olarak React'e gönderilir
```

## CRUD İşlemleri

| CRUD | Uygulamadaki işlem | HTTP metodu |
|---|---|---|
| Create | Yeni görev ekleme | POST |
| Read | Görevleri listeleme ve görüntüleme | GET |
| Update | Tamamla ve Geri Al işlemi | PATCH |
| Delete | Görev silme | DELETE |

## API Endpointleri

| Metot | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/test` | API'nin çalışıp çalışmadığını kontrol eder |
| GET | `/api/todos` | Bütün görevleri listeler |
| POST | `/api/todos` | Yeni görev oluşturur |
| GET | `/api/todos/{id}` | ID değerine göre tek bir görevi getirir |
| PATCH | `/api/todos/{id}` | Görev bilgilerini veya tamamlanma durumunu günceller |
| DELETE | `/api/todos/{id}` | Görevi siler |

## Örnek Görev Oluşturma İsteği

```http
POST /api/todos
Content-Type: application/json
Accept: application/json
```

```json
{
  "title": "Laravel projesini tamamla",
  "description": "React arayüzünü Laravel API'ye bağla",
  "is_completed": false
}
```

Başarılı cevap örneği:

```json
{
  "message": "Todo oluşturuldu!",
  "data": {
    "id": 1,
    "title": "Laravel projesini tamamla",
    "description": "React arayüzünü Laravel API'ye bağla",
    "is_completed": false
  }
}
```

## Veritabanı Yapısı

Görevler SQLite veritabanındaki `todos` tablosunda tutulmaktadır.

| Alan | Açıklama |
|---|---|
| `id` | Görevin benzersiz numarası |
| `title` | Görev başlığı |
| `description` | Görev açıklaması |
| `is_completed` | Görevin tamamlanma durumu |
| `created_at` | Görevin oluşturulma tarihi |
| `updated_at` | Görevin son güncellenme tarihi |

SQLite veritabanı dosyası Laravel projesinde aşağıdaki konumda bulunur:

```text
database/database.sqlite
```

## Proje Yapısı

```text
laravel-todo-rest-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── TodoController.php
│   └── Models/
│       └── Todo.php
├── database/
│   ├── database.sqlite
│   └── migrations/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── postman/
├── routes/
│   └── api.php
├── artisan
├── composer.json
└── README.md
```

## Kurulum

Projeyi bilgisayarınıza indirin:

```bash
git clone https://github.com/NazireAygunduz/laravel-todo-rest-api.git
cd laravel-todo-rest-api
```

### Laravel Backend Kurulumu

Gerekli PHP paketlerini yükleyin:

```bash
composer install
```

Laravel ortam dosyasını oluşturun:

```powershell
Copy-Item .env.example .env
```

Uygulama anahtarını oluşturun:

```bash
php artisan key:generate
```

SQLite veritabanı dosyasını oluşturun:

```powershell
New-Item database/database.sqlite -ItemType File
```

Migration işlemlerini çalıştırın:

```bash
php artisan migrate
```

Laravel backend'i çalıştırın:

```bash
php artisan serve
```

Bu komut kullanıldığında Laravel genellikle aşağıdaki adreste çalışır:

```text
http://127.0.0.1:8000
```

Laravel Herd kullanılıyorsa proje adresi şu şekilde olabilir:

```text
http://todo-list-api.test
```

### React Frontend Kurulumu

Yeni bir terminal açın ve frontend klasörüne girin:

```bash
cd frontend
```

Node.js paketlerini yükleyin:

```bash
npm install
```

Frontend ortam dosyasını oluşturun:

```powershell
Copy-Item .env.example .env
```

`php artisan serve` kullanılıyorsa `frontend/.env` dosyasının içeriği:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Laravel Herd kullanılıyorsa:

```env
VITE_API_URL=http://todo-list-api.test/api
```

React uygulamasını çalıştırın:

```bash
npm run dev
```

Terminalde gösterilen adresi tarayıcıda açın:

```text
http://localhost:5173
```

Port kullanımda ise Vite uygulamayı `5174` gibi farklı bir portta çalıştırabilir.

> React uygulaması VS Code Live Server ile çalıştırılmamalıdır. Frontend'i başlatmak için `npm run dev` komutu kullanılmalıdır.

## Postman Testleri

API endpointleri Postman üzerinden test edilmiştir.

Hazırlanan testlerden bazıları:

- Yeni görev oluşturma testi
- Bütün görevleri listeleme testi
- ID ile tek görev getirme testi
- Görev güncelleme testi
- Görev silme testi
- Silinen görev için `404` kontrolü
- Başlıksız görev oluşturma testi
- Geçersiz `is_completed` değeri testi
- JSON cevap yapısı kontrolü
- HTTP durum kodu kontrolü

Postman Collection ve Environment dosyaları `postman` klasöründe bulunmaktadır.

## HTTP Durum Kodları

| Kod | Açıklama |
|---:|---|
| `200` | Listeleme, görüntüleme veya güncelleme başarılı |
| `201` | Yeni görev başarıyla oluşturuldu |
| `204` | Görev başarıyla silindi |
| `404` | İstenen görev bulunamadı |
| `422` | Gönderilen veri validation kurallarına uygun değil |

## Validation Kuralları

- `title` alanı zorunludur.
- `title` metin türünde olmalıdır.
- `title` en fazla 255 karakter olabilir.
- `description` boş bırakılabilir.
- `description` gönderilirse metin türünde olmalıdır.
- `is_completed` değeri `true` veya `false` olmalıdır.

## Projenin Kazandırdıkları

Bu proje kapsamında:

- Laravel ile REST API geliştirme
- Route, controller ve model kullanımı
- SQLite veritabanı işlemleri
- Migration oluşturma
- Validation uygulama
- HTTP metotlarını kullanma
- JSON veri gönderme ve alma
- Postman ile API testi hazırlama
- React state yönetimi
- TypeScript veri tipleri
- React ile Laravel API bağlantısı
- Git ve GitHub ile sürüm kontrolü

konuları uygulamalı olarak çalışılmıştır.

## Sonuç

Bu projede Laravel ile geliştirilen REST API, React ve TypeScript ile hazırlanan kullanıcı arayüzüne bağlanmıştır. Kullanıcı arayüzünden yapılan görev ekleme, listeleme, tamamlama, geri alma ve silme işlemleri Laravel API üzerinden SQLite veritabanına aktarılmaktadır. Böylece frontend, backend, veritabanı ve API test süreçlerini bir arada içeren çalışan bir full-stack Todo List uygulaması oluşturulmuştur.