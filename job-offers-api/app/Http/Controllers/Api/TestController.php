<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'version' => '1.0.0',
                'php'     => PHP_VERSION,
                'laravel' => app()->version(),
            ],
            'message' => 'Job Offers API is running.',
        ]);
    }
}