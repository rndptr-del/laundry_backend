<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillRequest;
use App\Models\Bill;
use App\Models\BillDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    /**
     * Tampilkan semua bills dengan relasi customer, billDetails, dan product.
     */
    public function index()
    {
        try {
            $bills = Bill::with(['customer', 'billDetails.product', 'user'])->get();

            return response()->json($bills, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching bills: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch bills',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simpan bill baru beserta detailnya.
     */
    public function store(StoreBillRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // Hitung total harga dari detail
                $total = 0;

                foreach ($request->billDetails as $detail) {
                    $total += $detail['qty'] * $detail['price'];
                }

                // Buat Bill baru
                $bill = Bill::create([
                    'id'           => $request->input('id', uniqid()),
                    'customer_id'  => $request->customerId,
                    'user_id'      => $request->userId,
                    'total_amount' => $total,
                    'paid_amount'  => 0,
                    'status'       => 'UNPAID', // default
                ]);

                // Loop untuk membuat Bill Details dan Products
                foreach ($request->billDetails as $detail) {
                    // Insert atau update produk
                    Product::upsert([[
                        'id'    => $detail['product']['id'],
                        'name'  => $detail['product']['name'],
                        'price' => $detail['product']['price'],
                        'type'  => $detail['product']['type'],
                    ]], ['id']);

                    // Buat Bill Detail
                    $bill->billDetails()->create([
                        'id'         => $detail['id'],
                        'product_id' => $detail['product']['id'],
                        'qty'        => $detail['qty'],
                        'price'      => $detail['price'],
                    ]);
                }
            });

            return response()->json(['message' => 'Bill created successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Error creating bill: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create bill',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Konfirmasi pembayaran bill.
     */
    public function confirmPayment(Request $request, $id)
{
    try {
        // Ambil bill lengkap dengan relasi
        $bill = Bill::with(['customer', 'billDetails.product', 'user'])->findOrFail($id);

        $paidAmount = $request->input('amount', 0);
        $bill->paid_amount += $paidAmount;

        // Update status
        if ($bill->paid_amount >= $bill->total_amount) {
            $bill->status = 'PAID';
            $bill->payment_date = now();
        } elseif ($bill->paid_amount > 0) {
            $bill->status = 'PARTIAL';
        }

        $bill->save();

        // Reload relasi setelah save supaya data fresh
        $bill->load(['customer', 'billDetails.product', 'user']);

        return response()->json([
            'message' => 'Payment confirmed',
            'bill'    => $bill
        ], 200);
    } catch (\Exception $e) {
        Log::error('Error confirming payment: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to confirm payment',
            'error'   => $e->getMessage()
        ], 500);
    }
}
}
