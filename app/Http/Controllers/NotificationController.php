<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get();

        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count(),
            //okunmamış bildirim sayısını döndürür
            'data' => $notifications,
        ], 200);
    }

    public function markAsRead(Request $request, string $id): JsonResponse{
    $notification = $request->user()->notifications()->findOrFail($id);
    $notification->markAsRead(); 
    return response()->json([
        'message' => 'Bildirim okundu olarak işaretlendi.',
    ], 200);
    }

    //tüm bildirimleri tek seferde okundu yapmak icin
    public function markAllAsRead(Request $request): JsonResponse{
    $request->user() ->unreadNotifications()->update(['read_at' => now(),]);
    return response()->json([
        'message' => 'Tüm bildirimler okundu olarak işaretlendi.',
    ], 200);
}
}