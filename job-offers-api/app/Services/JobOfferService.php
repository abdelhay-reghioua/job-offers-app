<?php

namespace App\Services;

use App\Http\Resources\JobOfferResource;
use App\Models\JobOffer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobOfferService
{
    public function listPaginated(array $filters = [], int $perPage = 15): AnonymousResourceCollection
    {
        $query = JobOffer::with('user')->where('is_active', true);

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->where('title',    'ilike', "%{$term}%")
                  ->orWhere('company', 'ilike', "%{$term}%")
                  ->orWhere('location','ilike', "%{$term}%");
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $paginator = $query->latest()->paginate($perPage);

        return JobOfferResource::collection($paginator);
    }

    public function find(int $id): JobOfferResource
    {
        $job = JobOffer::with('user')->findOrFail($id);
        return new JobOfferResource($job);
    }

    public function create(array $data, int $userId): JobOfferResource
    {
        $job = JobOffer::create([
            ...$data,
            'user_id'  => $userId,
            'currency' => $data['currency'] ?? 'USD',
        ]);

        return new JobOfferResource($job->load('user'));
    }

    public function myJobs(int $userId): AnonymousResourceCollection
    {
        $jobs = JobOffer::with('user')
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return JobOfferResource::collection($jobs);
    }
}