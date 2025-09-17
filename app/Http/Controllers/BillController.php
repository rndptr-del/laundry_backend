<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillRequest;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\Product; // Pastikan model Product diimpor
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Impor kelas Log

class BillController extends Controller
{
    public function store(StoreBillRequest $request)
    {
        try {
            // Kita gunakan database transaction untuk memastikan semua operasi berhasil
            DB::transaction(function () use ($request) {
                // Buat Bill baru
                $bill = Bill::create([
                    'id' => $request->input('id', uniqid()),
                    'customer_id' => $request->customerId,
                    'user_id' => $request->userId,
                ]);

                // Loop untuk membuat Bill Details dan Products
                foreach ($request->billDetails as $detail) {
                    // Masukkan atau update data produk
                    Product::upsert([
                        'id' => $detail['product']['id'],
                        'name' => $detail['product']['name'],
                        'price' => $detail['product']['price'],
                        'type' => $detail['product']['type'],
                        'created_at' => $detail['product']['createdAt'],
                        'updated_at' => $detail['product']['updatedAt'],
                    ], ['id']);

                    // Buat Bill Detail dan kaitkan dengan Bill yang baru dibuat
                    // Menggunakan relasi `billDetails()` lebih rapi dan aman
                    $bill->billDetails()->create([
                        'id' => $detail['id'],
                        'product_id' => $detail['product']['id'],
                        'qty' => $detail['qty'],
                        'price' => $detail['price'],
                        'created_at' => $detail['createdAt'],
                        'updated_at' => $detail['updatedAt'],
                    ]);
                }
            });

            // Jika semua operasi berhasil, kembalikan respons 201
            return response()->json(['message' => 'Bill created successfully'], 201);
        } catch (\Exception $e) {
            // Log pesan kesalahan yang spesifik
            Log::error('Error creating bill: ' . $e->getMessage());
            
            // Kembalikan respons yang sesuai dengan error, misalnya 500
            return response()->json(['message' => 'Failed to create bill', 'error' => $e->getMessage()], 500);
        }
    }
}