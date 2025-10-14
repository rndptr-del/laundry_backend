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
        'total_amount',   // ✅ Tambah field total pembayaran
        'paid_amount',    // ✅ Tambah field jumlah yang sudah dibayar
        'status',         // ✅ Status: UNPAID, PARTIAL, PAID
        'payment_date',   // ✅ Tanggal konfirmasi pembayaran
    ];

    public function billDetails(): HasMany
    {
        return $this->hasMany(BillDetail::class, 'bill_id', 'id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'customer_id', 'id'); // ✅ perbaikan
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
