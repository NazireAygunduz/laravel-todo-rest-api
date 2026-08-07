<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskAssignment extends Model
{
    protected $fillable =[
        'todo_id',
        'user_id',
        'assigned_by_user_id',
        'status',
        'rejection_note',
        'responded_at',
    ];

    protected function cats(): array{
        return [
            'responded_at'=> 'datetime',
        ];
    }

    public function todo(): BelongsTo{
        return $this->belongsTo(Todo::class);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function assignedBy(): BelongsTo{
        return $this->belongsTo(User::class,'assigned_by_user_id');
    }


}
