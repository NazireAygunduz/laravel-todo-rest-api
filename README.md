# Laravel + React Todo List

Bu proje, **Laravel REST API**, **React**, **TypeScript** ve **SQLite** kullanılarak geliştirilmiş full-stack bir Todo List uygulamasıdır.

Proje ilk aşamada kullanıcı arayüzü bulunmadan hazırlanmış ve CRUD işlemleri Postman üzerinden test edilmiştir. Daha sonra React ile bir kullanıcı arayüzü geliştirilerek Laravel API ile bağlantı kurulmuştur.

Uygulamada oluşturulan görevler yalnızca tarayıcıda tutulmaz. React arayüzünden gönderilen HTTP istekleri Laravel tarafından işlenir ve görevler SQLite veritabanına kaydedilir. Bu nedenle sayfa yenilendiğinde veriler kaybolmaz.

## Uygulama Özellikleri

* Yeni görev oluşturma
* Kayıtlı görevleri listeleme
* Görev başlığını ve açıklamasını düzenleme
* Görevleri tamamlandı olarak işaretleme
* Tamamlanan görevleri geri alma
* Görev silme
* Başlık ve açıklama alanlarını zorunlu tutma
* Verileri SQLite veritabanında kalıcı olarak saklama
* Laravel validation işlemleri
* Postman ile olumlu ve olumsuz API testleri
* Mobil cihazlara uyumlu React arayüzü

## Kullanılan Teknolojiler

### Backend

* PHP
* Laravel
* Laravel REST API
* SQLite
* Laravel Herd

### Frontend

* React
* TypeScript
* Vite
* CSS
* Fetch API

### Test ve Sürüm Kontrolü

* Postman
* Git
* GitHub
* JSON

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

Kullanıcı React arayüzünde bir işlem yaptığında `fetch` kullanılarak Laravel API'ye HTTP isteği gönderilir.

Örneğin yeni bir görev eklendiğinde:

```text
React formu
   ↓ POST /api/todos
Laravel REST API
   ↓
TodoController
   ↓
SQLite veritabanı
   ↓
Oluşturulan görev JSON olarak React'e gönderilir
   ↓
React görev listesini günceller
```

Bir görev düzenlendiğinde ise React tarafından ilgili görevin ID değeri kullanılarak `PATCH` isteği gönderilir:

```text
Düzenle butonu
   ↓
Görev bilgileri düzenleme alanlarına aktarılır
   ↓
PATCH /api/todos/{id}
   ↓
Laravel validation kontrolü
   ↓
SQLite veritabanındaki görev güncellenir
   ↓
Güncellenen görev React'e JSON olarak gönderilir
```

## CRUD İşlemleri

| CRUD   | Uygulamadaki işlem                                                | HTTP metodu |
| ------ | ----------------------------------------------------------------- | ----------- |
| Create | Yeni görev oluşturma                                              | POST        |
| Read   | Görevleri listeleme ve tek görevi görüntüleme                     | GET         |
| Update | Görev başlığını, açıklamasını veya tamamlanma durumunu güncelleme | PATCH       |
| Delete | Görev silme                                                       | DELETE      |

## API Endpointleri

| Metot  | Endpoint          | Açıklama                                                         |
| ------ | ----------------- | ---------------------------------------------------------------- |
| GET    | `/api/test`       | API'nin çalışıp çalışmadığını kontrol eder                       |
| GET    | `/api/todos`      | Bütün görevleri listeler                                         |
| POST   | `/api/todos`      | Yeni görev oluşturur                                             |
| GET    | `/api/todos/{id}` | ID değerine göre tek bir görevi getirir                          |
| PATCH  | `/api/todos/{id}` | Görev başlığını, açıklamasını veya tamamlanma durumunu günceller |
| DELETE | `/api/todos/{id}` | Görevi siler                                                     |

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

Yeni görev oluşturma işlemi başarılı olduğunda API, `201 Created` durum kodu döndürür.

## Örnek Görev Güncelleme İsteği

Bir görevin başlığını ve açıklamasını güncellemek için:

```http
PATCH /api/todos/1
Content-Type: application/json
Accept: application/json
```

```json
{
  "title": "Laravel Todo projesini geliştir",
  "description": "Görev düzenleme özelliğini React arayüzüne ekle"
}
```

Başarılı cevap örneği:

```json
{
  "message": "Todo başarıyla güncellendi!",
  "data": {
    "id": 1,
    "title": "Laravel Todo projesini geliştir",
    "description": "Görev düzenleme özelliğini React arayüzüne ekle",
    "is_completed": false
  }
}
```

## Görev Tamamlanma Durumunu Güncelleme

Bir görevi tamamlandı olarak işaretlemek için:

```http
PATCH /api/todos/1
Content-Type: application/json
Accept: application/json
```

```json
{
  "title": "Laravel Todo projesini geliştir",
  "description": "Görev düzenleme özelliğini React arayüzüne ekle",
  "is_completed": true
}
```

Tamamlanan bir görevi geri almak için `is_completed` değeri `false` olarak gönderilir.

## Veritabanı Yapısı

Görevler SQLite veritabanındaki `todos` tablosunda tutulmaktadır.

| Alan           | Açıklama                       |
| -------------- | ------------------------------ |
| `id`           | Görevin benzersiz numarası     |
| `title`        | Görev başlığı                  |
| `description`  | Görev açıklaması               |
| `is_completed` | Görevin tamamlanma durumu      |
| `created_at`   | Görevin oluşturulma tarihi     |
| `updated_at`   | Görevin son güncellenme tarihi |

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

## Laravel Backend Kurulumu

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

Laravel backend uygulamasını çalıştırın:

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

API'nin çalışıp çalışmadığını kontrol etmek için:

