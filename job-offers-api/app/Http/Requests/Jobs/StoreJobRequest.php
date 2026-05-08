<?php

namespace App\Http\Requests\Jobs;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only employers can post jobs
        return auth('api')->user()?->role === 'employer';
    }

    public function rules(): array
    {
        return [
            'title'        => 'required|string|max:255',
            'company'      => 'required|string|max:255',
            'location'     => 'required|string|max:255',
            'type'         => 'required|in:full-time,part-time,contract,internship',
            'description'  => 'required|string|min:20',
            'requirements' => 'nullable|string',
            'salary_min'   => 'nullable|numeric|min:0',
            'salary_max'   => 'nullable|numeric|gte:salary_min',
            'currency'     => 'nullable|string|size:3',
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
            'message' => 'Only employers can post jobs.',
        ], 403));
    }
}