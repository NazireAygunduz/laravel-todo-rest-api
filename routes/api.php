<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Todo API çalışıyor'
    ]);
});

Route::get('/todos',[TodoController::class, 'index']); 
Route::post('/todos', [TodoController::class, 'store']); 
Route::get('/todos/{id}',[TodoController::class, 'show']);
Route::patch('/todos/{id}',[TodoController::class, 'update']);
Route::delete('/todos/{id}',[TodoController::class, 'destroy']);
