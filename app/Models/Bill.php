<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model ini.
     *
     * @var string
     */
    protected $table = 'bills';

    /**
     * Menentukan kolom primary key. Default-nya 'id'.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Menonaktifkan auto-incrementing untuk primary key karena kita menggunakan string ID.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Menentukan tipe primary key. Default-nya 'int'.
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
        'customer_id',
        'user_id',
    ];

    /**
     * Mendefinisikan relasi satu-ke-banyak dengan model BillDetail.
     * Sebuah Bill memiliki banyak BillDetail.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function billDetails(): HasMany
    {
        return $this->hasMany(BillDetail::class, 'bill_id', 'id');
    }
}