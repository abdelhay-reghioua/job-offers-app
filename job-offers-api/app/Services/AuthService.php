<?php

namespace App\Services;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
            'role'     => $data['role'] ?? 'candidate',
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'user'  => new UserResource($user),
            'token' => $token,
        ];
    }

    public function login(array $credentials): array|null
    {
        if (!$token = auth('api')->attempt($credentials)) {
            return null;
        }

        return [
            'user'  => new UserResource(auth('api')->user()),
            'token' => $token,
        ];
    }

    public function logout(): void
    {
        auth('api')->logout();
    }

    public function me(): UserResource
    {
        return new UserResource(auth('api')->user());
    }
}