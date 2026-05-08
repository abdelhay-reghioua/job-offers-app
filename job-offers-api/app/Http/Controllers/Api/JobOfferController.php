<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Jobs\StoreJobRequest;
use App\Services\JobOfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    public function __construct(
        private readonly JobOfferService $jobService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'type']);
        $jobs    = $this->jobService->listPaginated($filters, 15);

        return response()->json([
            'success' => true,
            'data'    => $jobs,
            'message' => 'Jobs retrieved successfully.',
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $job = $this->jobService->find($id);

        return response()->json([
            'success' => true,
            'data'    => $job,
            'message' => 'Job retrieved successfully.',
        ]);
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $job = $this->jobService->create(
            $request->validated(),
            auth('api')->id(),
        );

        return response()->json([
            'success' => true,
            'data'    => $job,
            'message' => 'Job created successfully.',
        ], 201);
    }

    public function myJobs(): JsonResponse
    {
        $jobs = $this->jobService->myJobs(auth('api')->id());

        return response()->json([
            'success' => true,
            'data'    => $jobs,
            'message' => 'My jobs retrieved successfully.',
        ]);
    }
}