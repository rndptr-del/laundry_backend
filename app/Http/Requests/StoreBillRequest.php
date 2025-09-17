<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customerId' => 'required|string|exists:customers,id',
            'userId' => 'required|string|exists:users,id',
            'id' => 'sometimes|nullable|string',
            'billDetails' => 'required|array',
            'billDetails.*.id' => 'required|string',
            'billDetails.*.price' => 'required|integer|min:0',
            'billDetails.*.qty' => 'required|integer|min:1',
            'billDetails.*.createdAt' => 'required|date',
            'billDetails.*.updatedAt' => 'required|date',
            'billDetails.*.product.id' => 'required|string',
            'billDetails.*.product.name' => 'required|string',
            'billDetails.*.product.price' => 'required|integer|min:0',
            'billDetails.*.product.type' => 'required|string',
            'billDetails.*.product.createdAt' => 'required|date',
            'billDetails.*.product.updatedAt' => 'required|date',
        ];
    }
}