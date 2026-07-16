<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    //postmandan gelen verilerden hangilerinin database'e 
    // yazılmasına izin verildigi belirtilir
    protected $fillable = [
        'title',
        'description',
        'is_completed',
    ];

    //iscompleted degerini 1/0 olarak gormek istemiyoruz
    //bu yuzden booleana cast ediyoruz
    protected function casts(): array{
        return [
            'is_completed' => 'boolean',
        ];
    }
}
