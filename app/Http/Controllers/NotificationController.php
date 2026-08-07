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
}