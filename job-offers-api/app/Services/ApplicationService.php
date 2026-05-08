<?php

namespace App\Services;

use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\JobOffer;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApplicationService
{
    public function apply(array $data, int $userId): ApplicationResource|string
    {
        // Check for duplicate
        $exists = Application::where('user_id', $userId)
            ->where('job_offer_id', $data['job_offer_id'])
            ->exists();

        if ($exists) {
            return 'You have already applied to this job.';
        }

        $application = Application::create([
            'user_id'      => $userId,
            'job_offer_id' => $data['job_offer_id'],
            'cover_letter' => $data['cover_letter'] ?? null,
            'resume_url'   => $data['resume_url']   ?? null,
            'status'       => 'pending',
        ]);

        return new ApplicationResource(
            $application->load(['user', 'jobOffer.user']),
        );
    }

    public function myApplications(int $userId): AnonymousResourceCollection
    {
        $applications = Application::with(['jobOffer.user'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return ApplicationResource::collection($applications);
    }

    public function applicationsForJob(int $jobId, int $employerId): AnonymousResourceCollection|string
    {
        // Only the job owner can see applications
        $job = JobOffer::findOrFail($jobId);
        if ($job->user_id !== $employerId) {
            return 'You are not authorized to view these applications.';
        }

        $applications = Application::with(['user'])
            ->where('job_offer_id', $jobId)
            ->latest()
            ->get();

        return ApplicationResource::collection($applications);
    }

    public function hasApplied(int $userId, int $jobId): bool
    {
        return Application::where('user_id', $userId)
            ->where('job_offer_id', $jobId)
            ->exists();
    }
}