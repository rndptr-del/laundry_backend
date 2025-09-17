<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillDetail extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model ini.
     *
     * @var string
     */
    protected $table = 'bill_details';

    /**
     * Menentukan kolom primary key.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Menonaktifkan auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Menentukan tipe primary key.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Kolom-kolom yang dapat diisi secara massal (mass assignable).
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'bill_id',
        'product_id',
        'qty',
        'price',
    ];

    /**
     * Mendefinisikan relasi banyak-ke-satu dengan model Bill.
     * Setiap BillDetail 'milik' (belongsTo) satu Bill.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class, 'bill_id', 'id');
    }

    /**
     * Mendefinisikan relasi banyak-ke-satu dengan model Product.
     * Setiap BillDetail 'milik' (belongsTo) satu Product.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}