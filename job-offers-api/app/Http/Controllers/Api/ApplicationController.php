<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Applications\StoreApplicationRequest;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly ApplicationService $service
    ) {}

    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $result = $this->service->apply(
            $request->validated(),
            auth('api')->id(),
        );

        if (is_string($result)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $result,
            ], 409);
        }

        return response()->json([
            'success' => true,
            'data'    => $result,
            'message' => 'Application submitted successfully.',
        ], 201);
    }

    public function myApplications(): JsonResponse
    {
        $applications = $this->service->myApplications(auth('api')->id());

        return response()->json([
            'success' => true,
            'data'    => $applications,
            'message' => 'Applications retrieved successfully.',
        ]);
    }

    public function forJob(int $jobId): JsonResponse
    {
        $result = $this->service->applicationsForJob($jobId, auth('api')->id());

        if (is_string($result)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $result,
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $result,
            'message' => 'Applications retrieved successfully.',
        ]);
    }

    public function checkApplied(int $jobId): JsonResponse
    {
        $applied = $this->service->hasApplied(auth('api')->id(), $jobId);

        return response()->json([
            'success' => true,
            'data'    => ['applied' => $applied],
            'message' => 'Status retrieved.',
        ]);
    }
}