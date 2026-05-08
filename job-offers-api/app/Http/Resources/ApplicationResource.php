<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'status'       => $this->status,
            'cover_letter' => $this->cover_letter,
            'resume_url'   => $this->resume_url,
            'applicant'    => new UserResource($this->whenLoaded('user')),
            'job'          => new JobOfferResource($this->whenLoaded('jobOffer')),
            'created_at'   => $this->created_at?->toDateTimeString(),
            'updated_at'   => $this->updated_at?->toDateTimeString(),
        ];
    }
}