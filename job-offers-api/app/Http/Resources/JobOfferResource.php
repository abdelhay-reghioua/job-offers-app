<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'company'      => $this->company,
            'location'     => $this->location,
            'type'         => $this->type,
            'description'  => $this->description,
            'requirements' => $this->requirements,
            'salary_min'   => $this->salary_min,
            'salary_max'   => $this->salary_max,
            'currency'     => $this->currency,
            'is_active'    => $this->is_active,
            'posted_by'    => new UserResource($this->whenLoaded('user')),
            'created_at'   => $this->created_at?->toDateTimeString(),
            'updated_at'   => $this->updated_at?->toDateTimeString(),
        ];
    }
}