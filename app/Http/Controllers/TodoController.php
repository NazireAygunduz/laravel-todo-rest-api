<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $todos = $request->user()
            ->todos()
            ->latest()//en yeni gorevleri once sırala
            ->get();//veritabanından getir

        return response()->json([
            'data' => $todos,
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required','string','max:255',],
            'description' => [ 'required', 'string', 'max:1000',],
            'is_completed' => ['sometimes','boolean', ],
        ]);

        $todo = $request->user() ->todos() ->create($validated);

        return response()->json([
            'message' => 'Todo oluşturuldu.',
            'data' => $todo,
        ], 201);
    }

    public function show(Request $request, string $id ): JsonResponse {
        $todo = $request->user() ->todos() ->findOrFail($id);

        return response()->json([
            'data' => $todo,
        ], 200);
    }

    public function update(Request $request, string $id): JsonResponse {
        $validated = $request->validate([
            'title' => [ 'sometimes', 'required','string','max:255',],
            'description' => ['sometimes','required','string','max:1000',],
            'is_completed' => ['sometimes','boolean',],
        ]);

        $todo = $request->user()->todos()->findOrFail($id);

        $todo->update($validated);

        return response()->json([
            'message' => 'Todo başarıyla güncellendi.',
            'data' => $todo,
        ], 200);
    }

    public function destroy( Request $request, string $id ): JsonResponse {
        $todo = $request->user()->todos()->findOrFail($id);

        $todo->delete();

        return response()->json(null, 204);
    }
}