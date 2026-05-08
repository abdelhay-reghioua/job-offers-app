<?php

namespace App\Http\Requests\Applications;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->user()?->role === 'candidate';
    }

    public function rules(): array
    {
        return [
            'job_offer_id' => 'required|integer|exists:job_offers,id',
            'cover_letter' => 'nullable|string|max:5000',
            'resume_url'   => 'nullable|url',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'data'    => $validator->errors(),
            'message' => 'Validation failed.',
        ], 422));
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'data'    => null,
            'message' => 'Only candidates can apply to jobs.',
        ], 403));
    }
}