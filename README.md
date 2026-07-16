# Laravel Todo REST API

Bu proje, Laravel kullanılarak geliştirilmiş frontend içermeyen bir Todo List REST API uygulamasıdır.

Todo oluşturma, listeleme, görüntüleme, güncelleme ve silme işlemleri Postman üzerinden gerçekleştirilmiştir. API için olumlu ve olumsuz otomatik test senaryoları hazırlanmıştır.

## Projenin Amacı

Bu projenin amacı:

- Laravel ile REST API geliştirmek
- CRUD işlemlerini uygulamak
- Frontend kullanmadan Postman ile API istekleri göndermek
- Validation işlemlerini test etmek
- API cevaplarını PASS/FAIL testleriyle doğrulamak
- API test prosedürlerini incelemek ve raporlamaktır

## Kullanılan Teknolojiler

- PHP
- Laravel
- SQLite
- Laravel Herd
- Postman
- Git ve GitHub
- JSON
- REST API

## Sistem Yapısı

```text
Postman
   ↓ HTTP isteği
Laravel Route
   ↓
TodoController
   ↓
Todo Model
   ↓
SQLite Veritabanı
   ↓
JSON cevap
```

## Veritabanı Yapısı

`todos` tablosunda aşağıdaki alanlar bulunmaktadır:

| Alan | Açıklama |
|---|---|
| `id` | Todo kaydının benzersiz numarası |
| `title` | Görevin başlığı |
| `description` | Görevin açıklaması |
| `is_completed` | Görevin tamamlanma durumu |
| `created_at` | Oluşturulma tarihi |
| `updated_at` | Güncellenme tarihi |

## API Endpointleri

| Metot | Endpoint | İşlem |
|---|---|---|
| POST | `/api/todos` | Yeni Todo oluşturur |
| GET | `/api/todos` | Bütün Todo kayıtlarını listeler |
| GET | `/api/todos/{id}` | Belirtilen Todo kaydını getirir |
| PATCH | `/api/todos/{id}` | Belirtilen Todo kaydını günceller |
| DELETE | `/api/todos/{id}` | Belirtilen Todo kaydını siler |

## Örnek Todo Oluşturma İsteği

```http
POST /api/todos
```

```json
{
  "title": "Laravel öğren",
  "description": "Todo REST API projesini tamamla",
  "is_completed": false
}
```

Başarılı cevap:

```json
{
  "message": "Todo oluşturuldu!",
  "data": {
    "id": 1,
    "title": "Laravel öğren",
    "description": "Todo REST API projesini tamamla",
    "is_completed": false
  }
}
```

Beklenen HTTP durum kodu:

```text
201 Created
```

## Kullanılan HTTP Durum Kodları

| Kod | Açıklama |
|---:|---|
| `200` | Listeleme, görüntüleme veya güncelleme başarılı |
| `201` | Yeni Todo başarıyla oluşturuldu |
| `204` | Todo başarıyla silindi |
| `404` | İstenen Todo bulunamadı |
| `422` | Gönderilen veri validation kurallarına uymadı |

## Validation Kuralları

- `title` alanı zorunludur
- `title` metin olmalıdır
- `title` en fazla 255 karakter olabilir
- `description` boş bırakılabilir
- `description` gönderilirse metin olmalıdır
- `is_completed` boolean, yani `true` veya `false` olmalıdır

## Postman Testleri

Projede aşağıdaki testler hazırlanmıştır:

- Todo oluşturma testi
- Todo listesini getirme testi
- Tek Todo getirme testi
- Todo güncelleme testi
- Todo silme testi
- Silinen Todo için 404 testi
- Başlıksız Todo oluşturma testi
- Geçersiz `is_completed` değeri testi
- JSON cevap kontrolü
- Durum kodu kontrolü
- ID ve veri alanlarının kontrolü

Postman testlerinin sonucunda beklenti doğruysa `PASSED`, yanlışsa `FAILED` sonucu gösterilir.

## Postman Dosyaları

Collection ve Environment dosyaları `postman` klasöründe bulunmaktadır:

```text
postman/
├── Todo List REST API.postman_collection.json
└── Todo-Local.postman_environment.json
```

Postman Collection içerisinde `base_url` ve `todo_id` değişkenleri kullanılmaktadır.

Yerel Herd adresi:

```text
http://todo-list-api.test/api
```

## Kurulum

Projeyi bilgisayara indirin:

```bash
git clone https://github.com/NazireAygunduz/laravel-todo-rest-api.git
cd laravel-todo-rest-api
```

Gerekli PHP paketlerini kurun:

```bash
composer install
```

`.env` dosyasını oluşturun:

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

Projeyi Laravel Herd ile veya aşağıdaki komutla çalıştırabilirsiniz:

```bash
php artisan serve
```

`php artisan serve` kullanıldığında Postman `base_url` değeri şu şekilde değiştirilmelidir:

```text
http://127.0.0.1:8000/api
```

## Proje Yapısı

```text
app/Models/Todo.php
app/Http/Controllers/TodoController.php
database/migrations/
routes/api.php
postman/
```

## Sonuç

Bu projede Laravel kullanılarak frontend içermeyen bir Todo List REST API geliştirilmiştir. CRUD işlemleri Postman üzerinden çalıştırılmış; olumlu ve olumsuz test senaryoları otomatik PASS/FAIL kontrolleriyle doğrulanmıştır.