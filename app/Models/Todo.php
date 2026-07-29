<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    //postmandan gelen verilerden hangilerinin database'e 
    // yazılmasına izin verildigi belirtilir
    protected $fillable = [
        'title',
        'description',
        'is_completed',
    ];

    public function user(): BelongsTo{
    //her todo kaydının bağlı olduğu kullanıcıyı temsil eder
    return $this->belongsTo(User::class);
    }

    //iscompleted degerini 1/0 olarak gormek istemiyoruz
    //bu yuzden booleana cast ediyoruz
    protected function casts(): array{
        return [
            'is_completed' => 'boolean',
        ];
    }
}
