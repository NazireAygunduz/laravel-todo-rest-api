<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\TaskAssignmentController;
use App\Http\Controllers\NotificationController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Todo API çalışıyor',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Token gerektiren authentication işlemleri
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/account', [AuthController::class, 'destroy']);

    // Token gerektiren Todo işlemleri
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::patch('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);

    Route::get('/lists',[TaskListController::class,'index']);
    Route::post('/lists',[TaskListController::class,'store']);

    Route::get('/lists/{id}',[TaskListController::class,'show']);
    Route::patch('/lists/{id}',[TaskListController::class,'update']);
    Route::delete('/lists/{id}', [TaskListController::class,'destroy']);

    Route::get('/lists/{id}/todos',[TaskListController::class,'todos']);

    Route::post('/todos/{todoId}/assignments', [TaskAssignmentController::class, 'store']);
    Route::get('/assignments/incoming', [TaskAssignmentController::class, 'incoming']);
    Route::patch('/assignments/{id}/accept', [TaskAssignmentController::class, 'accept']);
    Route::patch('/assignments/{id}/reject',[TaskAssignmentController::class,'reject']);

    Route::get('/notifications',[NotificationController::class,'index']);
});