<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException; 

class AuthController extends Controller
{

public function register(Request $request): JsonResponse
{
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'confirmed',
                Password::min(8),
            ],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Kullanıcı başarıyla oluşturuldu.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

public function login(Request $request): JsonResponse
{
    $validated = $request->validate([
        'email' => [
            'required',
            'email',
        ],

        'password' => [
            'required',
            'string',
        ],
    ]);

    $user = User::where(
        'email',
        $validated['email']
    )->first();

    if (
        ! $user ||
        ! Hash::check(
            $validated['password'],
            $user->password
        )
    ) {
        throw ValidationException::withMessages([
            'email' => [
                'E-posta adresi veya şifre hatalı.',
            ],
        ]);
    }

    $token = $user
        ->createToken('auth-token')
        ->plainTextToken;

    return response()->json([
        'message' => 'Giriş başarılı.',
        'user' => $user,
        'token' => $token,
    ], 200);
}  

public function user(Request $request): JsonResponse
{
    return response()->json(['user' => $request->user(),
    ], 200);
}

public function logout(Request $request): JsonResponse
{
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Çıkış başarılı.',
    ], 200);
}

public function destroy(Request $request): JsonResponse
{
    $validated = $request->validate([
        'password' => ['required', 'string'],
    ]);

    $user = $request->user();

    if (! Hash::check($validated['password'], $user->password)) {
        throw ValidationException::withMessages([
            'password' => ['Girdiğiniz şifre hatalı.'],
        ]);
    }

    $user->tokens()->delete();
    $user->delete();

    return response()->json([
        'message' => 'Hesap ve hesaba ait görevler başarıyla silindi.',
    ], 200);
}

}