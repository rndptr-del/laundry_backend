<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bill extends Model
{
    use HasFactory;

    protected $table = 'bills';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'customer_id',
        'user_id',
        'total_amount',   // ✅ total pembayaran
        'paid_amount',    // ✅ jumlah dibayar
        'status',         // ✅ status: unpaid, partial, paid
        'payment_date',   // ✅ tanggal pembayaran
    ];

    // ✅ Otomatis ubah format tanggal ke Carbon
    protected $dates = ['payment_date', 'created_at', 'updated_at'];

    // ✅ Casting untuk format data di JSON
    protected $casts = [
        'total_amount' => 'integer',
        'paid_amount' => 'integer',
    ];

    // ==========================
    // 🔗 RELASI MODEL
    // ==========================

    public function billDetails(): HasMany
    {
        // Setiap bill memiliki banyak detail produk
        return $this->hasMany(BillDetail::class, 'bill_id', 'id');
    }

    public function customer(): BelongsTo
    {
        // Perbaikan nama model: Customer (bukan Customers)
        return $this->belongsTo(Customers::class, 'customer_id', 'id');
    }

    public function user(): BelongsTo
    {
        // Bill dibuat oleh User tertentu (kasir/admin)
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // ==========================
    // 🧮 ACCESSOR TAMBAHAN (opsional)
    // ==========================
    
    // Hitung sisa pembayaran otomatis
    public function getRemainingAmountAttribute()
    {
        return $this->total_amount - $this->paid_amount;
    }

    // Ubah status otomatis berdasarkan pembayaran
    public function getPaymentStatusAttribute()
    {
        if ($this->paid_amount >= $this->total_amount) {
            return 'PAID';
        } elseif ($this->paid_amount > 0) {
            return 'PARTIAL';
        }
        return 'UNPAID';
    }
}
