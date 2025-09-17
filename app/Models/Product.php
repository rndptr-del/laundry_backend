<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'type',
    ];

    // Tambahan untuk custom ID
    protected $primaryKey = 'id';
    public $incrementing = false;   // nonaktifkan auto increment
    protected $keyType = 'string';  // ubah tipe jadi string

    // Auto-generate UUID saat create
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
