<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'bill_id',
        'product_id',
        'qty',
        'price',
    ];

    // Relasi ke Bill
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    // Relasi ke Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