```text
http://127.0.0.1:8000/api/test
```

veya Laravel Herd kullanılıyorsa:

```text
http://todo-list-api.test/api/test
```

## React Frontend Kurulumu

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

## Görev Düzenleme İşlemi

React arayüzünde her görev kartında bir `Düzenle` butonu bulunur.

Kullanıcı bu butona bastığında:

1. Görevin mevcut başlığı ve açıklaması düzenleme alanlarına aktarılır.
2. Kullanıcı görev bilgilerini değiştirir.
3. `Kaydet` butonuna basıldığında React, Laravel API'ye `PATCH` isteği gönderir.
4. Laravel gelen verileri validation kurallarına göre kontrol eder.
5. Bilgiler doğruysa görev SQLite veritabanında güncellenir.
6. Güncellenmiş görev React arayüzünde gösterilir.

Kullanıcı `İptal` butonuna basarsa yapılan değişiklikler kaydedilmeden düzenleme modu kapatılır.

## Validation Kuralları

Yeni görev oluşturulurken ve görev bilgileri güncellenirken aşağıdaki validation kuralları uygulanır:

### `title`

* Zorunludur.
* Boş bırakılamaz.
* Metin türünde olmalıdır.
* En fazla 255 karakter olabilir.

### `description`

* Zorunludur.
* Boş bırakılamaz.
* Metin türünde olmalıdır.
* En fazla 1000 karakter olabilir.

### `is_completed`

* Gönderilmesi zorunlu değildir.
* Gönderildiğinde boolean türünde olmalıdır.
* Yalnızca `true` veya `false` değeri alabilir.

Validation kurallarına uygun olmayan bir istek gönderildiğinde Laravel `422 Unprocessable Entity` durum kodu döndürür.

Örneğin açıklaması boş olan bir istek:

```json
{
  "title": "Laravel çalış",
  "description": ""
}
```

Bu istek kabul edilmez ve aşağıdakine benzer bir cevap döndürülür:

```json
{
  "message": "The description field is required.",
  "errors": {
    "description": [
      "The description field is required."
    ]
  }
}
```

## Postman Testleri

API endpointleri Postman üzerinden olumlu ve olumsuz senaryolarla test edilmiştir.

Hazırlanan testlerden bazıları:

* Yeni görev oluşturma testi
* Bütün görevleri listeleme testi
* ID ile tek görev getirme testi
* Görev başlığını ve açıklamasını güncelleme testi
* Görevi tamamlandı olarak işaretleme testi
* Tamamlanan görevi geri alma testi
* Görev silme testi
* Silinen görev için `404` kontrolü
* Başlıksız görev oluşturma testi
* Açıklamasız görev oluşturma testi
* Boş açıklama ile görev oluşturma testi
* Geçersiz `is_completed` değeri testi
* JSON cevap yapısı kontrolü
* HTTP durum kodu kontrolü

Postman Collection ve Environment dosyaları `postman` klasöründe bulunmaktadır.

## HTTP Durum Kodları

|   Kod | Açıklama                                               |
| ----: | ------------------------------------------------------ |
| `200` | Listeleme, görüntüleme veya güncelleme işlemi başarılı |
| `201` | Yeni görev başarıyla oluşturuldu                       |
| `204` | Görev başarıyla silindi                                |
| `404` | İstenen görev bulunamadı                               |
| `422` | Gönderilen veri validation kurallarına uygun değil     |
| `500` | Sunucu tarafında beklenmeyen bir hata oluştu           |

## Frontend ve Backend İletişimi

React ile Laravel arasındaki iletişim `Fetch API` kullanılarak sağlanır.

React tarafından kullanılan temel HTTP istekleri:

```text
GET    /api/todos
POST   /api/todos
GET    /api/todos/{id}
PATCH  /api/todos/{id}
DELETE /api/todos/{id}
```

React arayüzü doğrudan veritabanına erişmez. Bütün veritabanı işlemleri Laravel REST API üzerinden gerçekleştirilir.

Bu yapı sayesinde frontend ve backend birbirinden bağımsız şekilde geliştirilebilir.

## Projenin Kazandırdıkları

Bu proje kapsamında aşağıdaki konular uygulamalı olarak çalışılmıştır:

* Laravel ile REST API geliştirme
* Route, controller ve model kullanımı
* SQLite veritabanı işlemleri
* Migration oluşturma
* Laravel validation kuralları
* CRUD işlemleri
* HTTP metotlarını kullanma
* HTTP durum kodlarını öğrenme
* JSON veri gönderme ve alma
* Postman ile olumlu ve olumsuz API testleri hazırlama
* React state yönetimi
* TypeScript veri tipleri
* React form yönetimi
* React ile Laravel API bağlantısı
* Fetch API kullanımı
* Görev ekleme, düzenleme, tamamlama ve silme işlemleri
* Git ve GitHub ile sürüm kontrolü

## Sonuç

Bu projede Laravel ile geliştirilen REST API, React ve TypeScript ile hazırlanan kullanıcı arayüzüne bağlanmıştır.

Kullanıcı arayüzünden yapılan görev ekleme, listeleme, düzenleme, tamamlama, geri alma ve silme işlemleri Laravel API üzerinden gerçekleştirilir. Görevler SQLite veritabanında kalıcı olarak saklanır.

Başlık ve açıklama alanları zorunlu hale getirilerek boş görev bilgilerinin veritabanına kaydedilmesi engellenmiştir. Laravel validation kuralları sayesinde hatalı istekler kontrol edilmekte ve uygun HTTP durum kodlarıyla cevaplandırılmaktadır.

Böylece frontend, backend, veritabanı, validation, API ve test süreçlerini bir arada içeren çalışan bir full-stack Todo List uygulaması oluşturulmuştur.
