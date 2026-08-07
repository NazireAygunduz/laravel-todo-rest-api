<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskList extends Model
{
    protected $fillable =['name','description',];

    public function user(): BelongsTo{
        //her tasklist usera aittir
        return $this->belongsTo(User::class);
        //bu model app-model-usera bağlı
    }

    public function todos():HasMany{
        return $this->hasMany(Todo::class,'list_id');
    }
}
