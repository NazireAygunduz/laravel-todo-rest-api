<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Todo extends Model
{
    //postmandan gelen verilerden hangilerinin database'e 
    // yazılmasına izin verildigi belirtilir
    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'list_id',
        'due_date',
    ];

    public function user(): BelongsTo{
    //her todo kaydının bağlı olduğu kullanıcıyı temsil eder
    return $this->belongsTo(User::class);
    }

    public function taskList():BelongsTo{
        //todo-->list_id-->tasklist
        return $this->belongsTo(TaskList::class,'list_id');
    }

    //iscompleted degerini 1/0 olarak gormek istemiyoruz
    //bu yuzden booleana cast ediyoruz
    protected function casts(): array{
        return [
            'is_completed' => 'boolean',
            'due_date' => 'date',
            //ilerde termin tarihini nesne olarak kullanılabilir
        ];
    }


    public function assignments(): HasMany{
    return $this->hasMany(TaskAssignment::class);
    }
}
